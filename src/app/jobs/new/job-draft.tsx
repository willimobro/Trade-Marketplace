"use client";
import { useEffect } from "react";
import { CATEGORY_NAMES } from "@/lib/constants";
export const DRAFT_FIELDS = ["title", "description", "region", "suburb", "address", "category"] as const;
export type DraftFields = Record<(typeof DRAFT_FIELDS)[number], string>;
export type JobDraft = { fields: DraftFields; reviewed: boolean; savedAt: number; submittedAt?: number };
const key = (userId: string) => `trade-marketplace:job-draft:v1:${userId}`;
export function clearJobDraft(userId: string) { sessionStorage.removeItem(key(userId)); }
export function readJobDraft(userId: string): JobDraft | null {
  const raw = sessionStorage.getItem(key(userId));
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw) as JobDraft;
    // Previous versions posted Electrical exclusively. Preserve those drafts.
    if (draft.fields && draft.fields.category === undefined) draft.fields.category = "Electrical";
    if (!Number.isFinite(draft.savedAt) || Date.now() - draft.savedAt > 86_400_000 || draft.savedAt > Date.now() || !draft.fields || !(CATEGORY_NAMES as readonly string[]).includes(draft.fields.category) || DRAFT_FIELDS.some((name) => typeof draft.fields[name] !== "string" || draft.fields[name].length > 4000)) {
      clearJobDraft(userId); return null;
    }
    return draft;
  } catch { clearJobDraft(userId); return null; }
}
export function saveJobDraft(userId: string, form: HTMLFormElement, reviewed: boolean, submitted = false) {
  const data = new FormData(form);
  const fields = Object.fromEntries(DRAFT_FIELDS.map((name) => [name, String(data.get(name) ?? "").slice(0, 4000)])) as DraftFields;
  const draft: JobDraft = { fields, reviewed, savedAt: Date.now(), ...(submitted ? { submittedAt: Date.now() } : {}) };
  sessionStorage.setItem(key(userId), JSON.stringify(draft));
}
/** Mount only for the authenticated owner of a persisted job. Never clear on form unmount. */
export function ClearPostedJobDraft({ userId, fields, createdAt }: { userId: string; fields: DraftFields; createdAt: string }) {
  useEffect(() => {
    try {
      const draft = readJobDraft(userId);
      if (draft?.submittedAt && new Date(createdAt).getTime() >= draft.submittedAt && DRAFT_FIELDS.every((name) => fields[name].trim() === draft.fields[name].trim())) clearJobDraft(userId);
    } catch { /* Storage may be disabled; it must not break the persisted job. */ }
  }, [userId, fields, createdAt]);
  return null;
}
