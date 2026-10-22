/* CUA regression on an isolated sample runtime in Trade mode. No app storage
 * writes or hidden handlers; bind tab/viewport through the supported browser. */
export async function verifyFindWorkGrid(tab, viewport) {
  const origin = new URL(await tab.url()).origin;
  const results = [];
  for (const width of [390, 1440]) {
    await viewport.set({ width, height: 900 });
    await tab.goto(`${origin}/dashboard?quoteView=available`);
    await tab.playwright.getByRole("heading", { name: "Jobs", exact: true }).waitFor({ state: "visible" });
    const actual = await tab.playwright.evaluate(() => innerWidth);
    if (actual !== width) throw new Error(`Viewport is ${actual}px instead of ${width}px`);
    await tab.goto(`${origin}/dashboard?quoteView=feed`);
    await tab.playwright.getByRole("heading", { name: "Quote more jobs", exact: true }).waitFor({ state: "visible" });
    const cards = tab.playwright.getByRole("region", { name: "Tradie quote workspace" }).getByRole("article");
    const sizes = await cards.evaluateAll(nodes => nodes.map(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
    if (sizes.length < 2 || sizes.some(size => size.width !== sizes[0].width || size.height !== sizes[0].height)) throw new Error("The quote feed must show several equal-sized cards");
    if (await tab.playwright.getByRole("button", { name: /^(Skip |Next job$)/ }).count()) throw new Error("Single-card controls must be absent");
    await tab.playwright.getByRole("navigation", { name: "Workspace views" }).getByRole("link", { name: /^Jobs/ }).click();
    await tab.getAXState({ emit: false });
    await tab.playwright.getByRole("heading", { name: "Jobs", exact: true }).waitFor({ state: "visible" });
    if (width >= 1024) await tab.playwright.getByRole("link", { name: "Find work", exact: true }).click();
    else await tab.playwright.getByRole("link", { name: "Search", exact: true }).click();
    await tab.playwright.getByRole("heading", { name: "Quote more jobs", exact: true }).waitFor({ state: "visible" });
    await tab.back();
    await tab.playwright.getByRole("heading", { name: "Jobs", exact: true }).waitFor({ state: "visible" });
    await tab.forward();
    await tab.playwright.getByRole("heading", { name: "Quote more jobs", exact: true }).waitFor({ state: "visible" });
    await tab.reload();
    await tab.playwright.getByRole("heading", { name: "Quote more jobs", exact: true }).waitFor({ state: "visible" });
    await tab.playwright.getByRole("combobox", { name: "Filter jobs by trade" }).selectOption("Plumbing");
    await tab.playwright.waitForURL(`${origin}/dashboard?quoteView=feed&trade=Plumbing`);
    const titles = await cards.getByRole("heading").allTextContents({});
    if (titles.length !== 2) throw new Error("Plumbing filter must show its two quoting fixtures");
    if (await tab.playwright.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error("Feed must not overflow horizontally");
    results.push({ width, count: sizes.length, uniformCards: true, navigation: true, history: true, reload: true, filter: true });
  }
  return results;
}
