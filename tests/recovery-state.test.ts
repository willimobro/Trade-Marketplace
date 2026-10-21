import assert from "node:assert/strict";
import { test } from "node:test";
import { DEMO_EMAIL, DEMO_PASSWORD, emailError, passwordRequirements, recoveryStage, resetErrors } from "../src/app/recovery/recovery-state";

test("recovery URL states select known screens without trusting arbitrary input", () => {
  for (const stage of ["request", "sent", "expired", "invalid", "reset", "complete"] as const) assert.equal(recoveryStage(stage), stage);
  for (const stage of [undefined, "", "__proto__", "constructor", "unknown"]) assert.equal(recoveryStage(stage), "request");
});

test("email validation accepts example addresses and rejects missing or malformed addresses", () => {
  assert.equal(emailError(DEMO_EMAIL), undefined);
  assert.equal(emailError("  person+jobs@example.co.nz  "), undefined);
  for (const email of ["", "   ", "person", "a@@example.com", "a b@example.com", "person@example", "@example.com"]) assert.equal(typeof emailError(email), "string");
});

test("reset validates requirements and matching confirmation independently", () => {
  assert.deepEqual(passwordRequirements(DEMO_PASSWORD), { length: true });
  assert.deepEqual(resetErrors(DEMO_PASSWORD, DEMO_PASSWORD), { password: undefined, confirmation: undefined });
  assert.ok(resetErrors("", "").password);
  assert.ok(resetErrors("", "").confirmation);
  for (const weak of ["Trade12", "a", "1234567"]) assert.ok(resetErrors(weak, weak).password);
  assert.equal(resetErrors("password", "password").password, undefined);
  assert.equal(resetErrors(DEMO_PASSWORD, "different").password, undefined);
  assert.ok(resetErrors(DEMO_PASSWORD, "different").confirmation);
});
