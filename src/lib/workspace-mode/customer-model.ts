import { DEMO_JOB_ASSETS, type DemoJobAssetId } from "../demo-job-assets";
import { activeJobsFirst } from "../job-presentation";

export const CUSTOMER_PREVIEW_VERSION = 1;
export const CUSTOMER_TRADES = ["Electrical", "Plumbing", "Gas Fitting", "Construction"] as const;
export type CustomerTrade = (typeof CUSTOMER_TRADES)[number];
export type CustomerStage = "waiting" | "priced" | "underway" | "complete";
export type CustomerJobFilter = "all" | "action" | "active" | "complete";
export type CustomerDraft = { title: string; trade: CustomerTrade; description: string; suburb: string; timing: string; photoNames: string[] };
export type CustomerSampleJob = Omit<CustomerDraft, "photoNames"> & { id: string; stage: CustomerStage; photos: { url: string; alt?: string }[]; priceCents?: number; photoNames?: string[]; priceAccepted?: boolean };
export type CustomerPreviewState = {
  version: typeof CUSTOMER_PREVIEW_VERSION;
  userId: string;
  revision: number;
  accepted: { jobId: string; acceptedAt: string }[];
  posted: { id: string; fields: CustomerDraft; createdAt: string }[];
  draft: CustomerDraft;
};

export class CustomerPreviewError extends Error {
  constructor(public code: "invalid-storage" | "invalid-draft" | "invalid-job" | "preview-limit", message: string) { super(message); this.name = "CustomerPreviewError"; }
}

function photos(...ids: DemoJobAssetId[]): { url: string; alt: string }[] {
  return ids.map((id) => {
    const asset = DEMO_JOB_ASSETS.find((item) => item.id === id)!;
    return { url: asset.url, alt: `Illustrative photo: ${asset.title.toLowerCase()}` };
  });
}

/** Fictional hiring examples, independent of every backend account and job. */
export const CUSTOMER_SAMPLE_JOBS: readonly CustomerSampleJob[] = [
  { id: "customer-sample-lights", title: "New lights over the kitchen island", trade: "Electrical", suburb: "Grey Lynn", timing: "This week", stage: "priced", priceCents: 48000,
    description: "Replace three pendant fittings over the kitchen island using the existing ceiling points. The fittings are supplied. The fixed price includes installation and a check of the existing connections.", photos: photos("ceiling-light", "kitchen-renovation", "room-renovation") },
  { id: "customer-sample-basin", title: "A bathroom basin that drains properly", trade: "Plumbing", suburb: "Mount Eden", timing: "Flexible", stage: "waiting",
    description: "The bathroom basin drains slowly and occasionally leaks around the waste fitting. We would like the blockage checked and the waste seal replaced if needed. Access is through the vanity cupboard.", photos: photos("bathroom-vanity", "kitchen-sink") },
  { id: "customer-sample-gate", title: "Fix our sticking side gate", trade: "Construction", suburb: "Westmere", timing: "Next week", stage: "underway", priceCents: 36500,
    description: "Realign the timber side gate, replace the worn hinges and fit a new latch.", photos: photos("timber-fence", "house-exterior", "timber-detail") },
  { id: "customer-sample-hob", title: "Connect the replacement gas hob", trade: "Gas Fitting", suburb: "Kingsland", timing: "Next 2 weeks", stage: "waiting",
    description: "Replace a four-burner gas hob with a supplied unit in the same cut-out. Include disconnection, connection and the required checks. The existing gas connection is accessible inside the cupboard.", photos: photos("kitchen-renovation", "kitchen-sink") },
  { id: "customer-sample-deck", title: "The deck is ready for summer", trade: "Construction", suburb: "Point Chevalier", timing: "Finished", stage: "complete", priceCents: 79000,
    description: "Six weathered deck boards have been replaced and the surrounding fixings checked.", photos: photos("deck-patio", "timber-detail", "house-exterior") },
];

export function emptyCustomerDraft(): CustomerDraft {
  return { title: "", trade: "Electrical", description: "", suburb: "", timing: "Flexible", photoNames: [] };
}

export function customerPreviewKey(userId: string): string {
  if (!userId.trim()) throw new CustomerPreviewError("invalid-storage", "An account is required for this sample workspace.");
  return `tm-customer-workspace-v1:${userId}`;
}

