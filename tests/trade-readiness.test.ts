import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getTradeActionBlocker, tradeRequirementsPending } from "../src/lib/trade-readiness";

describe("trade eligibility", () => {
  it("allows verified electricians on electrical jobs only", () => {
    const electrician = { trade: "Electrical", licenceVerified: true };
    assert.equal(getTradeActionBlocker(electrician, "Electrical"), null);
    for (const category of ["Plumbing", "Gas Fitting", "Construction"]) {
      assert.match(getTradeActionBlocker(electrician, category)!, /must match/);
    }
  });

  it("requires existing electrical verification", () => {
    assert.match(getTradeActionBlocker({ trade: "Electrical", licenceVerified: false }, "Electrical")!, /licence.*verified/);
    assert.equal(tradeRequirementsPending("Electrical"), false);
  });

  it("does not treat a legacy verified flag as configured requirements for other trades", () => {
    for (const trade of ["Plumbing", "Gas Fitting", "Construction", "Unknown trade"]) {
      assert.equal(tradeRequirementsPending(trade), true);
      for (const licenceVerified of [false, true]) {
        assert.match(getTradeActionBlocker({ trade, licenceVerified }, trade)!, /not configured/);
        assert.match(getTradeActionBlocker({ trade, licenceVerified }, "Electrical")!, /must match/);
      }
    }
  });

  it("fails closed for absent trade and unrecognized category", () => {
    assert.equal(tradeRequirementsPending(null), true);
    assert.match(getTradeActionBlocker({ trade: null, licenceVerified: true }, "Electrical")!, /Choose your trade/);
    assert.ok(getTradeActionBlocker({ trade: "Electrical", licenceVerified: true }, "electrical"));
    assert.ok(getTradeActionBlocker({ trade: "Electrical", licenceVerified: true }, ""));
  });
});
