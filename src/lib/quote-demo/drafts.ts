import { findDemoJob } from "./jobs";

export const COMPOSER_DRAFT_VERSION = 1;
export const COMPOSER_DRAFT_STORAGE_KEY = "trade-marketplace-composer-drafts";
export const COMPOSER_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
export const MAX_COMPOSER_DRAFTS = 48;
export const MAX_QUOTE_DRAFT_AMOUNT_LENGTH = 128;
const MAX_STORAGE_CHARACTERS = 120_000;

export type QuoteDraft = { amount: string; scope: string };
export type CommentDraft = { body: string };
export type ComposerKind = "quote" | "comment";
export type DraftStorage = Pick<Storage, "getItem" | "setItem">;
export type DraftResult<T> = { ok: true; value: T } | { ok: false; error: ComposerDraftError };
type DraftValues = { quote: QuoteDraft; comment: CommentDraft };
type DraftEntry = { userId: string; jobId: string; updatedAt: number; expiresAt: number } & ({ kind: "quote"; value: QuoteDraft } | { kind: "comment"; value: CommentDraft });

export class ComposerDraftError extends Error {
  constructor(public code: "unavailable" | "corrupt" | "full" | "invalid", message: string) { super(message); this.name = "ComposerDraftError"; }
}

function unavailable(message = "This tab could not keep your unsent draft. Keep this page open or copy your text before leaving."): ComposerDraftError {
  return new ComposerDraftError("unavailable", message);
}

function corrupt(): never {
  throw new ComposerDraftError("corrupt", "This tab’s unsent drafts could not be read. Your saved quotes and points are unchanged. Keep or copy any text you are editing before leaving.");
}

function record(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function exactKeys(value: Record<string, unknown>, keys: string[]): boolean { return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key)); }
function validUserId(value: unknown): value is string { return typeof value === "string" && /^[a-zA-Z0-9_-]{1,200}$/.test(value); }
function validValue(kind: ComposerKind, value: unknown): value is QuoteDraft | CommentDraft {
  if (!record(value)) return false;
  return kind === "quote"
    ? exactKeys(value, ["amount", "scope"]) && typeof value.amount === "string" && value.amount.length <= MAX_QUOTE_DRAFT_AMOUNT_LENGTH && typeof value.scope === "string" && value.scope.length <= 1000
    : exactKeys(value, ["body"]) && typeof value.body === "string" && value.body.length <= 2000;
}

function sameValue(left: QuoteDraft | CommentDraft, right: QuoteDraft | CommentDraft): boolean {
  return "amount" in left && "amount" in right ? left.amount === right.amount && left.scope === right.scope : "body" in left && "body" in right && left.body === right.body;
}

function readEntries(storage: DraftStorage): DraftEntry[] {
  const raw = storage.getItem(COMPOSER_DRAFT_STORAGE_KEY);
  if (raw === null) return [];
  if (raw.length > MAX_STORAGE_CHARACTERS) return corrupt();
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return corrupt(); }
  if (!record(parsed) || !exactKeys(parsed, ["version", "drafts"]) || parsed.version !== COMPOSER_DRAFT_VERSION || !Array.isArray(parsed.drafts) || parsed.drafts.length > MAX_COMPOSER_DRAFTS) return corrupt();
  const ids = new Set<string>();
  return parsed.drafts.map((entry: unknown): DraftEntry => {
    if (!record(entry) || !exactKeys(entry, ["userId", "jobId", "kind", "value", "updatedAt", "expiresAt"]) || !validUserId(entry.userId) || typeof entry.jobId !== "string" || !findDemoJob(entry.jobId) ||
      (entry.kind !== "quote" && entry.kind !== "comment") || !validValue(entry.kind, entry.value) ||
      !Number.isSafeInteger(entry.updatedAt) || (entry.updatedAt as number) < 0 || !Number.isSafeInteger(entry.expiresAt) || entry.expiresAt !== (entry.updatedAt as number) + COMPOSER_DRAFT_TTL_MS ||
      (entry.kind === "quote" && findDemoJob(entry.jobId)?.stage !== "quoting")) return corrupt();
    const identity = JSON.stringify([entry.userId, entry.jobId, entry.kind]);
    if (ids.has(identity)) return corrupt();
    ids.add(identity);
    return entry as DraftEntry;
  });
}

