"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { saveUploads } from "@/lib/uploads";
import { completeJob, nextJobNumber } from "@/lib/jobs";
import { CATEGORY_NAMES, REGIONS } from "@/lib/constants";
import type { FormState } from "./types";

const jobSchema = z.object({
  title: z.string().trim().min(5, "Give the job a short title (5+ characters)").max(80),
  category: z.enum(CATEGORY_NAMES as unknown as [string, ...string[]], { message: "Pick a category" }),
  description: z.string().trim().min(20, "Describe the job in a bit more detail (20+ characters)").max(4000),
  region: z.enum(REGIONS, { message: "Pick a region" }),
  suburb: z.string().trim().min(2, "Enter the suburb or town").max(60),
  address: z.string().trim().min(5, "Enter the street address").max(120),
});

export type CreateJobState = { error?: string; jobId?: string } | undefined;

export async function createJob(_prev: CreateJobState, form: FormData): Promise<CreateJobState> {
  const user = await requireUser("/jobs/new");
  if (user.role !== "CUSTOMER") return { error: "Only customer accounts can post jobs." };

  const parsed = jobSchema.safeParse({
    title: form.get("title"),
    category: form.get("category"),
    description: form.get("description"),
    region: form.get("region"),
    suburb: form.get("suburb"),
    address: form.get("address"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let urls: string[];
  try {
    urls = await saveUploads(form.getAll("photos"), 6);
  } catch (e) {
    return { error: (e as Error).message };
  }
  if (!urls.length) return { error: "Add at least one photo so the job can be priced accurately." };

  const job = await db.job.create({
    data: {
      ...parsed.data,
      jobNumber: await nextJobNumber(),
      customerId: user.id,
      photos: { create: urls.map((url) => ({ url })) },
    },
  });
  // Return the persisted identity without coupling mutation completion to Next's
  // redirect destination rendering. The client can acknowledge/save and navigate.
  return { jobId: job.id };
}

/** Before payment the customer can just walk away; after payment TM investigates. */
export async function requestCancel(jobId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const reason = String(form.get("reason") ?? "").trim();
  if (reason.length < 5) return { error: "Tell us briefly why you're cancelling." };

  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job || job.customerId !== user.id) return { error: "Job not found." };

  if (job.status === "REVIEW" || job.status === "PRICED") {
    await db.job.update({ where: { id: jobId }, data: { status: "CANCELLED", cancelReason: reason } });
  } else if (job.status === "BOOKABLE" || job.status === "ASSIGNED") {
    await db.job.update({ where: { id: jobId }, data: { status: "CANCEL_REVIEW", cancelReason: reason } });
  } else {
    return { error: "This job can't be cancelled now." };
  }
  revalidatePath(`/jobs/${jobId}`);
  return { ok: "Cancellation requested." };
}

export async function confirmCompletion(jobId: string) {
  const user = await requireUser();
  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job || job.customerId !== user.id) return;
  await completeJob(jobId);
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard");
}
