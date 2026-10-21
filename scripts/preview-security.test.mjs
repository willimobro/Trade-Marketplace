import test from "node:test";
import assert from "node:assert/strict";
import { authorized, protectPreview, requirePreviewSecrets } from "./preview-security.mjs";

const password = "test-only-access-value-xxxxxxxxxxxxxxxx";
const header = "Basic " + Buffer.from("preview:" + password).toString("base64");
test("missing, short and reused secrets fail closed", () => {
  assert.throws(() => requirePreviewSecrets({}));
  assert.throws(() => requirePreviewSecrets({ PREVIEW_ACCESS_PASSWORD: "short" }));
  assert.throws(() => requirePreviewSecrets({ PREVIEW_ACCESS_PASSWORD: password, PREVIEW_ACCOUNT_PASSWORD: password, SESSION_SECRET: password }));
  assert.doesNotThrow(() => requirePreviewSecrets({ PREVIEW_ACCESS_PASSWORD: password, PREVIEW_ACCOUNT_PASSWORD: password + "account", SESSION_SECRET: password + "session" }));
});
test("only the exact access credential is accepted", () => {
  for (const bad of [undefined, "", "Bearer " + password, "Basic !!!", "Basic " + Buffer.from("admin:" + password).toString("base64")]) assert.equal(authorized(bad, password), false);
  assert.equal(authorized(header, password), true);
});
function response() {
  return { headers: {}, status: 0, body: "", setHeader(k, v) { this.headers[k] = v; }, writeHead(s, h) { this.status = s; Object.assign(this.headers, h); }, end(s) { this.body = s; } };
}
test("pages, assets, uploads, actions and internal-header bypass attempts are gated", async () => {
  let reached = 0;
  const gate = protectPreview(async () => { reached++; }, password);
  for (const url of ["/", "/admin", "/demo", "/uploads/test.pdf", "/_next/static/a.js", "/api/test", "/preview-health?bypass=1"]) {
    for (const method of ["GET", "POST", "HEAD"]) {
      const res = response();
      await gate({ url, method, headers: { "x-middleware-subrequest": "middleware", "next-action": "test", host: "localhost" } }, res);
      assert.equal(res.status, 401);
      assert.match(res.headers["WWW-Authenticate"], /Basic/);
    }
  }
  assert.equal(reached, 0);
});
test("health is a constant response; authenticated request reaches handler without gate secret", async () => {
  let reached = 0;
  const gate = protectPreview(async (req, res) => {
    reached++;
    assert.equal(req.headers.authorization, undefined);
    res.end("app");
  }, password);
  const health = response();
  await gate({ url: "/preview-health", method: "GET", headers: {} }, health);
  assert.equal(health.status, 200); assert.equal(health.body, "ok"); assert.equal(reached, 0);
  const res = response();
  await gate({ url: "/admin", method: "POST", headers: { authorization: header } }, res);
  assert.equal(reached, 1); assert.equal(res.body, "app");
});
test("framework response cannot restore public caching", async () => {
  for (const headers of [{ "cache-control": "public, max-age=31536000" }, ["Cache-Control", "public, max-age=31536000"]]) {
    const res = response();
    const gate = protectPreview(async (_req, r) => { r.writeHead(200, headers); r.end("asset"); }, password);
    await gate({ url: "/asset.svg", method: "GET", headers: { authorization: header } }, res);
    assert.equal(res.headers["Cache-Control"], "private, no-store");
    assert.equal(res.headers["cache-control"], undefined);
  }
});
