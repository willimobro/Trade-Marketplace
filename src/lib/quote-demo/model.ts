import { findDemoJob } from "./jobs";

// Keep the IndexedDB store unchanged, but make new writes unreadable by an old
// version-1 client, which would otherwise discard comments and acceptances.
export const QUOTE_DEMO_VERSION = 2;
export const INITIAL_DEMO_POINTS = 3;
export const CLAIM_COST = 5;

export type DemoQuote = { jobId: string; amountCents: number; note: string; submittedAt: string; updatedAt: string };
export type DemoClaim = { jobId: string; claimedAt: string; completedAt?: string };
export type DemoAcceptance = { jobId: string; acceptedAt: string };
export type DemoComment = { id: string; jobId: string; body: string; createdAt: string };
export type QuoteDemoState = { version: typeof QUOTE_DEMO_VERSION; userId: string; revision: number; quotes: DemoQuote[]; claims: DemoClaim[]; acceptances: DemoAcceptance[]; comments: DemoComment[] };
export type DemoErrorCode = "invalid-quote" | "quote-accepted" | "invalid-comment" | "invalid-job" | "insufficient-points" | "invalid-storage" | "storage-unavailable";

export class QuoteDemoError extends Error {
  constructor(public code: DemoErrorCode, message: string) { super(message); this.name = "QuoteDemoError"; }
}

export function createInitialState(userId: string): QuoteDemoState {
  if (!userId.trim()) throw new QuoteDemoError("invalid-storage", "A sample user is required.");
  return { version: QUOTE_DEMO_VERSION, userId, revision: 0, quotes: [], claims: [], acceptances: [], comments: [] };
}

export function getPointsBalance(state: QuoteDemoState): number {
  return INITIAL_DEMO_POINTS + state.quotes.length - CLAIM_COST * state.claims.length;
}

/** A claim is a separate action and never implies this tradie's quote was accepted. */
export function getDemoQuoteStatus(state: QuoteDemoState, jobId: string): "quoted" | "accepted" | undefined {
  if (!state.quotes.some((quote) => quote.jobId === jobId)) return undefined;
  return state.acceptances?.some((acceptance) => acceptance.jobId === jobId) ? "accepted" : "quoted";
}

export function validateQuote(amount: string | number, note: string): { amountCents: number; note: string } {
  const cleaned = String(amount).trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(cleaned)) throw new QuoteDemoError("invalid-quote", "Enter a quote amount with up to two decimal places.");
  const amountCents = Math.round(Number(cleaned) * 100);
  if (!Number.isSafeInteger(amountCents) || amountCents < 100 || amountCents > 100_000_000) {
    throw new QuoteDemoError("invalid-quote", "Enter an amount between $1 and $1,000,000.");
  }
  const trimmedNote = note.trim();
  if (trimmedNote.length < 10 || trimmedNote.length > 1000) {
    throw new QuoteDemoError("invalid-quote", "Add a scope note of 10–1,000 characters.");
  }
  return { amountCents, note: trimmedNote };
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function validDate(value: unknown): value is string { return typeof value === "string" && Number.isFinite(Date.parse(value)); }
function invalidStored(): never { throw new QuoteDemoError("invalid-storage", "The saved sample data could not be read. Retry, or reset this user's sample data."); }

