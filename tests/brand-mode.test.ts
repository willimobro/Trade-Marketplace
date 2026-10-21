import assert from "node:assert/strict";
import { test } from "node:test";
import { brandMode } from "../src/lib/brand-mode";

test("tradie work surfaces select trade mode without a category restriction", () => {
  for (const route of ["/", "/jobs", "/jobs/example", "/dashboard", "/messages", "/tradies/example"]) assert.equal(brandMode("TRADIE", route), "trade");
});
test("shared auth, account, settings, admin and preview surfaces retain customer mode", () => {
  for (const route of ["/login", "/signup", "/profile", "/recovery", "/settings", "/settings/preferences", "/admin", "/admin/settings", "/preview", "/demo", "/preview/journey", "/notifications", "/support", "/jobs/new"]) assert.equal(brandMode("TRADIE", route), "customer");
  assert.equal(brandMode("TRADIE", null), "customer");
});
test("customers, administrators and guests never acquire trade accents", () => {
  for (const role of [null, "CUSTOMER", "ADMIN"]) for (const path of ["/", "/jobs", "/dashboard", "/profile"]) assert.equal(brandMode(role, path), "customer");
  assert.equal(brandMode("TRADIE", "/settings-other"), "trade", "Route matching uses path segment boundaries");
});
