import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { quoteDetailBackHref } from "../src/components/quote-detail/navigation";

test("sample job return navigation preserves recognized view, trade and feed position", () => {
  const href = quoteDetailBackHref({ quoteView: "quoted", trade: "Gas Fitting", quoteJob: "demo-gas-01" });
  const url = new URL(href, "https://sample.invalid");
  assert.equal(url.pathname, "/dashboard");
  assert.equal(url.searchParams.get("quoteView"), "quoted");
  assert.equal(url.searchParams.get("trade"), "Gas Fitting");
  assert.equal(url.searchParams.get("quoteJob"), "demo-gas-01");
  assert.equal(quoteDetailBackHref({}), "/dashboard?quoteView=feed");
});

test("sample job return navigation ignores malformed, unknown and repeated query values", () => {
  assert.equal(quoteDetailBackHref({ quoteView: "https://example.invalid", trade: "<script>", quoteJob: "unknown" }), "/dashboard?quoteView=feed");
  assert.equal(quoteDetailBackHref({ quoteView: ["feed", "quoted"], trade: ["Electrical", "Plumbing"], quoteJob: ["demo-gas-01"] }), "/dashboard?quoteView=feed");
  assert.equal(quoteDetailBackHref({ quoteView: "available", trade: "all", quoteJob: "demo-gas-03" }), "/dashboard?quoteView=available");
});

test("sample detail route keeps the authenticated, runtime and account boundaries before rendering", () => {
  const route = readFileSync(new URL("../src/app/quote-jobs/[id]/page.tsx", import.meta.url), "utf8");
  assert.match(route, /requireUser\(`\/quote-jobs\/\$\{id\}`\)/);
  assert.match(route, /await canUseHostedPreview\(\) \|\| allowsLocalDemo\(process\.env\.TRADE_LOCAL_DEMO, \(await headers\(\)\)\.get\("host"\)\)/);
  assert.match(route, /if \(!allowsWorkspaceDemo\(runtimeAllowed, user\)\) notFound\(\)/);
  assert.match(route, /if \(!job\) notFound\(\)/);
  assert.ok(route.indexOf("!allowsWorkspaceDemo") < route.indexOf("<QuoteJobDetail"));
  assert.doesNotMatch(route, /from ["']@\/lib\/db["']/);
});
