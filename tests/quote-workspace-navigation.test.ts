import assert from "node:assert/strict";
import test from "node:test";
import { readWorkspaceNavigation, readWorkspaceSession, workspaceSearch, workspaceSessionKey } from "../src/components/quote-feed/workspace-navigation";

test("workspace return query preserves the chosen trade, tab and feed job", () => {
  const expected = { tab: "feed" as const, trade: "Gas Fitting", quoteJob: "demo-gas-02" };
  assert.deepEqual(readWorkspaceNavigation(`?${workspaceSearch(expected)}`), expected);
});

test("workspace query rejects unknown views, trades and non-feed job identifiers", () => {
  assert.deepEqual(readWorkspaceNavigation("?quoteView=unknown&trade=Other&quoteJob=demo-gas-03"), {
    tab: "claimed", trade: "all", quoteJob: undefined,
  });
  assert.equal(workspaceSearch({ tab: "quoted", trade: "all", quoteJob: "missing" }), "quoteView=quoted");
});

test("Your Jobs and Find Work remain distinct direct routes", () => {
  assert.equal(readWorkspaceNavigation("").tab, "claimed");
  assert.equal(readWorkspaceNavigation("?quoteView=feed").tab, "feed");
  assert.equal(readWorkspaceNavigation("?quoteView=quoted&trade=Plumbing").tab, "quoted");
  assert.equal(readWorkspaceNavigation("?quoteView=available&trade=Plumbing").trade, "Plumbing");
});

test("session navigation keeps only distinct known feed jobs", () => {
  assert.deepEqual(readWorkspaceSession(JSON.stringify({
    skipped: ["demo-gas-01", "demo-gas-01", "demo-gas-03", "missing", null], quoteJob: "demo-plumbing-02",
  })), { skipped: ["demo-gas-01"], quoteJob: "demo-plumbing-02" });
});

test("corrupt or oversized session navigation safely starts without skipped jobs", () => {
  for (const raw of [null, "invalid", "[]", "{}".repeat(3000)]) {
    assert.deepEqual(readWorkspaceSession(raw), { skipped: [] });
  }
});

test("workspace session storage is scoped to each user", () => {
  assert.notEqual(workspaceSessionKey("sample-user-one"), workspaceSessionKey("sample-user-two"));
});
