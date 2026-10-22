import assert from "node:assert/strict";

/** Run through cua_repl with an agent-owned guest tab on a disposable loopback preview.
 * const { checkLandingHistory } = await import('/absolute/repo/qa/regressions/landing-history.mjs');
 * await checkLandingHistory(tab, { baseUrl: 'http://127.0.0.1:3137', anchorName: 'A simpler way to get it sorted' });
 * Repeat at 390/1440px, and at desktop with anchorName: 'How it works'.
 * No account, job, payment or database mutation; this module does not launch a browser.
 */
export async function checkLandingHistory(tab, { baseUrl, anchorName }) {
  const base = new URL(baseUrl);
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Disposable loopback preview only");
  const root = new URL("/", base).href;
  const anchored = new URL("/#how-it-works", base).href;
  const trade = new URL("/for-tradies", base).href;
  const results = [];

  async function observe(step, url, landing, atAnchor = false) {
    await tab.getAXState({ emit: false });
    await tab.playwright.getByRole("heading", {
      name: landing ? "Sorted in a flash." : "Good work. On clear terms.", exact: true,
    }).waitFor({ state: "visible", timeoutMs: 5000 });
    // Initial fragment restoration follows streamed hydration and the font request.
    if (atAnchor) await tab.playwright.waitForLoadState({ state: "networkidle", timeoutMs: 5000 });
    const actual = await tab.playwright.evaluate(() => ({
      h1: document.querySelector("h1")?.innerText?.replace(/\s+/g, " ").trim(),
      landing: !!document.getElementById("landing-title"),
      anchorTop: document.getElementById("how-it-works")?.getBoundingClientRect().top ?? null,
      scrollY,
    }));
    assert.equal(await tab.url(), url, `${step}: URL`);
    assert.equal(actual.landing, landing, `${step}: rendered route must match URL`);
    if (atAnchor) assert.ok(actual.anchorTop >= 0 && actual.anchorTop <= 128, `${step}: anchor section should be in view (${actual.anchorTop})`);
    results.push({ step, url, ...actual });
  }

  if (await tab.url() === root) await tab.reload();
  else await tab.goto(root);
  await observe("root", root, true);
  await tab.playwright.getByRole("link", { name: anchorName, exact: true }).click();
  await observe("anchor click", anchored, true, true);
  await tab.playwright.getByRole("link", { name: "Take a look at the tradie side", exact: true }).click();
  await observe("leave for tradies", trade, false);
  await tab.back();
  await observe("Back to landing hash", anchored, true, true);
  await tab.forward();
  await observe("Forward to tradies", trade, false);
  await tab.back();
  await observe("Back to landing hash again", anchored, true, true);
  await tab.back();
  await observe("Back across same-page hash", root, true);
  await tab.forward();
  await observe("Forward across same-page hash", anchored, true, true);
  await tab.forward();
  await observe("Forward to tradies again", trade, false);
  await tab.goto(anchored);
  await observe("direct anchor navigation", anchored, true, true);
  await tab.reload();
  await observe("reload direct anchor", anchored, true, true);
  return { anchorName, results };
}
