/* Run through a loopback proxy that forwards x-forwarded-proto=https to the
 * protected HTTP custom server, using disposable synthetic storage only. */
export async function verifyPreviewRoleRedirect(tab, viewport) {
  const origin = new URL(await tab.url()).origin;
  const results = [];
  for (const width of [390, 1440]) {
    await viewport.set({ width, height: 900 });
    await tab.goto(`${origin}/preview`);
    for (const role of ["Tradie", "Customer", "Tradie", "Administrator", "Customer"]) {
      await tab.playwright.getByRole("heading", { name: "Choose a preview role", exact: true }).waitFor({ state: "visible" });
      const choice = tab.playwright.getByRole("button", { name: role, exact: true });
      if (!await choice.isEnabled()) throw new Error("Back must leave the role picker usable");
      await choice.click();
      await tab.getAXState({ emit: false });
      const path = role === "Administrator" ? "/admin" : "/dashboard";
      await tab.playwright.waitForURL(`${origin}${path}`);
      const heading = tab.playwright.locator("h1");
      await heading.waitFor({ state: "visible" });
      const title = await heading.innerText({});
      if (role === "Tradie" && title !== "Kia ora, Jack") throw new Error("Tradie session was not restored");
      if (role === "Customer" && title !== "Your jobs") throw new Error("Customer session was not restored");
      if (role === "Administrator" && title !== "Operations") throw new Error("Administrator session was not restored");
      if (role === "Customer") {
        const labels = await tab.playwright.getByText(/^Quote ETA/).allTextContents({});
        if (!labels.length || labels.some(label => label !== "Quote ETA")) throw new Error("Customer ETA labels must omit prototype wording");
      }
      await tab.back();
      await tab.playwright.waitForURL(`${origin}/preview`);
      await tab.playwright.getByRole("heading", { name: "Choose a preview role", exact: true }).waitFor({ state: "visible" });
      await tab.forward();
      await tab.playwright.waitForURL(`${origin}${path}`);
      await heading.waitFor({ state: "visible" });
      await tab.back();
      await tab.playwright.waitForURL(`${origin}/preview`);
      results.push({ width, role, destination: path, title, repeatedSwitch: true, history: true });
    }
  }
  return results;
}