/** Reject incompatible/corrupt records; never silently turn them into a fresh balance. */
export function parseStoredState(value: unknown, userId: string): QuoteDemoState {
  if (!isRecord(value) || (value.version !== 1 && value.version !== QUOTE_DEMO_VERSION) || value.userId !== userId ||
    !Number.isSafeInteger(value.revision) || (value.revision as number) < 0 ||
    !Array.isArray(value.quotes) || !Array.isArray(value.claims)) return invalidStored();
  const quoteIds = new Set<string>();
  const quotes: DemoQuote[] = value.quotes.map((quote: unknown) => {
    if (!isRecord(quote) || typeof quote.jobId !== "string" || findDemoJob(quote.jobId)?.stage !== "quoting" ||
      quoteIds.has(quote.jobId) || !Number.isSafeInteger(quote.amountCents) || (quote.amountCents as number) < 100 ||
      (quote.amountCents as number) > 100_000_000 || typeof quote.note !== "string" ||
      quote.note !== quote.note.trim() || quote.note.length < 10 || quote.note.length > 1000 ||
      !validDate(quote.submittedAt) || !validDate(quote.updatedAt) || Date.parse(quote.updatedAt) < Date.parse(quote.submittedAt)) return invalidStored();
    quoteIds.add(quote.jobId);
    return { jobId: quote.jobId, amountCents: quote.amountCents as number, note: quote.note, submittedAt: quote.submittedAt, updatedAt: quote.updatedAt };
  });
  const claimIds = new Set<string>();
  const claims: DemoClaim[] = value.claims.map((claim: unknown) => {
    if (!isRecord(claim) || typeof claim.jobId !== "string" || findDemoJob(claim.jobId)?.stage !== "available" ||
      claimIds.has(claim.jobId) || !validDate(claim.claimedAt) ||
      (claim.completedAt !== undefined && (!validDate(claim.completedAt) || Date.parse(claim.completedAt) < Date.parse(claim.claimedAt)))) return invalidStored();
    claimIds.add(claim.jobId);
    return { jobId: claim.jobId, claimedAt: claim.claimedAt, ...(claim.completedAt ? { completedAt: claim.completedAt as string } : {}) };
  });
  // Version-1 records did not contain these fields. Preserve their ledger and
  // normalize them to version 2 without changing the IndexedDB database/store.
  if (value.version === QUOTE_DEMO_VERSION && (!Array.isArray(value.acceptances) || !Array.isArray(value.comments))) return invalidStored();
  if ((value.acceptances !== undefined && !Array.isArray(value.acceptances)) ||
    (value.comments !== undefined && !Array.isArray(value.comments))) return invalidStored();
  const acceptedIds = new Set<string>();
  const acceptances: DemoAcceptance[] = (value.acceptances ?? []).map((acceptance: unknown) => {
    if (!isRecord(acceptance) || typeof acceptance.jobId !== "string" || acceptedIds.has(acceptance.jobId) || !validDate(acceptance.acceptedAt)) return invalidStored();
    const quote = quotes.find((item) => item.jobId === acceptance.jobId);
    if (!quote || Date.parse(acceptance.acceptedAt) < Date.parse(quote.updatedAt)) return invalidStored();
    acceptedIds.add(acceptance.jobId);
    return { jobId: acceptance.jobId, acceptedAt: acceptance.acceptedAt };
  });
  const commentIds = new Set<string>();
  const comments: DemoComment[] = (value.comments ?? []).map((comment: unknown) => {
    if (!isRecord(comment) || typeof comment.id !== "string" || !validCommentId(comment.id) || commentIds.has(comment.id) ||
      typeof comment.jobId !== "string" || !findDemoJob(comment.jobId) || typeof comment.body !== "string" ||
      comment.body !== comment.body.trim() || comment.body.length < 2 || comment.body.length > 2000 || !validDate(comment.createdAt)) return invalidStored();
    commentIds.add(comment.id);
    return { id: comment.id, jobId: comment.jobId, body: comment.body, createdAt: comment.createdAt };
  });
  const state: QuoteDemoState = { version: QUOTE_DEMO_VERSION, userId, revision: value.revision as number, quotes, claims, acceptances, comments };
  if (getPointsBalance(state) < 0 || state.revision < quotes.length + claims.length + acceptances.length + comments.length) return invalidStored();
  return state;
}

export function submitDemoQuote(state: QuoteDemoState, jobId: string, amount: string | number, note: string, now = new Date().toISOString()): { state: QuoteDemoState; rewarded: boolean } {
  const current = parseStoredState(state, state.userId);
  if (findDemoJob(jobId)?.stage !== "quoting") throw new QuoteDemoError("invalid-job", "This sample job is not open for quotes.");
  if (getDemoQuoteStatus(current, jobId) === "accepted") throw new QuoteDemoError("quote-accepted", "This quote has been accepted in the preview and is now locked. Its scope and price cannot be edited.");
  if (!validDate(now)) throw new QuoteDemoError("invalid-quote", "The quote date is invalid.");
  const valid = validateQuote(amount, note);
  const existing = current.quotes.find((quote) => quote.jobId === jobId);
  if (existing && Date.parse(now) < Date.parse(existing.updatedAt)) throw new QuoteDemoError("invalid-quote", "The quote update date is invalid.");
  const quote: DemoQuote = { jobId, ...valid, submittedAt: existing?.submittedAt ?? now, updatedAt: now };
  const quotes = existing ? current.quotes.map((item) => item.jobId === jobId ? quote : item) : [...current.quotes, quote];
  return { state: { ...current, revision: current.revision + 1, quotes }, rewarded: !existing };
}

