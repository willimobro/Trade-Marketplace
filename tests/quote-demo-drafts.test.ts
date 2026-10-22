import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clearComposerDraft, COMPOSER_DRAFT_STORAGE_KEY, COMPOSER_DRAFT_TTL_MS, COMPOSER_DRAFT_VERSION, loadCommentDraft, loadQuoteDraft, MAX_COMPOSER_DRAFTS, MAX_QUOTE_DRAFT_AMOUNT_LENGTH, saveCommentDraft, saveQuoteDraft, type DraftResult, type DraftStorage } from "../src/lib/quote-demo/drafts";
import { createInitialState, getPointsBalance } from "../src/lib/quote-demo/model";

class MemoryStorage implements DraftStorage {
  values = new Map<string, string>();
  touched: string[] = [];
  getItem(key: string) { this.touched.push(key); return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.touched.push(key); this.values.set(key, value); }
}

function value<T>(result: DraftResult<T>): T { if (!result.ok) assert.fail(result.error.message); return result.value; }
function errorCode(result: DraftResult<unknown>): string { assert.equal(result.ok, false); if (result.ok) throw new Error("Expected a draft failure"); return result.error.code; }
const job = "demo-electrical-01";
const otherJob = "demo-plumbing-01";
const availableJob = "demo-electrical-03";
const now = 1000;
const quote = { amount: "245.", scope: "Still writing a scope, including labour…" };

