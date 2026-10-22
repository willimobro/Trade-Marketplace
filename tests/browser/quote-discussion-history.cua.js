/* UI regression on an isolated sample runtime. Begin on a quote detail route
 * without a fragment. Bind `tab` and `viewport` through documented CUA APIs. */
export async function verifyDiscussionHistory(tab, viewport) {
  const detailUrl = (await tab.url()).split("#")[0];
  const results = [];
  for (const width of [390, 1440]) {
   for (const query of ["", "?quoteView=feed&trade=Electrical&quoteJob=demo-electrical-02"]) {
    const entryUrl = `${detailUrl.split("?")[0]}${query}`;
    await viewport.set({ width, height: 900 });
    await tab.goto(entryUrl);
    await tab.reload();
    await tab.playwright.waitForLoadState({ state: "networkidle" });
    await tab.playwright.getByRole("button", { name: /^(Quote · \+1 point|Edit your quote)$/ }).and(tab.playwright.locator(":enabled")).waitFor({ state: "visible" });
    await tab.playwright.getByRole("link", { name: "Open job discussion", exact: true }).click();
    await tab.playwright.waitForURL(`${entryUrl}#comments`);
    if (await tab.url() !== `${entryUrl}#comments`) throw new Error("Discussion link must retain the path/query and save its fragment after reload");
    const discussion = tab.playwright.getByRole("heading", { name: "Job discussion", exact: true });
    await discussion.waitFor({ state: "visible" });
    if (!await discussion.evaluate(node => node === document.activeElement)) throw new Error("Discussion heading must retain keyboard focus");
    await tab.playwright.getByRole("link", { name: "Back to jobs", exact: true }).click();
    await tab.playwright.getByRole("heading", { name: /^Kia ora,/ }).waitFor({ state: "visible" });
    await tab.back();
    await tab.playwright.waitForLoadState({ state: "networkidle" });
    await discussion.waitFor({ state: "visible" });
    await discussion.waitFor({ state: "visible" });
    if (!await discussion.evaluate(node => node === document.activeElement)) throw new Error("Discussion heading must retain keyboard focus");
    await tab.forward();
    await tab.playwright.getByRole("heading", { name: /^Kia ora,/ }).waitFor({ state: "visible" });
    await tab.back();
    await tab.playwright.waitForLoadState({ state: "networkidle" });
    await discussion.waitFor({ state: "visible" });
    await tab.reload();
    await tab.playwright.waitForLoadState({ state: "networkidle" });
    await discussion.waitFor({ state: "visible" });
    if (!await discussion.evaluate(node => node === document.activeElement)) throw new Error("Discussion heading must retain keyboard focus");
    await tab.goto(new URL("/dashboard", entryUrl).href);
    await tab.goto(`${entryUrl}#comments`);
    await tab.playwright.waitForLoadState({ state: "networkidle" });
    await discussion.waitFor({ state: "visible" });
    if (!await discussion.evaluate(node => node === document.activeElement)) throw new Error("Discussion heading must retain keyboard focus");
    results.push({ width, query, click: true, back: true, forward: true, reload: true, directFragment: true });
   }
  }
  return results;
}
