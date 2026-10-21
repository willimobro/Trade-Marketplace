import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hourlyView, jobRates, priceWork, type Rates } from "../src/lib/pricing";

const standard: Rates = {
  tradieRateCents: 6000,
  holidayPayPct: 8,
  onCostPct: 12.5,
  marginPct: 20,
  gstPct: 15,
  minHours: 2,
};

describe("fixed-price and tradie-pay regression scenarios", () => {
  it("prices a two-hour job with $100 materials and distinguishes gross pay from customer total", () => {
    const quote = priceWork(2, 10000, standard);
    assert.equal(quote.tradieGrossCents, 12000);
    assert.equal(quote.holidayPayCents, 960);
    assert.equal(quote.tradieTotalCents, 12960); // Before PAYE, not take-home pay.
    assert.equal(quote.labourCostCents, 13500);
    assert.equal(quote.marginCents, 4700);
    assert.equal(quote.exGstCents, 28200);
    assert.equal(quote.gstCents, 4230);
    assert.equal(quote.totalCents, 32430);
  });

  it("applies the base-job minimum without charging the minimum twice", () => {
    assert.deepEqual(priceWork(0.5, 0, standard), priceWork(2, 0, standard));
    assert.equal(priceWork(2, 0, standard).hours, 2);
    assert.equal(priceWork(3, 0, standard).hours, 3);
  });

  it("does not inflate a half-hour variation to the base-job minimum", () => {
    const variation = priceWork(0.5, 2500, standard, { applyMinimum: false });
    assert.equal(variation.hours, 0.5);
    assert.equal(variation.tradieTotalCents, 3240);
    assert.equal(variation.totalCents, 8108); // $70.50 + $10.58 rounded GST.
  });

  it("keeps tradie earnings unchanged when materials or TM margin change", () => {
    const initial = priceWork(2, 0, standard);
    const larger = priceWork(2, 50000, { ...standard, marginPct: 30 });
    assert.equal(larger.tradieGrossCents, initial.tradieGrossCents);
    assert.equal(larger.tradieTotalCents, initial.tradieTotalCents);
    assert.ok(larger.totalCents > initial.totalCents);
  });

  it("does not add holiday pay twice on top of labour on-costs", () => {
    const quote = priceWork(2, 0, standard);
    assert.equal(quote.onCostCents, 1500);
    assert.equal(quote.labourCostCents, 13500);
    assert.equal(quote.totalCents, 18630);
  });

  it("rounds a fractional-hour quote to integer cents at each monetary stage", () => {
    const quote = priceWork(1.125, 1234, { ...standard, minHours: 0, tradieRateCents: 6001 });
    assert.equal(quote.tradieGrossCents, 6751);
    assert.equal(quote.holidayPayCents, 540);
    assert.equal(quote.onCostCents, 844);
    assert.equal(quote.marginCents, 1766);
    assert.equal(quote.gstCents, 1589);
    assert.equal(quote.totalCents, 12184);
    for (const [key, value] of Object.entries(quote)) {
      if (key.endsWith("Cents")) assert.ok(Number.isInteger(value), `${key} must remain integer cents`);
    }
  });

  it("reconciles customer total and pay breakdown across representative job sizes", () => {
    for (const hours of [0.5, 2, 2.25, 8, 40]) {
      for (const materials of [0, 1, 9999, 250000]) {
        const p = priceWork(hours, materials, standard);
        assert.equal(p.totalCents, p.exGstCents + p.gstCents);
        assert.equal(p.exGstCents, p.labourCostCents + p.materialsCents + p.marginCents);
        assert.equal(p.tradieTotalCents, p.tradieGrossCents + p.holidayPayCents);
      }
    }
  });

  it("shows the effective hourly illustration independently of the two-hour minimum", () => {
    assert.deepEqual(hourlyView(standard), {
      tradiePerHourCents: 6480,
      customerPerHourCents: 9315,
      tmPerHourCents: 1350,
    });
  });
});

describe("job rate snapshot behavior", () => {
  const snapshot = { tradieRateCents: 6000, onCostPct: 12.5, marginPct: 20, gstPct: 15 };

  it("uses saved rate, on-cost, margin and GST when current settings change", () => {
    const changed = { ...standard, tradieRateCents: 9000, onCostPct: 20, marginPct: 40, gstPct: 17 };
    const saved = jobRates(snapshot, changed);
    assert.equal(saved.tradieRateCents, 6000);
    assert.equal(saved.onCostPct, 12.5);
    assert.equal(saved.marginPct, 20);
    assert.equal(saved.gstPct, 15);
    assert.equal(priceWork(2, 10000, saved).totalCents, 32430);
  });

  it("falls back only for absent snapshots, preserving legitimate zero percentages", () => {
    const saved = jobRates({ tradieRateCents: null, onCostPct: 0, marginPct: 0, gstPct: 0 }, standard);
    assert.equal(saved.tradieRateCents, 6000);
    assert.equal(saved.onCostPct, 0);
    assert.equal(saved.marginPct, 0);
    assert.equal(saved.gstPct, 0);
    assert.equal(priceWork(2, 0, saved).totalCents, 12000);
  });

  it("documents the existing unsnapshotted holiday-pay and minimum-hour behavior", () => {
    // Characterization, not a guarantee: these two rates are absent from Job's snapshot.
    // A future financial-policy fix should change this expectation deliberately.
    const changed = { ...standard, holidayPayPct: 10, minHours: 3 };
    const saved = jobRates(snapshot, changed);
    assert.equal(saved.holidayPayPct, 10);
    assert.equal(saved.minHours, 3);
    assert.equal(priceWork(2, 0, saved, { applyMinimum: false }).tradieTotalCents, 13200);
  });
});