/** Explicit preview-only customer selection of this user's already-saved quote. */
export function acceptDemoQuote(state: QuoteDemoState, jobId: string, now = new Date().toISOString()): { state: QuoteDemoState; alreadyAccepted: boolean } {
  const current = parseStoredState(state, state.userId);
  const quote = current.quotes.find((item) => item.jobId === jobId);
  if (!quote) throw new QuoteDemoError("invalid-job", "Save your quote before previewing customer acceptance.");
  if (current.acceptances.some((item) => item.jobId === jobId)) return { state: current, alreadyAccepted: true };
  if (!validDate(now) || Date.parse(now) < Date.parse(quote.updatedAt)) throw new QuoteDemoError("invalid-job", "The acceptance date is invalid.");
  return { state: { ...current, revision: current.revision + 1, acceptances: [...current.acceptances, { jobId, acceptedAt: now }] }, alreadyAccepted: false };
}

function validCommentId(value: string): boolean { return /^[a-zA-Z0-9_-]{8,100}$/.test(value); }

export function validateDemoComment(body: string): string {
  const trimmed = body.trim();
  if (trimmed.length < 2 || trimmed.length > 2000) throw new QuoteDemoError("invalid-comment", "Write a comment of 2–2,000 characters.");
  return trimmed;
}

/** The caller retains the same ID for retries, so a committed comment cannot be duplicated. */
export function addDemoComment(state: QuoteDemoState, jobId: string, body: string, commentId: string, now = new Date().toISOString()): { state: QuoteDemoState; alreadyAdded: boolean } {
  const current = parseStoredState(state, state.userId);
  if (!findDemoJob(jobId)) throw new QuoteDemoError("invalid-job", "This sample job could not be found.");
  const validBody = validateDemoComment(body);
  if (!validCommentId(commentId) || !validDate(now)) throw new QuoteDemoError("invalid-comment", "The comment could not be saved. Refresh this page, then retry.");
  const existing = current.comments.find((comment) => comment.id === commentId);
  if (existing) {
    if (existing.jobId !== jobId || existing.body !== validBody) throw new QuoteDemoError("invalid-comment", "This comment changed while it was being saved. Please try again.");
    return { state: current, alreadyAdded: true };
  }
  return { state: { ...current, revision: current.revision + 1, comments: [...current.comments, { id: commentId, jobId, body: validBody, createdAt: now }] }, alreadyAdded: false };
}

export function claimDemoJob(state: QuoteDemoState, jobId: string, now = new Date().toISOString()): { state: QuoteDemoState; alreadyClaimed: boolean } {
  const current = parseStoredState(state, state.userId);
  if (findDemoJob(jobId)?.stage !== "available") throw new QuoteDemoError("invalid-job", "This sample job is not available to claim.");
  if (current.claims.some((claim) => claim.jobId === jobId)) return { state: current, alreadyClaimed: true };
  if (getPointsBalance(current) < CLAIM_COST) throw new QuoteDemoError("insufficient-points", "You need 5 points to claim this sample job.");
  if (!validDate(now)) throw new QuoteDemoError("invalid-job", "The claim date is invalid.");
  return { state: { ...current, revision: current.revision + 1, claims: [...current.claims, { jobId, claimedAt: now }] }, alreadyClaimed: false };
}

export function completeDemoJob(state: QuoteDemoState, jobId: string, now = new Date().toISOString()): { state: QuoteDemoState; alreadyCompleted: boolean } {
  const current = parseStoredState(state, state.userId);
  const claim = current.claims.find((item) => item.jobId === jobId);
  if (!claim) throw new QuoteDemoError("invalid-job", "Claim this sample job before completing it.");
  if (claim.completedAt) return { state: current, alreadyCompleted: true };
  if (!validDate(now) || Date.parse(now) < Date.parse(claim.claimedAt)) throw new QuoteDemoError("invalid-job", "The completion date is invalid.");
  return { state: { ...current, revision: current.revision + 1, claims: current.claims.map((item) => item.jobId === jobId ? { ...item, completedAt: now } : item) }, alreadyCompleted: false };
}
