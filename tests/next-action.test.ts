import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextAction } from "../src/app/jobs/[id]/next-action";

describe("job guidance respects the next actor and financial state", () => {
  it("distinguishes a tradie's private estimate from the customer's fixed-price review", () => {
    assert.match(nextAction("REVIEW", "tradie"), /private estimate/i);
    assert.match(nextAction("REVIEW", "tradie"), /Trade Marketplace sets/i);
    assert.match(nextAction("PRICED", "customer"), /review.*fixed price/i);
    assert.match(nextAction("PRICED", "customer"), /No tradie is assigned/i);
    assert.match(nextAction("BOOKABLE", "tradie"), /only after a successful claim/i);
  });

  it("does not turn a paid, unclaimed job into a confirmed appointment", () => {
    assert.match(nextAction("BOOKABLE", "customer"), /Waiting.*claim/i);
    assert.match(nextAction("BOOKABLE", "customer"), /No appointment/i);
    assert.match(nextAction("BOOKABLE", "admin"), /Waiting.*claim/i);
  });

  it("routes submitted work to customer/admin sign-off while the electrician waits", () => {
    assert.match(nextAction("SUBMITTED", "customer"), /review.*CoC.*confirm completion/i);
    assert.match(nextAction("SUBMITTED", "assigned"), /Waiting.*sign-off/i);
    assert.match(nextAction("SUBMITTED", "admin"), /review.*CoC.*sign off/i);
  });

  it("never equates completion with an electrician having received money", () => {
    assert.match(nextAction("COMPLETED", "assigned"), /payroll record is separate/i);
    assert.match(nextAction("COMPLETED", "assigned"), /manually recorded/i);
    assert.match(nextAction("COMPLETED", "admin"), /not proof of payment/i);
    assert.match(nextAction("COMPLETED", "customer"), /payment record.*leave a review/i);
  });

  it("distinguishes cancellation investigation from a recorded refund", () => {
    assert.match(nextAction("CANCEL_REVIEW", "customer"), /refund is not confirmed/i);
    assert.match(nextAction("CANCEL_REVIEW", "assigned"), /no refund outcome is confirmed/i);
    assert.match(nextAction("CANCEL_REVIEW", "admin"), /investigate/i);
    assert.match(nextAction("CANCELLED", "customer"), /Check the payment record.*any recorded refund/i);
    assert.match(nextAction("CANCELLED", "admin"), /any recorded refund/i);
  });
});


it("pending trades never promise estimates, claims or completion in customer status guidance", () => {
  for (const category of ["Plumbing", "Gas Fitting", "Construction"]) {
    for (const status of ["REVIEW", "PRICED", "BOOKABLE", "ASSIGNED", "SUBMITTED"]) {
      const message = nextAction(status, "customer", category);
      assert.match(message, /requirements are pending/);
      assert.doesNotMatch(message, /provide private estimates|can claim|please confirm/i);
    }
    assert.match(nextAction("CANCELLED", "customer", category), /cancelled/i);
  }
});
