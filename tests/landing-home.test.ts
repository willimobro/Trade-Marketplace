import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { defaultWorkspaceMode, workspaceLinks } from "../src/lib/workspace-mode/preference";

const require = createRequire(import.meta.url);
const compile = (path: string) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const homeSource = compile("../src/app/page.tsx");
const returnSource = compile("../src/components/landing/LandingWorkspaceReturn.tsx");
type Element = { type: unknown; props: Record<string, unknown> };

function homeFixture(role: string | null) {
  const user = role ? { id: "signed-in-account", role } : null;
  let jobReads = 0;
  let settingReads = 0;
  let query: { where: { customerId?: string; status: { in: string[] } } } | undefined;
  const Landing = () => null;
  const Browse = () => null;
  const Workspace = () => null;
  const exports: { default?: (input: { searchParams: Promise<{ view?: string }> }) => Promise<Element> } = {};
  const mocks: Record<string, unknown> = {
    "@/lib/session": { getCurrentUser: async () => user },
    "@/lib/db": { db: { job: { findMany: async (input: typeof query) => { query = input; jobReads++; return []; } } } },
    "@/lib/settings": { getSettings: async () => { settingReads++; return {}; } },
    "@/lib/demo-distances": { demoDistanceKm: () => 1 },
    "@/lib/pricing": { jobRates: () => ({}), priceWork: () => ({ tradieTotalCents: 0 }) },
    "@/lib/constants": { formatNZD: () => "$0" },
    "@/lib/trade-readiness": { tradeRequirementsPending: () => false },
    "@/components/landing/CustomerLanding": { CustomerLanding: Landing },
    "@/components/HomeBrowse": { HomeBrowse: Browse },
    "@/components/workspace-mode/WorkspaceHome": { WorkspaceHome: Workspace },
  };
  runInNewContext(homeSource, { exports, require: (name: string) => name in mocks ? mocks[name] : require(name) });
  return { render: (view?: string) => exports.default!({ searchParams: Promise.resolve({ view }) }), Landing, Workspace, reads: () => ({ jobs: jobReads, settings: settingReads }), query: () => query };
}

test("root marketing renders for guests and every signed-in role before any job/pricing query", async () => {
  for (const role of [null, "CUSTOMER", "TRADIE", "ADMIN"]) {
    const fixture = homeFixture(role);
    const page = await fixture.render();
    assert.equal(page.type, fixture.Landing);
    assert.equal(page.props.role, role);
    assert.deepEqual(fixture.reads(), { jobs: 0, settings: 0 });
  }
});

test("explicit search retains existing role-scoped browse data and mode-aware wrapper", async () => {
  for (const role of [null, "CUSTOMER", "TRADIE", "ADMIN"]) {
    const fixture = homeFixture(role);
    const page = await fixture.render("search");
    assert.equal(page.type, fixture.Workspace);
    assert.equal(page.props.search, true);
    assert.deepEqual(fixture.reads(), { jobs: 1, settings: 1 });
    assert.equal(fixture.query()?.where.customerId, role === "CUSTOMER" ? "signed-in-account" : undefined);
    assert.equal(JSON.stringify(fixture.query()?.where.status.in), JSON.stringify(["BOOKABLE", "REVIEW"]));
  }
});

test("landing return reads the selected Customer/Trade mode without changing it or its account", () => {
  for (const role of ["CUSTOMER", "TRADIE"]) for (const mode of ["customer", "trade"] as const) {
    let modeChanges = 0;
    const exports: { LandingWorkspaceReturn?: (input: { role: string; compact?: boolean; className: string }) => Element } = {};
    const Link = () => null;
    const mocks: Record<string, unknown> = {
      "next/link": { default: Link, __esModule: true },
      "@/lib/workspace-mode/preference": { defaultWorkspaceMode, workspaceLinks },
      "@/components/workspace-mode/WorkspaceMode": { useWorkspaceMode: () => ({ enabled: true, ready: true, mode, actualRole: role, setMode: () => { modeChanges++; } }) },
    };
    runInNewContext(returnSource, { exports, require: (name: string) => name in mocks ? mocks[name] : require(name) });
    const returned = exports.LandingWorkspaceReturn!({ role, className: "landing-return" });
    assert.equal(returned.type, Link);
    assert.equal(returned.props.href, "/dashboard");
    assert.equal(returned.props["aria-label"], `Return to ${mode === "trade" ? "Trade" : "Customer"} dashboard`);
    const compact = exports.LandingWorkspaceReturn!({ role, compact: true, className: "landing-header" });
    assert.equal(compact.props.children, "Dashboard");
    assert.equal(modeChanges, 0);
  }
});