function withStorage<T>(provided: DraftStorage | undefined, action: (storage: DraftStorage) => T, unavailableMessage?: string): DraftResult<T> {
  try {
    const storage = provided ?? window.sessionStorage;
    return { ok: true, value: action(storage) };
  } catch (error) { return { ok: false, error: error instanceof ComposerDraftError ? error : unavailable(unavailableMessage) }; }
}

function validateIdentity(userId: string, jobId: string, kind: ComposerKind, now: number): void {
  if (!validUserId(userId) || !findDemoJob(jobId) || (kind === "quote" && findDemoJob(jobId)?.stage !== "quoting") || !Number.isSafeInteger(now) || now < 0 || !Number.isSafeInteger(now + COMPOSER_DRAFT_TTL_MS)) {
    throw new ComposerDraftError("invalid", "This unsent draft could not be kept for this account and job. Keep or copy your text before leaving.");
  }
}

function loadDraft<K extends ComposerKind>(kind: K, userId: string, jobId: string, provided: DraftStorage | undefined, now: number): DraftResult<DraftValues[K] | null> {
  return withStorage(provided, (storage) => {
    validateIdentity(userId, jobId, kind, now);
    const entry = readEntries(storage).find((item) => item.userId === userId && item.jobId === jobId && item.kind === kind && item.expiresAt > now);
    return entry ? { ...entry.value } as DraftValues[K] : null;
  });
}

function saveDraft<K extends ComposerKind>(kind: K, userId: string, jobId: string, value: DraftValues[K], provided: DraftStorage | undefined, now: number): DraftResult<void> {
  return withStorage(provided, (storage) => {
    validateIdentity(userId, jobId, kind, now);
    if (!validValue(kind, value)) throw new ComposerDraftError("invalid", "This unsent draft is too long to keep in this tab. Shorten it or copy your text before leaving.");
    // Expired drafts no longer restore. Unexpired drafts are never evicted to
    // make room for another account: report a full store and preserve them.
    const entries = readEntries(storage).filter((item) => item.expiresAt > now && !(item.userId === userId && item.jobId === jobId && item.kind === kind));
    if (entries.length >= MAX_COMPOSER_DRAFTS) throw new ComposerDraftError("full", "This tab’s draft storage is full. Save or discard another unsent draft before leaving this one.");
    const entry = { userId, jobId, kind, value: { ...value }, updatedAt: now, expiresAt: now + COMPOSER_DRAFT_TTL_MS };
    const serialized = JSON.stringify({ version: COMPOSER_DRAFT_VERSION, drafts: [...entries, entry] });
    if (serialized.length > MAX_STORAGE_CHARACTERS) throw new ComposerDraftError("full", "This tab’s draft storage is full. Keep or copy your text before leaving.");
    storage.setItem(COMPOSER_DRAFT_STORAGE_KEY, serialized);
  });
}

export function loadQuoteDraft(userId: string, jobId: string, storage?: DraftStorage, now = Date.now()): DraftResult<QuoteDraft | null> { return loadDraft("quote", userId, jobId, storage, now); }
export function loadCommentDraft(userId: string, jobId: string, storage?: DraftStorage, now = Date.now()): DraftResult<CommentDraft | null> { return loadDraft("comment", userId, jobId, storage, now); }
export function saveQuoteDraft(userId: string, jobId: string, value: QuoteDraft, storage?: DraftStorage, now = Date.now()): DraftResult<void> { return saveDraft("quote", userId, jobId, value, storage, now); }
export function saveCommentDraft(userId: string, jobId: string, value: CommentDraft, storage?: DraftStorage, now = Date.now()): DraftResult<void> { return saveDraft("comment", userId, jobId, value, storage, now); }

/** Call only after a successful composer save or an explicit Discard action. */
export function clearComposerDraft(userId: string, jobId: string, kind: ComposerKind, expected?: QuoteDraft | CommentDraft, storage?: DraftStorage, now = Date.now()): DraftResult<void> {
  return withStorage(storage, (target) => {
    validateIdentity(userId, jobId, kind, now);
    const entries = readEntries(target);
    // A save that finishes after navigation must not erase a newer draft typed
    // for the same job while that save was in flight.
    const remaining = entries.filter((entry) => !(entry.userId === userId && entry.jobId === jobId && entry.kind === kind && (!expected || sameValue(entry.value, expected))));
    if (remaining.length !== entries.length) target.setItem(COMPOSER_DRAFT_STORAGE_KEY, JSON.stringify({ version: COMPOSER_DRAFT_VERSION, drafts: remaining }));
  }, "This tab could not clear the unsent draft. It may reappear when you return.");
}