describe("tab-local unsent quote and comment drafts", () => {
  it("restores incomplete quote fields and comments across a new composer instance without trimming or submitting", () => {
    const storage = new MemoryStorage();
    const ledger = createInitialState("user-a");
    const originalLedger = JSON.stringify(ledger);
    value(saveQuoteDraft("user-a", job, quote, storage, now));
    value(saveCommentDraft("user-a", job, { body: "  Is Tuesday still possible?\n" }, storage, now));
    // A remount only needs the same immutable account ID, job ID and kind.
    assert.deepEqual(value(loadQuoteDraft("user-a", job, storage, now + 100)), quote);
    assert.deepEqual(value(loadCommentDraft("user-a", job, storage, now + 100)), { body: "  Is Tuesday still possible?\n" });
    assert.equal(JSON.stringify(ledger), originalLedger);
    assert.equal(ledger.quotes.length, 0);
    assert.equal(ledger.revision, 0);
    assert.equal(getPointsBalance(ledger), 3);
    assert.equal(JSON.parse(storage.values.get(COMPOSER_DRAFT_STORAGE_KEY)!).version, COMPOSER_DRAFT_VERSION);
  });

  it("isolates drafts by immutable account, job and composer kind", () => {
    const storage = new MemoryStorage();
    value(saveQuoteDraft("user-a", job, quote, storage, now));
    value(saveQuoteDraft("user-b", job, { amount: "350", scope: "Another user's scope." }, storage, now));
    value(saveQuoteDraft("user-a", otherJob, { amount: "125", scope: "Another job's scope." }, storage, now));
    value(saveCommentDraft("user-a", job, { body: "A question, not a quote." }, storage, now));
    assert.deepEqual(value(loadQuoteDraft("user-a", job, storage, now)), quote);
    assert.equal(value(loadQuoteDraft("user-b", job, storage, now))?.amount, "350");
    assert.equal(value(loadQuoteDraft("user-a", otherJob, storage, now))?.amount, "125");
    assert.equal(value(loadCommentDraft("user-a", job, storage, now))?.body, "A question, not a quote.");
    assert.equal(value(loadQuoteDraft("user-c", job, storage, now)), null);
    assert.equal(value(loadCommentDraft("user-b", job, storage, now)), null);
  });

  it("keeps browser tabs separate and reads or writes only its own storage namespace", () => {
    const tabA = new MemoryStorage(), tabB = new MemoryStorage();
    tabA.values.set("unrelated-settings", "untouched");
    value(saveQuoteDraft("user-a", job, quote, tabA, now));
    assert.equal(value(loadQuoteDraft("user-a", job, tabB, now)), null);
    assert.deepEqual(value(loadQuoteDraft("user-a", job, tabA, now)), quote);
    assert.ok(tabA.touched.every((key) => key === COMPOSER_DRAFT_STORAGE_KEY));
    assert.equal(tabA.values.get("unrelated-settings"), "untouched");
    const saved = JSON.parse(tabA.values.get(COMPOSER_DRAFT_STORAGE_KEY)!);
    assert.deepEqual(Object.keys(saved), ["version", "drafts"]);
    assert.deepEqual(Object.keys(saved.drafts[0]).sort(), ["expiresAt", "jobId", "kind", "updatedAt", "userId", "value"]);
    assert.deepEqual(Object.keys(saved.drafts[0].value).sort(), ["amount", "scope"]);
  });

  it("retains intentionally emptied fields and does not delete a draft just because the composer is loaded or closed", () => {
    const storage = new MemoryStorage();
    value(saveQuoteDraft("user-a", job, { amount: "", scope: "" }, storage, now));
    value(saveCommentDraft("user-a", job, { body: "" }, storage, now));
    const before = storage.values.get(COMPOSER_DRAFT_STORAGE_KEY);
    assert.deepEqual(value(loadQuoteDraft("user-a", job, storage, now)), { amount: "", scope: "" });
    assert.deepEqual(value(loadCommentDraft("user-a", job, storage, now)), { body: "" });
    assert.equal(storage.values.get(COMPOSER_DRAFT_STORAGE_KEY), before, "restoration does not mutate persisted text");
  });

  it("clears only the chosen account/job/composer after explicit discard or a matching successful save", () => {
    const storage = new MemoryStorage();
    value(saveQuoteDraft("user-a", job, quote, storage, now));
    value(saveCommentDraft("user-a", job, { body: "Keep this comment." }, storage, now));
    value(saveQuoteDraft("user-b", job, quote, storage, now));
    value(clearComposerDraft("user-a", job, "quote", { scope: quote.scope, amount: quote.amount }, storage, now));
    assert.equal(value(loadQuoteDraft("user-a", job, storage, now)), null);
    assert.equal(value(loadCommentDraft("user-a", job, storage, now))?.body, "Keep this comment.");
    assert.deepEqual(value(loadQuoteDraft("user-b", job, storage, now)), quote);
    value(clearComposerDraft("user-a", job, "comment", undefined, storage, now));
    assert.equal(value(loadCommentDraft("user-a", job, storage, now)), null);
    assert.deepEqual(value(loadQuoteDraft("user-b", job, storage, now)), quote);
  });

  it("does not erase newer unsent text when an earlier save resolves after navigation", () => {
    const storage = new MemoryStorage();
    value(saveQuoteDraft("user-a", job, quote, storage, now));
    const later = { amount: "400", scope: "A later edit made after returning to the job." };
    value(saveQuoteDraft("user-a", job, later, storage, now + 100));
    value(clearComposerDraft("user-a", job, "quote", quote, storage, now + 200));
    assert.deepEqual(value(loadQuoteDraft("user-a", job, storage, now + 200)), later);
    value(saveCommentDraft("user-a", job, { body: "A newer question." }, storage, now + 100));
    value(clearComposerDraft("user-a", job, "comment", { body: "The earlier saved question." }, storage, now + 200));
    assert.equal(value(loadCommentDraft("user-a", job, storage, now + 200))?.body, "A newer question.");
  });

  it("expires drafts at 24 hours and refreshes the expiry only when text is written", () => {
    const storage = new MemoryStorage();
    value(saveQuoteDraft("user-a", job, quote, storage, now));
    assert.deepEqual(value(loadQuoteDraft("user-a", job, storage, now + COMPOSER_DRAFT_TTL_MS - 1)), quote);
    assert.equal(value(loadQuoteDraft("user-a", job, storage, now + COMPOSER_DRAFT_TTL_MS)), null);
    value(saveQuoteDraft("user-a", otherJob, quote, storage, now + COMPOSER_DRAFT_TTL_MS));
    const records = JSON.parse(storage.values.get(COMPOSER_DRAFT_STORAGE_KEY)!).drafts;
    assert.equal(records.length, 1, "a later write prunes only expired drafts");
    assert.equal(records[0].jobId, otherJob);
    value(saveQuoteDraft("user-a", otherJob, quote, storage, now + COMPOSER_DRAFT_TTL_MS + 100));
    assert.deepEqual(value(loadQuoteDraft("user-a", otherJob, storage, now + 2 * COMPOSER_DRAFT_TTL_MS + 99)), quote);
  });

  it("bounds the number of drafts without evicting another unexpired account's text", () => {
    const storage = new MemoryStorage();
    for (let index = 0; index < MAX_COMPOSER_DRAFTS; index += 1) value(saveQuoteDraft(`user-${index}`, job, quote, storage, now));
    const full = storage.values.get(COMPOSER_DRAFT_STORAGE_KEY);
    assert.equal(errorCode(saveQuoteDraft("another-user", job, quote, storage, now)), "full");
    assert.equal(storage.values.get(COMPOSER_DRAFT_STORAGE_KEY), full);
    value(saveQuoteDraft("user-0", job, { amount: "500", scope: "Updating an existing draft." }, storage, now + 10));
    assert.equal(value(loadQuoteDraft("user-0", job, storage, now + 10))?.amount, "500");
    assert.equal(JSON.parse(storage.values.get(COMPOSER_DRAFT_STORAGE_KEY)!).drafts.length, MAX_COMPOSER_DRAFTS);
    value(saveQuoteDraft("another-user", job, quote, storage, now + COMPOSER_DRAFT_TTL_MS + 10));
    assert.deepEqual(value(loadQuoteDraft("another-user", job, storage, now + COMPOSER_DRAFT_TTL_MS + 10)), quote);
  });

  it("bounds payloads and accepts unfinished text without treating it as a valid quote", () => {
    const storage = new MemoryStorage();
    value(saveQuoteDraft("user-a", job, { amount: "x".repeat(MAX_QUOTE_DRAFT_AMOUNT_LENGTH), scope: "x".repeat(1000) }, storage, now));
    value(saveCommentDraft("user-a", availableJob, { body: "x".repeat(2000) }, storage, now));
    const before = storage.values.get(COMPOSER_DRAFT_STORAGE_KEY);
    assert.equal(errorCode(saveQuoteDraft("user-a", job, { amount: "x".repeat(MAX_QUOTE_DRAFT_AMOUNT_LENGTH + 1), scope: "" }, storage, now)), "invalid");
    assert.equal(errorCode(saveQuoteDraft("user-a", job, { amount: "1", scope: "x".repeat(1001) }, storage, now)), "invalid");
    assert.equal(errorCode(saveCommentDraft("user-a", job, { body: "x".repeat(2001) }, storage, now)), "invalid");
    assert.equal(errorCode(saveQuoteDraft("user-a", availableJob, quote, storage, now)), "invalid");
    assert.equal(errorCode(saveQuoteDraft("user-a", "unknown", quote, storage, now)), "invalid");
    assert.equal(errorCode(saveQuoteDraft("", job, quote, storage, now)), "invalid");
    assert.equal(errorCode(saveQuoteDraft("user-a", job, quote, storage, -1)), "invalid");
    assert.equal(storage.values.get(COMPOSER_DRAFT_STORAGE_KEY), before);
  });

  it("reports corrupt or future data and leaves it untouched instead of silently resetting drafts", () => {
    const storage = new MemoryStorage();
    value(saveQuoteDraft("user-a", job, quote, storage, now));
    const valid = JSON.parse(storage.values.get(COMPOSER_DRAFT_STORAGE_KEY)!);
    const entry = valid.drafts[0];
    const corruptRecords = ["{broken", JSON.stringify({ ...valid, version: 99 }), JSON.stringify({ ...valid, drafts: [entry, entry] }), JSON.stringify({ ...valid, drafts: [{ ...entry, expiresAt: now }] }), JSON.stringify({ ...valid, drafts: [{ ...entry, userId: "" }] }), JSON.stringify({ ...valid, drafts: [{ ...entry, jobId: "unknown" }] }), JSON.stringify({ ...valid, drafts: [{ ...entry, value: { ...entry.value, token: "unrecognized" } }] }), JSON.stringify({ ...valid, drafts: [{ ...entry, kind: "other" }] }), "x".repeat(120_001)];
    for (const raw of corruptRecords) {
      storage.values.set(COMPOSER_DRAFT_STORAGE_KEY, raw);
      assert.equal(errorCode(loadQuoteDraft("user-a", job, storage, now)), "corrupt");
      assert.equal(errorCode(saveQuoteDraft("user-a", job, quote, storage, now)), "corrupt");
      assert.equal(errorCode(clearComposerDraft("user-a", job, "quote", undefined, storage, now)), "corrupt");
      assert.equal(storage.values.get(COMPOSER_DRAFT_STORAGE_KEY), raw);
    }
  });

  it("reports unavailable browser storage and failed writes without claiming a draft was kept", () => {
    const unavailable: DraftStorage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
    const quota: DraftStorage = { getItem() { return null; }, setItem() { throw new Error("quota"); } };
    assert.equal(errorCode(loadQuoteDraft("user-a", job, unavailable, now)), "unavailable");
    assert.equal(errorCode(saveQuoteDraft("user-a", job, quote, unavailable, now)), "unavailable");
    assert.equal(errorCode(saveCommentDraft("user-a", job, { body: "A question." }, quota, now)), "unavailable");
    assert.equal(errorCode(loadCommentDraft("user-a", job, undefined, now)), "unavailable", "a non-browser environment is handled too");
  });
});
