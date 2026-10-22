import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import bcrypt from "bcryptjs";
import ts from "typescript";
import { CATEGORY_NAMES, REGIONS } from "../src/lib/constants";
import { previewAccount } from "../scripts/preview-identity.mjs";
import type { PreviewRoleState } from "../src/app/preview/PreviewRoles";

const require = createRequire(import.meta.url);
function load(source: string, mocks: Record<string, unknown>, context: Record<string, unknown> = {}) {
  const compiled = ts.transpileModule(readFileSync(new URL(source, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const exports: Record<string, unknown> = {};
  runInNewContext(compiled + (source.endsWith("/preview/page.tsx") ? "\nexports.chooseRole = chooseRole;" : ""), {
    exports, require: (name: string) => name in mocks ? mocks[name] : require(name), ...context,
  });
  return exports;
}
type Action = (previous: PreviewRoleState, form: FormData) => Promise<PreviewRoleState>;
const fixturePassword = "isolated-test-password";
const hash = bcrypt.hashSync(fixturePassword, 4);

test("shared password session verifies the stored hash before creating a session", async () => {
  const sessions: string[] = [];
  const loaded = load("../src/lib/password-session.ts", {
    "server-only": {},
    "./db": { db: { user: { findUnique: async ({ where }: { where: { email: string } }) => where.email === "customer@demo.test" ? { id: "fixture-user", passwordHash: hash } : null } } },
    "./session": { createSession: async (id: string) => { sessions.push(id); } },
  });
  const authenticate = loaded.createPasswordSession as (email: string, password: string) => Promise<boolean>;
  assert.equal(await authenticate("missing@demo.test", fixturePassword), false);
  assert.equal(await authenticate("customer@demo.test", "wrong-password"), false);
  assert.deepEqual(sessions, []);
  assert.equal(await authenticate("customer@demo.test", fixturePassword), true);
  assert.deepEqual(sessions, ["fixture-user"]);
});

test("ordinary login retains normalized credentials, failure behavior and safe redirect destinations", async () => {
  const calls: { email: string; password: string }[] = [];
  let valid = true;
  const loaded = load("../src/app/actions/auth.ts", {
    "@/lib/db": { db: {} },
    "@/lib/constants": { CATEGORY_NAMES, REGIONS },
    "@/lib/session": {},
    "@/lib/password-session": { createPasswordSession: async (email: string, password: string) => { calls.push({ email, password }); return valid; } },
    "next/navigation": { redirect: (destination: string) => { throw new Error("REDIRECT:" + destination); } },
  });
  const login = loaded.login as Action;
  const form = new FormData(); form.set("email", "  CUSTOMER@DEMO.TEST  "); form.set("password", fixturePassword);
  valid = false;
  assert.equal((await login(undefined, form))?.error, "Wrong email or password.");
  valid = true;
  for (const [next, expected] of [["/jobs/new", "/jobs/new"], ["//external.test", "/dashboard"], ["https://external.test", "/dashboard"]]) {
    form.set("next", next);
    await assert.rejects(login(undefined, form), error => error instanceof Error && error.message === "REDIRECT:" + expected);
  }
  assert.ok(calls.every(call => call.email === "customer@demo.test" && call.password === fixturePassword));
});

function previewFixture({ enabled = true, password = "isolated-preview-password-".repeat(2), valid = true } = {}) {
  const calls: { email: string; password: string }[] = [];
  const loaded = load("../src/app/preview/page.tsx", {
    "server-only": {},
    "next/link": { default: () => null, __esModule: true },
    "next/navigation": { notFound: () => { throw new Error("NOT_FOUND"); } },
    "@/lib/hosted-preview": { canUseHostedPreview: async () => enabled },
    "@/lib/password-session": { createPasswordSession: async (email: string, secret: string) => { calls.push({ email, password: secret }); return valid; } },
    "../../../scripts/preview-identity.mjs": { previewAccount },
    "./PreviewRoles": { PreviewRoles: () => null },
  }, { process: { env: { PREVIEW_ACCOUNT_PASSWORD: password } } });
  const action = loaded.chooseRole as Action;
  return { calls, password, choose: (role: string) => { const form = new FormData(); form.set("role", role); form.set("next", "https://external.test"); return action(undefined, form); } };
}

test("preview role selection still verifies each fixed account and returns only its bounded destination", async () => {
  const fixture = previewFixture();
  for (const [role, email, destination] of [["customer", "customer@demo.test", "/dashboard"], ["tradie", "sparky@demo.test", "/dashboard"], ["admin", "admin@demo.test", "/admin"]]) {
    const result = await fixture.choose(role);
    assert.equal(result?.destination, destination);
    assert.equal(fixture.calls.at(-1)?.email, email);
    assert.equal(fixture.calls.at(-1)?.password, fixture.password);
    assert.equal(JSON.stringify(result).includes(fixture.password), false);
  }
  assert.equal(fixture.calls.length, 3);
});

test("preview authentication stays unavailable without the boot gate, valid role, secret and password verification", async () => {
  const ordinary = previewFixture({ enabled: false });
  await assert.rejects(ordinary.choose("admin"), /NOT_FOUND/);
  assert.equal(ordinary.calls.length, 0);
  const invalid = previewFixture();
  for (const role of ["constructor", "__proto__", "other@demo.test", ""]) assert.ok((await invalid.choose(role))?.error);
  assert.equal(invalid.calls.length, 0);
  const missing = previewFixture({ password: "" });
  assert.ok((await missing.choose("customer"))?.error);
  assert.equal(missing.calls.length, 0);
  const wrong = previewFixture({ valid: false });
  assert.ok((await wrong.choose("customer"))?.error);
  assert.equal((await wrong.choose("customer"))?.destination, undefined);
});

function clientFixture(result: PreviewRoleState) {
  let submit: Action | undefined;
  const destinations: string[] = [];
  const loaded = load("../src/app/preview/PreviewRoles.tsx", {
    react: { useActionState: (action: Action) => { submit = action; return [undefined, () => {}, false]; } },
  }, { window: { location: { assign: (destination: string) => destinations.push(destination) } } });
  (loaded.PreviewRoles as (props: { action: Action }) => unknown)({ action: async () => result });
  return { submit: () => submit!(undefined, new FormData()), destinations };
}

test("client navigation consumes each success once, including repeated roles with the same destination", async () => {
  const fixture = clientFixture({ destination: "/dashboard" });
  assert.equal(await fixture.submit(), undefined);
  assert.equal(await fixture.submit(), undefined);
  assert.deepEqual(fixture.destinations, ["/dashboard", "/dashboard"]);
});

test("failed sign-in and unexpected destinations never trigger client navigation", async () => {
  for (const result of [{ error: "Unavailable" }, { destination: "https://external.test" }, { destination: "//external.test" }]) {
    const fixture = clientFixture(result);
    assert.ok((await fixture.submit())?.error);
    assert.deepEqual(fixture.destinations, []);
  }
});
