import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as readiness from "../src/lib/trade-readiness";

const require = createRequire(import.meta.url);
function load<T>(file: string, mocks: Record<string, unknown>): T {
  const source = readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  runInNewContext(compiled, { exports, require: (name: string) => name in mocks ? mocks[name] : require(name) });
  return exports as T;
}
type Outcome = { error?: string; ok?: string };
type TradieActions = {
  requestVariation: (id: string, previous: undefined, form: FormData) => Promise<Outcome>;
  submitEstimate: (id: string, previous: undefined, form: FormData) => Promise<Outcome>;
  claimJob: (id: string) => Promise<Outcome>;
  submitCoc: (id: string, previous: undefined, form: FormData) => Promise<Outcome>;
};
type Update = { where: Record<string, unknown>; data: Record<string, unknown> };
function tradieFixture(category: string, trade = "Electrical", claimCount = 1) {
  let writes = 0;
  let uploads = 0;
  let claim: Update | undefined;
  const actions = load<TradieActions>("app/actions/tradie.ts", {
    "next/cache": { revalidatePath() {} },
    "@/lib/session": { requireUser: async () => ({ id: "worker", role: "TRADIE", trade, licenceVerified: true }) },
    "@/lib/trade-readiness": readiness,
    "@/lib/uploads": { saveUploads: async () => { uploads++; return ["/fixture.png"]; } },
    "@/lib/db": { db: {
      job: {
        findUnique: async () => ({ category, status: category === "Electrical" ? "BOOKABLE" : "REVIEW", tradieId: "worker", variations: [] }),
        updateMany: async (args: Update) => { writes++; claim = args; return { count: claimCount }; },
      },
      estimate: { upsert: async () => { writes++; } },
    } },
  });
  return { actions, writes: () => writes, uploads: () => uploads, claim: () => claim };
}

test("verified electrician cannot estimate a different trade and performs no write", async () => {
  const f = tradieFixture("Plumbing");
  const form = new FormData();
  form.set("hours", "2"); form.set("materials", "20");
  assert.match((await f.actions.submitEstimate("job", undefined, form)).error ?? "", /must match/);
  assert.equal(f.writes(), 0);
  assert.equal(f.uploads(), 0);
});

test("claim remains atomic across stage, assignment and matching category", async () => {
  const f = tradieFixture("Electrical");
  assert.ok((await f.actions.claimJob("job")).ok);
  assert.deepEqual(JSON.parse(JSON.stringify(f.claim()?.where)), { id: "job", status: "BOOKABLE", tradieId: null, category: "Electrical" });
  assert.equal(f.claim()?.data.tradieId, "worker");
  assert.equal(f.claim()?.data.status, "ASSIGNED");
  const lost = tradieFixture("Electrical", "Electrical", 0);
  assert.ok((await lost.actions.claimJob("job")).error);
  const mismatch = tradieFixture("Construction");
  assert.match((await mismatch.actions.claimJob("job")).error ?? "", /must match/);
  assert.equal(mismatch.writes(), 0);
});

test("non-electrical CoC completion is rejected before uploading or writing", async () => {
  let uploads = 0;
  const actions = load<TradieActions>("app/actions/tradie.ts", {
    "next/cache": { revalidatePath() {} },
    "@/lib/session": { requireUser: async () => ({ id: "worker", role: "TRADIE", trade: "Plumbing", licenceVerified: true }) },
    "@/lib/trade-readiness": readiness,
    "@/lib/uploads": { saveUploads: async () => { uploads++; throw new Error("Must not upload"); } },
    "@/lib/db": { db: {
      job: { findUnique: async () => ({ category: "Plumbing", status: "ASSIGNED", tradieId: "worker", variations: [] }) },
      $transaction: () => { throw new Error("Must not write"); },
      coc: { create: () => { throw new Error("Must not write CoC"); } },
    } },
  });
  assert.match((await actions.submitCoc("job", undefined, new FormData())).error ?? "", /Completion requirements.*not configured/);
  assert.equal(uploads, 0);
});

test("admin verification predicate permits electrical only while removal is trade-independent", async () => {
  const updates: Update[] = [];
  let authorized = 0;
  let count = 1;
  const actions = load<{ setLicence: (id: string, verified: boolean) => Promise<void> }>("app/actions/admin.ts", {
    "next/cache": { revalidatePath() {} },
    "@/lib/session": { requireAdmin: async () => { authorized++; } },
    "@/lib/db": { db: { user: { updateMany: async (args: Update) => { updates.push(args); return { count }; } } } },
    "@/lib/settings": {}, "@/lib/pricing": {}, "@/lib/jobs": {},
  });
  await actions.setLicence("worker", true);
  await actions.setLicence("worker", false);
  assert.deepEqual(JSON.parse(JSON.stringify(updates[0])), { where: { id: "worker", role: "TRADIE", trade: "Electrical" }, data: { licenceVerified: true } });
  assert.deepEqual(JSON.parse(JSON.stringify(updates[1])), { where: { id: "worker", role: "TRADIE" }, data: { licenceVerified: false } });
  count = 0;
  await assert.rejects(actions.setLicence("worker", true), /only for electrical/);
  assert.equal(authorized, 3);
});

test("completion and overdue release exclude unconfigured trades before payroll writes", async () => {
  let overdueQuery: { where: Record<string, unknown> } | undefined;
  const actions = load<{ completeJob: (id: string) => Promise<boolean>; releaseOverdue: () => Promise<void> }>("lib/jobs.ts", {
    "server-only": {},
    "./db": { db: {
      job: {
        findUniqueOrThrow: async () => ({ category: "Gas Fitting", status: "SUBMITTED", tradieId: "worker", hours: 2, variations: [] }),
        findMany: async (args: { where: Record<string, unknown> }) => { overdueQuery = args; return []; },
        updateMany: () => { throw new Error("Must not complete"); },
      },
      payout: { create: () => { throw new Error("Must not queue payroll"); } },
    } },
    "./settings": { getSettings: async () => ({ autoReleaseHours: 48 }) },
    "./pricing": { jobRates: () => { throw new Error("Must not price unsupported completion"); } },
  });
  assert.equal(await actions.completeJob("job"), false);
  await actions.releaseOverdue();
  assert.equal(overdueQuery?.where.category, "Electrical");
  assert.equal(overdueQuery?.where.status, "SUBMITTED");
});


test("variation rejects legacy cross-trade assignments before uploads or writes, retaining valid electrical requests", async () => {
  for (const category of ["Plumbing", "Gas Fitting", "Construction", "Electrical"]) {
    let uploads = 0;
    let writes = 0;
    const actions = load<TradieActions>("app/actions/tradie.ts", {
      "next/cache": { revalidatePath() {} },
      "@/lib/session": { requireUser: async () => ({ id: "worker", role: "TRADIE", trade: "Electrical", licenceVerified: true }) },
      "@/lib/trade-readiness": readiness,
      "@/lib/uploads": { saveUploads: async () => { uploads++; return ["/fixture.png"]; } },
      "@/lib/db": { db: {
        job: { findUnique: async () => ({ category, status: "ASSIGNED", tradieId: "worker" }) },
        variation: { create: async () => { writes++; } },
      } },
    });
    const form = new FormData();
    form.set("description", "Additional work with a valid description");
    form.set("hours", "2");
    const outcome = await actions.requestVariation("legacy-job", undefined, form);
    if (category === "Electrical") {
      assert.ok(outcome.ok); assert.equal(uploads, 1); assert.equal(writes, 1);
    } else {
      assert.match(outcome.error ?? "", /must match/);
      assert.equal(uploads, 0); assert.equal(writes, 0);
    }
  }
});
