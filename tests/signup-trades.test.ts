import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { CATEGORY_NAMES, REGIONS } from "../src/lib/constants";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../src/app/actions/auth.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function fixture() {
  let written: Record<string, unknown> | undefined;
  let sessions = 0;
  const exports: { signup?: (previous: undefined, form: FormData) => Promise<{ error?: string } | undefined> } = {};
  const mocks: Record<string, unknown> = {
    bcryptjs: { default: { hash: async () => "fixture-password-hash" } },
    "next/navigation": { redirect: () => { throw new Error("FIXTURE_REDIRECT"); } },
    "@/lib/db": { db: { user: { findUnique: async () => null, create: async ({ data }: { data: Record<string, unknown> }) => { written = data; return { id: "fixture-user" }; } } } },
    "@/lib/session": { createSession: async () => { sessions++; }, destroySession: async () => {} },
    "@/lib/password-session": { createPasswordSession: async () => { throw new Error("Signup must not use password login"); } },
    "@/lib/constants": { CATEGORY_NAMES, REGIONS },
  };
  runInNewContext(compiled, { exports, require: (name: string) => name in mocks ? mocks[name] : require(name) });
  return { submit: (trade: string, registrationNo = "", role = "TRADIE") => {
    const form = new FormData();
    for (const [key, value] of Object.entries({ name: "Demo Tradie", email: "demo@example.test", password: "fixture-password", role, region: REGIONS[0], trade, registrationNo, licenceVerified: "true" })) form.set(key, value);
    return exports.signup!(undefined, form);
  }, written: () => written, sessions: () => sessions };
}

test("Electrical registration remains required server-side, including whitespace-only input", async () => {
  for (const registration of ["", "   "]) {
    const f = fixture();
    assert.match((await f.submit("Electrical", registration))?.error ?? "", /Electrical registration/);
    assert.equal(f.written(), undefined);
    assert.equal(f.sessions(), 0);
  }
});

test("all four supported trades can sign up but none is auto-verified", async () => {
  for (const trade of CATEGORY_NAMES) {
    const f = fixture();
    await assert.rejects(f.submit(trade, trade === "Electrical" ? "E-FIXTURE" : ""), /FIXTURE_REDIRECT/);
    assert.equal(f.written()?.trade, trade);
    assert.equal(f.written()?.licenceVerified, false);
    assert.equal(f.written()?.registrationNo, trade === "Electrical" ? "E-FIXTURE" : null);
    assert.equal(f.sessions(), 1);
  }
});

test("unrecognised or empty tradie category is rejected without creating an account", async () => {
  for (const trade of ["", "Unrecognised"]) {
    const f = fixture();
    assert.match((await f.submit(trade))?.error ?? "", /Pick your trade/);
    assert.equal(f.written(), undefined);
  }
});

test("customer signup does not acquire trade credentials from submitted fields", async () => {
  const f = fixture();
  await assert.rejects(f.submit("Electrical", "E-FIXTURE", "CUSTOMER"), /FIXTURE_REDIRECT/);
  assert.equal(f.written()?.trade, null);
  assert.equal(f.written()?.registrationNo, null);
  assert.equal(f.written()?.licenceVerified, false);
});
