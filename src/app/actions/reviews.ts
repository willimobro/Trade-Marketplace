"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import type { FormState } from "./types";

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Pick a star rating").max(5, "Pick a star rating"),
  comment: z.string().trim().max(1000),
});

export async function leaveReview(jobId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job || job.customerId !== user.id || job.status !== "COMPLETED" || !job.tradieId)
    return { error: "You can only review a completed job you posted." };

  const parsed = reviewSchema.safeParse({ rating: form.get("rating"), comment: form.get("comment") ?? "" });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await db.review.create({ data: { ...parsed.data, jobId, authorId: user.id, tradieId: job.tradieId } });
  } catch {
    return { error: "You've already reviewed this job." };
  }
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath(`/tradies/${job.tradieId}`);
  return { ok: "Thanks for the review!" };
}