export function initialCustomerPreview(userId: string): CustomerPreviewState {
  customerPreviewKey(userId);
  return { version: CUSTOMER_PREVIEW_VERSION, userId, revision: 0, accepted: [], posted: [], draft: emptyCustomerDraft() };
}

function record(value: unknown): value is Record<string, unknown> { return !!value && typeof value === "object" && !Array.isArray(value); }
function date(value: unknown): value is string { return typeof value === "string" && Number.isFinite(Date.parse(value)); }
function text(value: unknown, max: number): value is string { return typeof value === "string" && value.length <= max; }
function trade(value: unknown): value is CustomerTrade { return CUSTOMER_TRADES.some((item) => item === value); }
function invalidStorage(): never { throw new CustomerPreviewError("invalid-storage", "The saved customer preview could not be read. Retry, or reset this account’s customer sample."); }

function draftFields(value: unknown): CustomerDraft {
  if (!record(value) || !text(value.title, 80) || !trade(value.trade) || !text(value.description, 4000) || !text(value.suburb, 60) || !text(value.timing, 80) ||
    !Array.isArray(value.photoNames) || value.photoNames.length > 6 || value.photoNames.some((name) => !text(name, 160))) return invalidStorage();
  return { title: value.title, trade: value.trade, description: value.description, suburb: value.suburb, timing: value.timing, photoNames: [...value.photoNames] as string[] };
}

export function readCustomerPreview(raw: string | null, userId: string): CustomerPreviewState {
  customerPreviewKey(userId);
  if (!raw) return initialCustomerPreview(userId);
  if (raw.length > 60000) return invalidStorage();
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return invalidStorage(); }
  if (!record(value) || value.version !== CUSTOMER_PREVIEW_VERSION || value.userId !== userId || !Number.isSafeInteger(value.revision) || (value.revision as number) < 0 ||
    !Array.isArray(value.accepted) || value.accepted.length > CUSTOMER_SAMPLE_JOBS.length || !Array.isArray(value.posted) || value.posted.length > 5) return invalidStorage();
  const acceptedIds = new Set<string>();
  const accepted = value.accepted.map((item: unknown) => {
    if (!record(item) || typeof item.jobId !== "string" || CUSTOMER_SAMPLE_JOBS.find((job) => job.id === item.jobId)?.stage !== "priced" || acceptedIds.has(item.jobId) || !date(item.acceptedAt)) return invalidStorage();
    acceptedIds.add(item.jobId);
    return { jobId: item.jobId, acceptedAt: item.acceptedAt };
  });
  const postIds = new Set<string>();
  const posted = value.posted.map((item: unknown) => {
    if (!record(item) || typeof item.id !== "string" || !/^customer-local-[a-zA-Z0-9_-]{8,80}$/.test(item.id) || postIds.has(item.id) || !date(item.createdAt)) return invalidStorage();
    const fields = draftFields(item.fields);
    try { validateCustomerDraft(fields); } catch { return invalidStorage(); }
    postIds.add(item.id);
    return { id: item.id, fields, createdAt: item.createdAt };
  });
  if ((value.revision as number) < accepted.length + posted.length) return invalidStorage();
  return { version: CUSTOMER_PREVIEW_VERSION, userId, revision: value.revision as number, accepted, posted, draft: draftFields(value.draft) };
}

export function customerPreviewJobs(state: CustomerPreviewState): CustomerSampleJob[] {
  const posted: CustomerSampleJob[] = [...state.posted].reverse().map((job) => ({ ...job.fields, id: job.id, stage: "waiting", photos: [] }));
  const fixtures = CUSTOMER_SAMPLE_JOBS.map((job) => state.accepted.some((item) => item.jobId === job.id) ? { ...job, stage: "underway" as const, priceAccepted: true } : { ...job });
  return activeJobsFirst([...posted, ...fixtures], (job) => job.stage === "complete");
}

/** Presentation only: accepting a sample price does not start work or book it. */
export function customerStageLabel(job: CustomerSampleJob): string {
  if (job.priceAccepted && job.stage === "underway") return "Price accepted";
  return { waiting: "Waiting for a quote", priced: "Price ready", underway: "Getting underway", complete: "Completed" }[job.stage];
}

export function customerJobFilter(raw: string | null): CustomerJobFilter {
  return raw === "action" || raw === "active" || raw === "complete" ? raw : "all";
}

