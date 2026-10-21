import { findDemoJob } from "./jobs";

export const QUOTE_DEMO_VERSION = 1;
export const INITIAL_DEMO_POINTS = 3;
export const CLAIM_COST = 5;

export type DemoQuote = { jobId: string; amountCents: number; note: string; submittedAt: string; updatedAt: string };
export type DemoClaim = { jobId: string; claimedAt: string; completedAt?: string };
export type QuoteDemoState = { version: typeof QUOTE_DEMO_VERSION; userId: string; revision: number; quotes: DemoQuote[]; claims: DemoClaim[] };
export type DemoErrorCode = "invalid-quote" | "invalid-job" | "insufficient-points" | "invalid-storage" | "storage-unavailable";

export class QuoteDemoError extends Error {
  constructor(public code: DemoErrorCode, message: string) { super(message); this.name = "QuoteDemoError"; }
}

export function createInitialState(userId: string): QuoteDemoState {
  if (!userId.trim()) throw new QuoteDemoError("invalid-storage", "A sample user is required.");
  return { version: QUOTE_DEMO_VERSION, userId, revision: 0, quotes: [], claims: [] };
}

export function getPointsBalance(state: QuoteDemoState): number {
  return INITIAL_DEMO_POINTS + state.quotes.length - CLAIM_COST * state.claims.length;
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
  if (!isRecord(value) || value.version !== QUOTE_DEMO_VERSION || value.userId !== userId ||
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
  const state: QuoteDemoState = { version: QUOTE_DEMO_VERSION, userId, revision: value.revision as number, quotes, claims };
  if (getPointsBalance(state) < 0 || state.revision < quotes.length + claims.length) return invalidStored();
  return state;
}

export function submitDemoQuote(state: QuoteDemoState, jobId: string, amount: string | number, note: string, now = new Date().toISOString()): { state: QuoteDemoState; rewarded: boolean } {
  const current = parseStoredState(state, state.userId);
  if (findDemoJob(jobId)?.stage !== "quoting") throw new QuoteDemoError("invalid-job", "This sample job is not open for quotes.");
  if (!validDate(now)) throw new QuoteDemoError("invalid-quote", "The quote date is invalid.");
  const valid = validateQuote(amount, note);
  const existing = current.quotes.find((quote) => quote.jobId === jobId);
  const quote: DemoQuote = { jobId, ...valid, submittedAt: existing?.submittedAt ?? now, updatedAt: now };
  const quotes = existing ? current.quotes.map((item) => item.jobId === jobId ? quote : item) : [...current.quotes, quote];
  return { state: { ...current, revision: current.revision + 1, quotes }, rewarded: !existing };
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
