import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = ts.transpileModule(readFileSync(new URL("../src/components/app-home/SignedInHome.tsx", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;

test("Home summaries read only the actual tradie's assignments and saved pending payroll", async () => {
  const requests: { kind: string; query: unknown }[] = [];
  const exports: { SignedInHome?: (input: { user: { id: string; role: string; name: string; region: string } }) => Promise<{ props: { activeJobs: unknown[]; pendingPayCents: number } }> } = {};
  const mocks: Record<string, unknown> = {
    "@/lib/db": { db: { job: { findMany: async (query: unknown) => { requests.push({ kind: "jobs", query }); return [{ id: "owned", title: "Owned job", status: "ASSIGNED", photos: [{ url: "/photo" }] }]; } }, payout: { findMany: async (query: unknown) => { requests.push({ kind: "pay", query }); return [{ grossCents: 10000, holidayPayCents: 800 }]; } } } },
    "./AppHome": { AppHome: () => null },
    "next/navigation": { redirect: () => { throw new Error("admin-redirect"); } },
  };
  runInNewContext(source, { exports, require: (name: string) => name in mocks ? mocks[name] : require(name) });
  const user = { id: "actual-owner", name: "Jack", role: "TRADIE", region: "Wellington" };
  const page = await exports.SignedInHome!({ user });
  assert.equal(page.props.pendingPayCents, 10800);
  assert.equal(JSON.stringify(page.props.activeJobs), JSON.stringify([{ id: "owned", title: "Owned job", status: "ASSIGNED", cover: "/photo" }]));
  assert.deepEqual(JSON.parse(JSON.stringify(requests.map(item => (item.query as { where: unknown }).where))), [
    { tradieId: "actual-owner", status: { in: ["ASSIGNED", "SUBMITTED", "CANCEL_REVIEW"] } },
    { tradieId: "actual-owner", status: "PENDING" },
  ]);
  requests.length = 0;
  const customer = await exports.SignedInHome!({ user: { ...user, role: "CUSTOMER" } });
  assert.equal(requests.length, 0);
  assert.equal(customer.props.pendingPayCents, 0);
  await assert.rejects(exports.SignedInHome!({ user: { ...user, role: "ADMIN" } }), /admin-redirect/);
  assert.equal(requests.length, 0);
});
