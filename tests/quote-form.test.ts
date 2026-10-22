import assert from "node:assert/strict";
import test from "node:test";
import { quoteFormError } from "../src/components/quote-feed/quote-form";
import { createInitialState, getPointsBalance } from "../src/lib/quote-demo/model";

const scope = "Includes labour, materials and testing.";

test("quote form associates amount errors with the amount field before attempting a save", () => {
  for (const amount of ["", "0", "0.99", "-1", "1.234", "1e3", "Infinity", "1000000.01"]) {
    const error = quoteFormError(amount, scope);
    assert.equal(error?.field, "amount", amount);
    assert.ok(error?.message);
  }
  assert.equal(quoteFormError("", "")?.field, "amount", "the first required field wins when both are incomplete");
});

test("quote form associates scope errors only with the scope field when the amount is valid", () => {
  for (const note of ["", "short", " ".repeat(20), "x".repeat(1001)]) {
    assert.equal(quoteFormError("245.50", note)?.field, "scope");
  }
  assert.equal(quoteFormError("1", "x".repeat(10)), null);
  assert.equal(quoteFormError("1000000", "x".repeat(1000)), null);
  assert.equal(quoteFormError(" 245.50 ", ` ${scope} `), null);
});

test("validating or retrying a quote form does not award points or create a ledger entry", () => {
  const state = createInitialState("sample-user");
  const before = JSON.stringify(state);
  for (let index = 0; index < 3; index += 1) {
    assert.equal(quoteFormError("245.50", scope), null);
    assert.equal(quoteFormError("245.50", "")?.field, "scope");
  }
  assert.equal(JSON.stringify(state), before);
  assert.equal(getPointsBalance(state), 3);
  assert.equal(state.quotes.length, 0);
});
