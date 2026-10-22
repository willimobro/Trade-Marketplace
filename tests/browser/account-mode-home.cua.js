/* Isolated synthetic runtime only. Begin in a sample tradie's Customer mode.
 * The direct legacy entry must never expose server-role posting controls. */
export async function verifyCustomerModeHome(tab, viewport) {
  const origin = new URL(await tab.url()).origin;
  const observations = [];
  for (const width of [390, 1440]) {
    await viewport.set({ width, height: 900 });
    await tab.goto(`${origin}/`);
    await tab.playwright.waitForURL(`${origin}/dashboard`);
    await tab.playwright.getByRole("button", { name: "Post a job", exact: true }).waitFor({ state: "visible" });
    if (width === 1440) {
      await tab.playwright.getByRole("link", { name: "Trade Marketplace home", exact: true }).click();
      if (await tab.url() !== `${origin}/dashboard`) throw new Error("The desktop wordmark escaped Customer mode");
    }
    await tab.goto(`${origin}/?view=search`);
    await tab.playwright.waitForURL(`${origin}/dashboard`);
    await tab.playwright.getByRole("button", { name: "Post a job", exact: true }).click();
    await tab.playwright.getByRole("textbox", { name: "Job title", exact: true }).waitFor({ state: "visible" });
    const fields = await tab.playwright.locator("main input, main textarea, main select").evaluateAll(elements => elements.map(element => ({
      radius: getComputedStyle(element).borderRadius,
      border: getComputedStyle(element).borderColor,
    })));
    if (!fields.length || fields.some(field => field.radius !== "0px" || field.border !== "rgb(82, 100, 91)")) throw new Error("Hiring web fields must remain square with the approved border");
    if (!await tab.playwright.evaluate(() => document.documentElement.scrollWidth <= innerWidth)) throw new Error("Customer mode overflows the viewport");
    await tab.playwright.getByRole("button", { name: "Back to your jobs", exact: true }).click();
    observations.push({ width, home: true, search: true, post: true, squareFields: fields.length, overflow: false });
  }
  return observations;
}
