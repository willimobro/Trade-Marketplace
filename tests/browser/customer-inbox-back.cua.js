/* CUA-only regression on an isolated synthetic runtime, already signed into a
 * reserved tradie in Customer mode. Saves only a browser-local message draft.
 * Bind `tab` and `viewport` through the documented browser APIs. */
export async function verifyCustomerInboxBack(tab, viewport) {
  const origin = new URL(await tab.url()).origin;
  const title = "A bathroom basin that drains properly";
  const results = [];
  for (const width of [390, 1440]) {
    for (const filter of ["all", "active"]) {
      await viewport.set({ width, height: 900 });
      const entry = new URL(`/messages${filter === "all" ? "" : `?customerFilter=${filter}`}`, origin).href;
      await tab.goto(entry);
      const actualWidth = await tab.playwright.evaluate(() => innerWidth);
      if (actualWidth !== width) throw new Error(`Viewport override did not apply: requested ${width}px, received ${actualWidth}px`);
      const row = tab.playwright.getByRole("button", { name: new RegExp(`^${title}\\.`) });
      await row.waitFor({ state: "visible" });
      await row.press("Enter");
      const heading = tab.playwright.getByRole("heading", { name: title, exact: true });
      await heading.and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
      const composer = tab.playwright.getByRole("textbox", { name: "Your message", exact: true });
      const draft = `Keep this local draft through browser Back at ${width}px.`;
      await composer.fill(draft);
      if (!await composer.evaluate(node => node === document.activeElement)) throw new Error("Saving a message draft must not refocus the conversation heading");

      await tab.back();
      await tab.playwright.waitForURL(entry);
      await row.and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
      await row.press("Tab");
      const mark = tab.playwright.getByRole("button", { name: new RegExp(`^Mark ${title} as (read|unread)$`) });
      if (!await mark.evaluate(node => node === document.activeElement)) throw new Error("Tab after browser Back must continue within the originating inbox row");

      await tab.forward();
      await heading.and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
      if (await composer.evaluate(node => node.value) !== draft) throw new Error("Back/Forward must retain the selected job’s message draft");
      if (width >= 800) {
        await mark.click();
        if (!await mark.evaluate(node => node === document.activeElement)) throw new Error("Changing read status must not steal focus from its control");
      }
      await tab.back();
      await row.and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
      if (await tab.url() !== entry) throw new Error("Native history must retain the original customer filter");

      await row.press("Enter");
      await heading.waitFor({ state: "visible" });
      await tab.playwright.getByRole("button", { name: "Back to conversations", exact: true }).press("Enter");
      await row.and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });

      const unknown = new URL("/messages?customerJob=customer-local-missing-focus-check", origin);
      if (filter !== "all") unknown.searchParams.set("customerFilter", filter);
      await tab.goto(unknown.href);
      await tab.playwright.getByRole("link", { name: "Show all conversations", exact: true }).press("Enter");
      await tab.playwright.getByRole("heading", { name: "Your conversations", exact: true }).and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
      if (await tab.url() !== entry) throw new Error("Unknown-ID recovery must keep the customer filter and focus the inbox heading");
      results.push({ width, filter, nativeBack: true, forward: true, secondBack: true, explicitBack: true, draft: true, unknownRecovery: true });
    }
  }
  return results;
}
