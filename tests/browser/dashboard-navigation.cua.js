/* Run on an isolated synthetic runtime, already signed in and in Trade mode.
 * Repeat for the actual reserved Customer and Tradie identities. */
export async function verifyDashboardNavigation(tab, viewport, identity) {
  const origin = new URL(await tab.url()).origin;
  const results = [];
  const views = [
    { label: /^Jobs \d+$/, view: "available", heading: "Jobs" },
    { label: /^Quoted jobs \d+$/, view: "quoted", heading: "Quoted jobs" },
    { label: /^Your jobs \d+$/, view: "claimed", heading: "Your jobs" },
    { label: "Find work", view: "feed", heading: "Quote more jobs" },
  ];
  const heading = name => tab.playwright.getByRole("heading", { name, exact: true });
  for (const width of [390, 1440]) {
    await viewport.set({ width, height: 900 });
    await tab.goto(`${origin}/dashboard`);
    await heading("Your jobs").waitFor({ state: "visible" });
    const main = tab.playwright.getByRole("navigation", { name: width >= 1024 ? "Desktop navigation" : "Main navigation", exact: true });
    for (let attempt = 0; attempt < 3; attempt++) {
      await main.getByRole("link", { name: width >= 1024 ? "Find work" : "Search", exact: true }).click();
      await tab.getAXState({ emit: false });
      await tab.playwright.waitForURL(`${origin}/dashboard?quoteView=feed`);
      await heading("Quote more jobs").waitFor({ state: "visible" });
      const cards = tab.playwright.getByRole("region", { name: "Tradie quote workspace", exact: true }).getByRole("article");
      await cards.first().waitFor({ state: "visible" });
      if (await cards.count() !== 8) throw new Error("Find Work must render all eight jobs");
      await main.getByRole("link", { name: width >= 1024 ? "Your jobs" : "Jobs", exact: true }).click();
      await tab.getAXState({ emit: false });
      await tab.playwright.waitForURL(`${origin}/dashboard`);
      await heading("Your jobs").waitFor({ state: "visible" });
      await tab.back();
      await heading("Quote more jobs").waitFor({ state: "visible" });
      await tab.forward();
      await heading("Your jobs").waitFor({ state: "visible" });
    }
    for (const method of ["click", "Enter"]) for (const view of views) {
      const link = tab.playwright.getByRole("navigation", { name: "Workspace views", exact: true }).getByRole("link", { name: view.label, exact: true });
      if (method === "click") await link.click(); else await link.press("Enter");
      await tab.getAXState({ emit: false });
      await tab.playwright.waitForURL(`${origin}/dashboard?quoteView=${view.view}`);
      await heading(view.heading).waitFor({ state: "visible" });
      if (await link.getAttribute("aria-current") !== "page") throw new Error("Workspace current link must follow the rendered view");
    }
    await tab.playwright.getByRole("combobox", { name: "Filter jobs by trade", exact: true }).selectOption("Plumbing");
    await tab.getAXState({ emit: false });
    await tab.playwright.waitForURL(`${origin}/dashboard?quoteView=feed&trade=Plumbing`);
    await tab.reload();
    const filtered = tab.playwright.getByRole("region", { name: "Tradie quote workspace", exact: true }).getByRole("article");
    await filtered.first().waitFor({ state: "visible" });
    if (await filtered.count() !== 2) throw new Error("Direct filtered reload must show both Plumbing jobs");
    if (await tab.playwright.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error("Navigation must not cause overflow");
    results.push({ identity, width, mainCycles: 3, mouseAndEnterViews: 8, history: true, filteredReload: true, cards: 2 });
  }
  return results;
}
