/* Isolated synthetic runtime only. Run once while signed into each reserved
 * actual Customer and Tradie identity. Mode changes happen only through the UI;
 * root/wordmark/return navigation must never change that identity or mode. */
export async function verifySignedInLandingHome(tab, viewport, actualRole) {
  if (!["CUSTOMER", "TRADIE"].includes(actualRole)) throw new Error("Pass the actual signed-in Customer or Tradie role");
  const origin = new URL(await tab.url()).origin;
  const observations = [];
  await tab.goto(`${origin}/profile`);
  const name = tab.playwright.getByRole("textbox", { name: "Full name", exact: true });
  await name.waitFor({ state: "visible" });
  const accountName = await name.evaluate(node => node.value);
  for (const width of [390, 1440]) for (const mode of ["Customer", "Trade"]) {
    await viewport.set({ width, height: 900 });
    await tab.goto(`${origin}/profile`);
    await tab.playwright.getByRole("radio", { name: mode, exact: true }).click();
    await tab.playwright.getByRole("link", { name: `Open ${mode.toLowerCase()} workspace`, exact: true }).click();
    await tab.playwright.waitForURL(`${origin}/dashboard`);
    if (width >= 1024) await tab.playwright.getByRole("link", { name: "Trade Marketplace home", exact: true }).click();
    else await tab.goto(`${origin}/`);

    const landing = tab.playwright.getByRole("heading", { name: /Sorted in/, level: 1 });
    await landing.waitFor({ state: "visible" });
    if (await tab.url() !== `${origin}/`) throw new Error("Signed-in home/wordmark must show the public landing");
    const returnLink = tab.playwright.getByRole("link", { name: `Return to ${mode} dashboard`, exact: true }).last();
    await returnLink.click();
    await tab.playwright.waitForURL(`${origin}/dashboard`);
    await tab.back();
    await landing.waitFor({ state: "visible" });
    await tab.forward();
    await tab.playwright.waitForURL(`${origin}/dashboard`);
    await tab.back();
    await landing.waitFor({ state: "visible" });
    await tab.playwright.getByRole("link", { name: "Trade Marketplace home", exact: true }).first().click();
    await landing.waitFor({ state: "visible" });
    await tab.reload();
    await returnLink.waitFor({ state: "visible" });
    if (!await tab.playwright.evaluate(() => document.documentElement.scrollWidth <= innerWidth)) throw new Error("The signed-in landing must fit the viewport");
    await returnLink.click();
    await tab.playwright.waitForURL(`${origin}/dashboard`);

    await tab.goto(`${origin}/?view=search`);
    const searchPath = actualRole === "TRADIE" && mode === "Customer" ? "/dashboard" : actualRole === "CUSTOMER" && mode === "Trade" ? "/dashboard?quoteView=feed" : "/?view=search";
    await tab.playwright.waitForURL(`${origin}${searchPath}`);
    if (searchPath.startsWith("/?")) await tab.playwright.getByRole("heading", { name: "Search jobs", exact: true }).waitFor({ state: "visible" });
    await tab.goto(`${origin}/profile`);
    const selected = tab.playwright.getByRole("radio", { name: mode, exact: true });
    if (!await selected.evaluate(node => node.getAttribute("aria-checked") === "true")) throw new Error("Landing navigation must preserve the selected mode");
    if (await name.evaluate(node => node.value) !== accountName) throw new Error("Landing navigation must preserve the signed-in identity");
    observations.push({ actualRole, mode, width, root: true, wordmark: true, return: true, history: true, reload: true, search: true, identity: true });
  }
  return observations;
}

export async function verifyCustomerModeHome(tab, viewport) {
  return verifySignedInLandingHome(tab, viewport, "TRADIE");
}
