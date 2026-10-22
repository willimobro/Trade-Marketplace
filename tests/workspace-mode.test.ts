import assert from "node:assert/strict";
import test from "node:test";
import { allowsWorkspaceDemo, defaultWorkspaceMode, parseWorkspaceMode, serializeWorkspaceMode, workspaceHomeRedirect, workspaceLinks, workspaceModeKey } from "../src/lib/workspace-mode/preference";

test("mode simulation requires allowed runtime and exact reserved customer/tradie identities", () => {
  for (const [role, email] of [["CUSTOMER", "customer@demo.test"], ["TRADIE", "sparky@demo.test"]]) {
    assert.equal(allowsWorkspaceDemo(true, { role, email }), true);
    assert.equal(allowsWorkspaceDemo(false, { role, email }), false);
  }
  for (const user of [null, { role: "ADMIN", email: "admin@demo.test" }, { role: "TRADIE", email: "real@example.com" }, { role: "TRADIE", email: "customer@demo.test" }]) assert.equal(allowsWorkspaceDemo(true, user), false);
});
test("mode preference is bounded, versioned and account scoped", () => {
  for (const mode of ["customer", "trade"] as const) assert.equal(parseWorkspaceMode(serializeWorkspaceMode(mode)), mode);
  for (const raw of [null, "broken", "null", '{"version":1,"mode":"ADMIN"}', '{"version":2,"mode":"trade"}', "x".repeat(201)]) assert.equal(parseWorkspaceMode(raw), null);
  assert.notEqual(workspaceModeKey("a"), workspaceModeKey("b"));
  assert.equal(defaultWorkspaceMode("ADMIN"), "customer");
  assert.equal(defaultWorkspaceMode("TRADIE"), "trade");
});
test("simulated mode navigation does not enter server actions for another role", () => {
  assert.equal(workspaceLinks("TRADIE", "customer", true).post, "/dashboard?customerView=post");
  assert.equal(workspaceLinks("CUSTOMER", "trade", true).search, "/dashboard?quoteView=feed");
  assert.equal(workspaceLinks("CUSTOMER", "customer", true).post, "/jobs/new");
  assert.equal(workspaceLinks("TRADIE", "trade", false).search, "/jobs");
  assert.equal(workspaceLinks("ADMIN", "customer", false).jobs, "/admin");
});

test("Home keeps its mode while explicit opposite-mode search stays scoped", () => {
  for (const search of [false, true]) {
    assert.equal(workspaceHomeRedirect("TRADIE", "customer", true, search), search ? "/dashboard" : null);
    assert.equal(workspaceHomeRedirect("CUSTOMER", "trade", true, search), search ? "/dashboard?quoteView=feed" : null);
    for (const role of [null, "CUSTOMER", "TRADIE", "ADMIN"]) for (const mode of ["customer", "trade"] as const) {
      assert.equal(workspaceHomeRedirect(role, mode, false, search), null);
      assert.equal(workspaceLinks(role, mode, true).home, "/");
      assert.equal(workspaceLinks(role, mode, false).home, "/");
      assert.equal(workspaceHomeRedirect(role, mode, true, false), null);
    }
    assert.equal(workspaceHomeRedirect("CUSTOMER", "customer", true, search), null);
    assert.equal(workspaceHomeRedirect("TRADIE", "trade", true, search), null);
    assert.equal(workspaceHomeRedirect("ADMIN", "trade", true, search), null);
  }
});
