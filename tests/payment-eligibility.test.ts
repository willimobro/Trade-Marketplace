import assert from "node:assert/strict";
import { test } from "node:test";
import { canRecordPayment } from "../src/lib/payment-eligibility";

test("saved variation checkout is unavailable after cancellation or outside assignment", () => {
  for (const status of ["REVIEW", "PRICED", "BOOKABLE", "SUBMITTED", "COMPLETED", "CANCEL_REVIEW", "CANCELLED"]) {
    assert.equal(canRecordPayment({ kind: "VARIATION", status: "PENDING", job: { status }, variation: { status: "PRICED" } }), false, status);
  }
  assert.equal(canRecordPayment({ kind: "VARIATION", status: "PENDING", job: { status: "ASSIGNED" }, variation: { status: "PRICED" } }), true);
});
test("only pending checkouts for the correct stage can be recorded", () => {
  assert.equal(canRecordPayment({ kind: "JOB", status: "PENDING", job: { status: "PRICED" }, variation: null }), true);
  for (const status of ["PAID", "REFUNDED"]) assert.equal(canRecordPayment({ kind: "VARIATION", status, job: { status: "ASSIGNED" }, variation: { status: "PRICED" } }), false);
  for (const status of ["REQUESTED", "APPROVED", "DECLINED"]) assert.equal(canRecordPayment({ kind: "VARIATION", status: "PENDING", job: { status: "ASSIGNED" }, variation: { status } }), false);
});
