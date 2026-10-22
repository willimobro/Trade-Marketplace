/*
 * CUA regression: run only after browser ownership is released, on an isolated
 * synthetic runtime with an authenticated sample tradie and a nonempty feed.
 * Bind `tab` to that dashboard and `viewport` to the documented viewport API.
 * Paste this module's function (without the export keyword) into cua_repl, then await verifySkipFocus(tab,
 * viewport). It uses UI actions and read-only DOM assertions, never app storage.
 */
export async function verifySkipFocus(tab, viewport) {
  const results = [];
  const focusState = () => tab.playwright.getByTestId("quote-feed-focus-target").evaluate(node => ({
    focused: node === document.activeElement,
    text: node.textContent,
    top: node.getBoundingClientRect().top,
    bottom: node.getBoundingClientRect().bottom,
    viewportHeight: innerHeight,
  }));
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  for (const width of [390, 1440]) {
    await viewport.set({ width, height: 900 });
    await tab.playwright.getByRole("button", { name: "Quote feed", exact: true }).click();
    const restore = tab.playwright.getByRole("button", { name: "Show skipped jobs", exact: true });
    if (await restore.count()) await restore.click();
    const skip = tab.playwright.getByRole("button", { name: /^Skip / });
    assert(await skip.count() === 1, "Use a sample user with unquoted feed jobs");
    let skipped = 0;
    while (await skip.count()) {
      assert(skipped < 20, "Skip must make progress, not cycle forever");
      const before = await focusState();
      await skip.press("Enter");
      await tab.playwright.getByTestId("quote-feed-focus-target").and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
      const after = await focusState();
      assert(after.focused, `Lost focus after Skip at ${width}px`);
      assert(after.text !== before.text, "Skip must reveal a different job or empty state");
      assert(after.top >= 0 && after.bottom < after.viewportHeight - 64,
        "Focused replacement heading must clear the pinned navigation");
      skipped += 1;
    }
    const empty = await focusState();
    assert(empty.focused, "Last Skip must focus the empty state");
    await restore.press("Enter");
    await tab.playwright.getByTestId("quote-feed-focus-target").and(tab.playwright.locator(":focus")).waitFor({ state: "visible" });
    assert((await focusState()).focused, "Restoring skipped jobs must focus the returned card");
    assert(await skip.count() === 1, "Skipped jobs must be recoverable");
    const next = tab.playwright.getByRole("button", { name: "Next job", exact: true });
    if (await next.isEnabled()) {
      await next.press("Enter");
      assert(await next.evaluate(node => node === document.activeElement), "Next must retain its stable control focus");
    }
    const quote = tab.playwright.getByRole("button", { name: "Quote +1 point", exact: true });
    await quote.press("Enter");
    await tab.playwright.getByRole("dialog").press("Escape");
    assert(await quote.evaluate(node => node === document.activeElement), "Escape must restore quote opener focus");
    results.push({ width, skipped, repeatedSkip: true, emptyState: true, restore: true, nextAndEscape: true });
  }
  return results;
}
