import assert from "node:assert/strict";
import { test } from "node:test";
import { demoDistanceKm, DEMO_JOB_DISTANCES_KM } from "../src/lib/demo-distances";
import { formatDistanceKm } from "../src/lib/distance";

test("illustrative distances require explicit demo mode and exact reserved fixture identity", () => {
  for (const [id, km] of Object.entries(DEMO_JOB_DISTANCES_KM)) {
    assert.equal(demoDistanceKm(id, {}), undefined);
    assert.equal(demoDistanceKm(id, { TRADE_LOCAL_DEMO: "0" }), undefined);
    assert.equal(demoDistanceKm(id, { TRADE_LOCAL_DEMO: "1" }), km);
    assert.equal(demoDistanceKm(id, { TRADE_HOSTED_PREVIEW: "1" }), km);
  }
  for (const id of ["real-user-listing", "1001", "demo-job-1007", "toString", "__proto__"]) {
    assert.equal(demoDistanceKm(id, { TRADE_HOSTED_PREVIEW: "1" }), undefined);
  }
});
test("distance presentation supports real zero and rejects invalid values", () => {
  assert.equal(formatDistanceKm(0), "0 km");
  assert.equal(formatDistanceKm(2.4), "2.4 km");
  for (const value of [undefined, NaN, Infinity, -1]) assert.equal(formatDistanceKm(value), "Distance unavailable");
});
