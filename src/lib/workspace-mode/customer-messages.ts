import { CUSTOMER_SAMPLE_JOBS, type CustomerSampleJob } from "./customer-model";

export const CUSTOMER_MESSAGE_LIMIT = 100;
export const CUSTOMER_MESSAGE_LENGTH = 2000;
const MAX_THREADS = 10;
type ReadReceipt = { latestMessageId: string; markedUnread?: true };
export type CustomerLocalMessage = { id: string; jobId: string; body: string; createdAt: string };
export type CustomerMessagesState = { version: 1; userId: string; revision: number; messages: CustomerLocalMessage[]; drafts: Record<string, string>; reads: Record<string, ReadReceipt> };
export type CustomerConversationMessage = CustomerLocalMessage & { sender: "sample" | "you"; senderName: string };
export class CustomerMessagesError extends Error {
  constructor(message: string) { super(message); this.name = "CustomerMessagesError"; }
}

export function customerMessagesKey(userId: string): string {
  if (!userId.trim() || userId.length > 200) throw new CustomerMessagesError("An account is required for these sample conversations.");
  return `tm-customer-messages-v1:${encodeURIComponent(userId)}`;
}

export function initialCustomerMessages(userId: string): CustomerMessagesState {
  customerMessagesKey(userId);
  return { version: 1, userId, revision: 0, messages: [], drafts: {}, reads: {} };
}

function record(value: unknown): value is Record<string, unknown> { return !!value && typeof value === "object" && !Array.isArray(value); }
function validDate(value: unknown): value is string { return typeof value === "string" && value.length <= 40 && Number.isFinite(Date.parse(value)); }
function validJobId(value: unknown): value is string { return typeof value === "string" && /^customer-(?:sample-[a-z-]{1,80}|local-[a-zA-Z0-9_-]{8,80})$/.test(value); }
function invalidStorage(): never { throw new CustomerMessagesError("The saved sample conversations could not be read. Retry storage; your existing data has not been replaced."); }
function requireJob(jobs: readonly CustomerSampleJob[], jobId: string) {
  const job = jobs.find((item) => item.id === jobId);
  if (!job || !validJobId(job.id)) throw new CustomerMessagesError("Open a job from your customer sample workspace to use this conversation.");
  return job;
}

/** Stored messages always belong to this account and can only be local viewer notes. */
export function readCustomerMessages(raw: string | null, userId: string, jobs: readonly CustomerSampleJob[]): CustomerMessagesState {
  customerMessagesKey(userId);
  if (!raw) return initialCustomerMessages(userId);
  if (raw.length > 260000) return invalidStorage();
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return invalidStorage(); }
  if (!record(value) || value.version !== 1 || value.userId !== userId || !Number.isSafeInteger(value.revision) || (value.revision as number) < 0 ||
    !Array.isArray(value.messages) || value.messages.length > CUSTOMER_MESSAGE_LIMIT || !record(value.drafts) || Object.keys(value.drafts).length > MAX_THREADS || !record(value.reads) || Object.keys(value.reads).length > MAX_THREADS) return invalidStorage();
  const ids = new Set<string>();
  const knownJobs = new Set(jobs.map((job) => job.id));
  const messages = value.messages.map((item: unknown): CustomerLocalMessage => {
    if (!record(item) || typeof item.id !== "string" || !/^customer-message-[a-zA-Z0-9_-]{8,80}$/.test(item.id) || ids.has(item.id) || !validJobId(item.jobId) ||
      typeof item.body !== "string" || !item.body.trim() || item.body !== item.body.trim() || item.body.length > CUSTOMER_MESSAGE_LENGTH || !validDate(item.createdAt)) return invalidStorage();
    ids.add(item.id);
    return { id: item.id, jobId: item.jobId, body: item.body, createdAt: item.createdAt };
  });
  const drafts: Record<string, string> = {};
  for (const [jobId, body] of Object.entries(value.drafts)) {
    if (!validJobId(jobId) || typeof body !== "string" || body.length > CUSTOMER_MESSAGE_LENGTH) return invalidStorage();
    if (knownJobs.has(jobId)) drafts[jobId] = body;
  }
  const reads: Record<string, ReadReceipt> = {};
  for (const [jobId, receipt] of Object.entries(value.reads)) {
    if (!validJobId(jobId) || !record(receipt) || typeof receipt.latestMessageId !== "string" || receipt.latestMessageId.length > 200 ||
      (receipt.markedUnread !== undefined && receipt.markedUnread !== true) ||
      !(receipt.latestMessageId === `customer-fixture:${jobId}` || messages.some((message) => message.id === receipt.latestMessageId && message.jobId === jobId))) return invalidStorage();
    if (knownJobs.has(jobId)) reads[jobId] = { latestMessageId: receipt.latestMessageId, ...(receipt.markedUnread ? { markedUnread: true } : {}) };
  }
  if ((value.revision as number) < messages.length) return invalidStorage();
  // Resetting the hiring sample can remove local jobs. Their orphaned notes are
  // omitted, without making the remaining inbox unusable or creating new jobs.
  return { version: 1, userId, revision: value.revision as number, messages: messages.filter((message) => knownJobs.has(message.jobId)), drafts, reads };
}

