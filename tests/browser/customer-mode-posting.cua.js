/* Isolated synthetic runtime only. Start in a sample tradie's Customer mode
 * dashboard. This adds one browser-local sample job and no backend record. */
export async function verifyCustomerModePosting(tab) {
  await tab.playwright.getByRole("main").getByRole("link", { name: "Post a job", exact: true }).click();
  await tab.playwright.getByRole("textbox", { name: "Job title", exact: true }).fill("Replace the sample garden latch");
  await tab.playwright.getByRole("textbox", { name: "What needs doing?", exact: true }).fill("Replace the worn latch on the timber gate and check the existing hinges.");
  await tab.playwright.getByRole("textbox", { name: "Suburb / town", exact: true }).fill("Grey Lynn");
  await tab.playwright.getByRole("button", { name: "Review job", exact: true }).click();
  await tab.playwright.getByRole("button", { name: "Post job", exact: true }).click();
  await tab.playwright.getByRole("heading", { name: "Replace the sample garden latch", exact: true }).last().waitFor({ state: "visible" });
  if (new URL(await tab.url()).searchParams.has("customerView")) throw new Error("Successful posting must return to the jobs view");
  if (!await tab.playwright.evaluate(() => document.activeElement?.textContent === "Your jobs")) throw new Error("Successful posting must focus the jobs heading");
  await tab.playwright.getByRole("main").getByRole("link", { name: "Post a job", exact: true }).click();
  await tab.playwright.getByRole("button", { name: "Back to your jobs", exact: true }).click();
  await tab.playwright.getByRole("main").getByRole("link", { name: "Post a job", exact: true }).click();
  await tab.playwright.getByRole("textbox", { name: "Job title", exact: true }).waitFor({ state: "visible" });
  return { addedSample: true, returnedToJobs: true, focusRestored: true, repeatedPostEntry: true };
}