/** A URL can select only a job already present in this account's local sample. */
export function customerJobSelection(jobs: readonly CustomerSampleJob[], requested: string | null): CustomerSampleJob | undefined {
  return requested === null ? undefined : jobs.find((job) => job.id === requested);
}

function customerRoute(path: "/dashboard" | "/messages", jobId: string | null, filter: CustomerJobFilter, review = false): string {
  const query = new URLSearchParams();
  if (jobId !== null) query.set("customerJob", jobId);
  if (filter !== "all") query.set("customerFilter", filter);
  if (path === "/dashboard" && jobId !== null && review) query.set("customerReview", "price");
  return `${path}${query.size ? `?${query}` : ""}`;
}

export function customerWorkspaceHref(jobId: string | null = null, filter: CustomerJobFilter = "all", review = false): string {
  return customerRoute("/dashboard", jobId, filter, review);
}

export function customerConversationHref(jobId: string | null = null, filter: CustomerJobFilter = "all"): string {
  return customerRoute("/messages", jobId, filter);
}

/** `enabled` comes from the existing reserved-account/runtime gate, never a URL. */
export function customerPostingDestination(role: string | null, enabled: boolean, mode: "customer" | "trade"): string | null {
  return enabled && role === "TRADIE" && mode === "customer" ? "/dashboard?customerView=post" : null;
}

export function validateCustomerDraft(draft: CustomerDraft): CustomerDraft {
  if (draft.title.trim().length < 5 || draft.title.length > 80) throw new CustomerPreviewError("invalid-draft", "Give your job a title between 5 and 80 characters.");
  if (!trade(draft.trade) || draft.description.trim().length < 20 || draft.description.length > 4000) throw new CustomerPreviewError("invalid-draft", "Describe the work in 20–4,000 characters and choose a trade.");
  if (draft.suburb.trim().length < 2 || draft.suburb.length > 60 || !draft.timing.trim() || draft.timing.length > 80) throw new CustomerPreviewError("invalid-draft", "Add a suburb and when you would like the work done.");
  if (draft.photoNames.length > 6 || draft.photoNames.some((name) => !name.trim() || name.length > 160)) throw new CustomerPreviewError("invalid-draft", "Choose up to 6 photos with shorter file names.");
  return { ...draft, title: draft.title.trim(), description: draft.description.trim(), suburb: draft.suburb.trim(), timing: draft.timing.trim(), photoNames: [...draft.photoNames] };
}

export function updateCustomerDraft(state: CustomerPreviewState, draft: CustomerDraft): CustomerPreviewState {
  return { ...state, revision: state.revision + 1, draft: draftFields(draft) };
}

/** Merge only the edited draft into the newest persisted account snapshot. */
export function mergeCustomerDraft(raw: string | null, userId: string, draft: CustomerDraft): CustomerPreviewState {
  return updateCustomerDraft(readCustomerPreview(raw, userId), draft);
}

export function acceptCustomerSamplePrice(state: CustomerPreviewState, jobId: string, now = new Date().toISOString()): { state: CustomerPreviewState; alreadyAccepted: boolean } {
  const current = readCustomerPreview(JSON.stringify(state), state.userId);
  const job = CUSTOMER_SAMPLE_JOBS.find((item) => item.id === jobId);
  if (job?.stage !== "priced" || !date(now)) throw new CustomerPreviewError("invalid-job", "This sample job does not have a price ready to accept.");
  if (current.accepted.some((item) => item.jobId === jobId)) return { state: current, alreadyAccepted: true };
  return { state: { ...current, revision: current.revision + 1, accepted: [...current.accepted, { jobId, acceptedAt: now }] }, alreadyAccepted: false };
}

export function postCustomerSampleJob(state: CustomerPreviewState, id: string, now = new Date().toISOString()): CustomerPreviewState {
  const current = readCustomerPreview(JSON.stringify(state), state.userId);
  if (!/^customer-local-[a-zA-Z0-9_-]{8,80}$/.test(id) || current.posted.some((job) => job.id === id) || !date(now)) throw new CustomerPreviewError("invalid-job", "The sample job could not be saved. Please retry.");
  if (current.posted.length >= 5) throw new CustomerPreviewError("preview-limit", "This preview can keep 5 new sample jobs. Your current draft is still saved.");
  const fields = validateCustomerDraft(current.draft);
  return { ...current, revision: current.revision + 1, posted: [...current.posted, { id, fields, createdAt: now }], draft: emptyCustomerDraft() };
}
