import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../src/app/actions/jobs.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

type Receipt = { jobId?: string; error?: string } | undefined;
function fixture({ create, uploadError, role = "CUSTOMER" }: { create: () => Promise<{ id: string }>; uploadError?: string; role?: string }) {
  let writes = 0;
  let authDestination: string | undefined;
  const exports: { createJob?: (previous: Receipt, form: FormData) => Promise<Receipt> } = {};
  const mocks: Record<string, unknown> = {
    "next/cache": { revalidatePath: () => {} },
    "@/lib/db": { db: { job: { create: async () => { writes++; return create(); } } } },
    "@/lib/session": { requireUser: async (destination: string) => { authDestination = destination; return { id: "customer-fixture", role }; } },
    "@/lib/uploads": { saveUploads: async () => { if (uploadError) throw new Error(uploadError); return ["/fixture/photo.png"]; } },
    "@/lib/jobs": { nextJobNumber: async () => 1001, completeJob: () => {} },
    "@/lib/constants": { CATEGORY_NAMES: ["Electrical"], REGIONS: ["Southland"] },
  };
  runInNewContext(compiled, { exports, require: (name: string) => {
    if (name === "next/navigation") throw new Error("Creation must return a receipt rather than invoke the redirect rendering path");
    return name in mocks ? mocks[name] : require(name);
  } });
  const form = new FormData();
  for (const [name, value] of Object.entries({ title: "Fixture electrical job", description: "A sufficiently detailed fixture description.", category: "Electrical", region: "Southland", suburb: "Waverley", address: "1 Fixture Street" })) form.set(name, value);
  return { submit: () => exports.createJob!(undefined, form), writes: () => writes, authDestination: () => authDestination };
}

test("creation returns a persisted identity only after the write completes, with no redirect dependency", async () => {
  let finish!: (job: { id: string }) => void;
  const saved = new Promise<{ id: string }>((resolve) => { finish = resolve; });
  const f = fixture({ create: () => saved });
  let completed = false;
  const result = f.submit().then((receipt) => { completed = true; return receipt; });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(f.writes(), 1);
  assert.equal(completed, false);
  finish({ id: "persisted-fixture-job" });
  const receipt = await result;
  assert.equal(receipt?.jobId, "persisted-fixture-job");
  assert.equal(receipt?.error, undefined);
  assert.equal(f.authDestination(), "/jobs/new");
});

test("upload validation errors return no saved identity and never write", async () => {
  const f = fixture({ create: async () => ({ id: "should-not-exist" }), uploadError: "Invalid photo" });
  const result = await f.submit();
  assert.equal(result?.error, "Invalid photo");
  assert.equal(result?.jobId, undefined);
  assert.equal(f.writes(), 0);
});

test("failed writes do not produce a success receipt", async () => {
  const f = fixture({ create: async () => { throw new Error("Fixture database unavailable"); } });
  await assert.rejects(f.submit(), /Fixture database unavailable/);
});

test("tradie accounts cannot create a job or receive a saved identity", async () => {
  const f = fixture({ create: async () => ({ id: "should-not-exist" }), role: "TRADIE" });
  const result = await f.submit();
  assert.match(result?.error ?? "", /Only customer/);
  assert.equal(result?.jobId, undefined);
  assert.equal(f.writes(), 0);
});
