/* CUA-only browser regression. Run against an isolated synthetic runtime after
 * taking browser ownership. Open an unaccepted sample quote detail as a seeded
 * tradie, with the quote editor closed. No storage injection or real messages. */
export async function verifyQuoteDetailFocus(tab) {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const composer = tab.playwright.getByLabel("Add a comment", { exact: true });
  await composer.fill("The sample photos clarify the access needed for this job.");
  await tab.playwright.getByRole("button", { name: "Add comment", exact: true }).press("Enter");
  await composer.and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
  assert(await composer.evaluate(node => !node.disabled && node.value === ""), "Saved comment must clear and restore the enabled composer");

  const opener = tab.playwright.getByRole("button", { name: /^(Quote · \+1 point|Edit your quote)$/ });
  await opener.press("Enter");
  await tab.playwright.getByLabel("Your quote NZD, including GST if applicable").waitFor({ state: "visible" });
  await tab.playwright.getByRole("button", { name: "Cancel", exact: true }).press("Enter");
  await opener.and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
  assert(await opener.evaluate(node => node === document.activeElement), "Cancel must restore the remounted quote opener");
  return { commentSaveFocus: true, cancelFocus: true };
}
