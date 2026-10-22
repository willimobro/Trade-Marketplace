import type { DraftFields, JobDraft } from "@/app/jobs/new/job-draft";
import type { CustomerDraft } from "./workspace-mode/customer-model";

/** Absent fields were not edited. Empty text is an intentional clearing. */
export type HomeRequest = Partial<{ title: string; location: string; category: string }>;

/** Only the fields intentionally edited on Home change; other work stays intact. */
export function homeJobDraft(current: JobDraft | null, request: HomeRequest, region: string, now = Date.now()): JobDraft {
  const fields: DraftFields = current ? { ...current.fields } : { title: "", description: "", region, suburb: "", address: "", category: "Electrical" };
  if (request.title !== undefined) fields.title = request.title.trim().slice(0, 80);
  if (request.location !== undefined) fields.suburb = request.location.trim().slice(0, 60);
  if (request.category) fields.category = request.category;
  return { fields, reviewed: false, savedAt: now };
}

export function homeCustomerDraft(current: CustomerDraft, request: HomeRequest): CustomerDraft {
  return { ...current,
    ...(request.title !== undefined ? { title: request.title.trim().slice(0, 80) } : {}),
    ...(request.location !== undefined ? { suburb: request.location.trim().slice(0, 60) } : {}),
    ...(request.category ? { trade: request.category as CustomerDraft["trade"] } : {}),
  };
}