const fixtureNotes: Record<string, string> = {
  "customer-sample-lights": "The sample fixed price covers three supplied pendant fittings, installation at the existing ceiling points and a check of the connections. Add any access notes here.",
  "customer-sample-basin": "This basin job is waiting for a quote. Add anything useful about the slow drain, the leak or access through the vanity cupboard.",
  "customer-sample-gate": "The accepted sample scope covers realigning the gate, replacing the worn hinges and fitting a new latch. Keep any access notes with this job.",
  "customer-sample-hob": "This hob replacement is waiting for a quote. Add the replacement model and any details about access to the existing gas connection.",
  "customer-sample-deck": "This sample job is complete. The original scope and price remain available here if you need to refer to them.",
};

export function customerConversationMessages(state: CustomerMessagesState, job: CustomerSampleJob): CustomerConversationMessage[] {
  const fixture = CUSTOMER_SAMPLE_JOBS.some((item) => item.id === job.id) ? [{ id: `customer-fixture:${job.id}`, jobId: job.id, body: fixtureNotes[job.id], createdAt: "", sender: "sample" as const, senderName: "Sample coordinator" }] : [];
  return [...fixture, ...state.messages.filter((message) => message.jobId === job.id).map((message) => ({ ...message, sender: "you" as const, senderName: "You" }))];
}

export function customerConversationUnread(state: CustomerMessagesState, job: CustomerSampleJob): boolean {
  const latest = customerConversationMessages(state, job).at(-1);
  if (!latest) return false;
  const receipt = state.reads[job.id];
  return !!receipt?.markedUnread || latest.sender !== "you" && receipt?.latestMessageId !== latest.id;
}

export function updateCustomerMessageDraft(state: CustomerMessagesState, jobs: readonly CustomerSampleJob[], jobId: string, body: string): CustomerMessagesState {
  requireJob(jobs, jobId);
  if (body.length > CUSTOMER_MESSAGE_LENGTH) throw new CustomerMessagesError(`Keep your sample message within ${CUSTOMER_MESSAGE_LENGTH.toLocaleString("en-NZ")} characters.`);
  return { ...state, revision: state.revision + 1, drafts: { ...state.drafts, [jobId]: body } };
}

export function markCustomerConversation(state: CustomerMessagesState, jobs: readonly CustomerSampleJob[], jobId: string, unread: boolean): CustomerMessagesState {
  const latest = customerConversationMessages(state, requireJob(jobs, jobId)).at(-1);
  if (!latest) return state;
  return { ...state, revision: state.revision + 1, reads: { ...state.reads, [jobId]: { latestMessageId: latest.id, ...(unread ? { markedUnread: true } : {}) } } };
}

/** Idempotent local save; no recipient, server send, acknowledgement or reply is created. */
export function addCustomerMessage(state: CustomerMessagesState, jobs: readonly CustomerSampleJob[], jobId: string, id: string, body: string, now = new Date().toISOString()): CustomerMessagesState {
  requireJob(jobs, jobId);
  const trimmed = body.trim();
  if (!trimmed || trimmed.length > CUSTOMER_MESSAGE_LENGTH) throw new CustomerMessagesError("Write a message of 1–2,000 characters.");
  if (!/^customer-message-[a-zA-Z0-9_-]{8,80}$/.test(id) || !validDate(now)) throw new CustomerMessagesError("This sample message could not be saved. Your draft is still here.");
  const existing = state.messages.find((message) => message.id === id);
  if (existing) {
    if (existing.jobId !== jobId || existing.body !== trimmed) throw new CustomerMessagesError("This message reference has already been used. Your draft is still here.");
    return state;
  }
  if (state.messages.length >= CUSTOMER_MESSAGE_LIMIT) throw new CustomerMessagesError("This preview can keep 100 local messages. Your draft is still here.");
  const drafts = { ...state.drafts };
  delete drafts[jobId];
  return { ...state, revision: state.revision + 1, messages: [...state.messages, { id, jobId, body: trimmed, createdAt: now }], drafts };
}
