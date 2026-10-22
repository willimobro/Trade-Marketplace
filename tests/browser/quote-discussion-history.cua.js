/* UI regression on an isolated sample runtime. Begin on a quote detail route
 * without a fragment. Bind `tab` and `viewport` through documented CUA APIs. */
export async function verifyDiscussionHistory(tab, viewport) {
  const detailUrl = (await tab.url()).split("#")[0];
  const results = [];
  for (const width of [390, 1440]) {
    await viewport.set({ width, height: 900 });
    await tab.goto(detailUrl);
    await tab.playwright.getByRole("link", { name: "Open job discussion", exact: true }).click();
    const discussion = tab.playwright.getByRole("heading", { name: "Job discussion", exact: true });
    await discussion.and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
    await tab.playwright.getByRole("link", { name: "Back to jobs", exact: true }).click();
    await tab.playwright.getByRole("heading", { name: /^Kia ora,/ }).waitFor({ state: "visible" });
    await tab.back();
    await discussion.waitFor({ state: "visible" });
    await discussion.and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
    await tab.forward();
    await tab.playwright.getByRole("heading", { name: /^Kia ora,/ }).waitFor({ state: "visible" });
    await tab.back();
    await discussion.waitFor({ state: "visible" });
    await tab.reload();
    await discussion.and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
    await tab.goto(`${detailUrl}#comments`);
    await discussion.and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
    results.push({ width, click: true, back: true, forward: true, reload: true, directFragment: true });
  }
  return results;
}
