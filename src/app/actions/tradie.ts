"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { saveUploads } from "@/lib/uploads";
import { getTradeActionBlocker, tradeRequirementsPending } from "@/lib/trade-readiness";
import type { FormState } from "./types";

async function requireVerifiedTradie() {
  const user = await requireUser();
  if (user.role !== "TRADIE") return { user, error: "Only tradie accounts can do that." };
  if (tradeRequirementsPending(user.trade)) return { user, error: "Verification and completion requirements for your trade are not configured yet. This action is not available." };
  if (!user.licenceVerified) return { user, error: "Your licence needs to be verified first." };
  return { user, error: null };
}

const money = (label: string) =>
  z.coerce.number({ message: `Enter ${label}` }).min(0, `${label} can't be negative`).max(100_000);

const estimateSchema = z.object({
  hours: z.coerce.number({ message: "Enter hours" }).positive("Enter hours").max(200),
  materials: money("materials"),
  note: z.string().trim().max(1000).optional(),
});

export async function submitEstimate(jobId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { user, error } = await requireVerifiedTradie();
  if (error) return { error };
  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job || job.status !== "REVIEW") return { error: "This job isn't being priced any more." };
  const blocker = getTradeActionBlocker(user, job.category);
  if (blocker) return { error: blocker };

  const parsed = estimateSchema.safeParse({
    hours: form.get("hours"),
    materials: form.get("materials"),
    note: form.get("note") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.estimate.upsert({
    where: { jobId_tradieId: { jobId, tradieId: user.id } },
    create: {
      jobId,
      tradieId: user.id,
      hours: parsed.data.hours,
      materialsCents: Math.round(parsed.data.materials * 100),
      note: parsed.data.note ?? "",
    },
    update: {
      hours: parsed.data.hours,
      materialsCents: Math.round(parsed.data.materials * 100),
      note: parsed.data.note ?? "",
    },
  });
  revalidatePath(`/jobs/${jobId}`);
  return { ok: "Estimate saved - thanks." };
}

export async function claimJob(jobId: string): Promise<FormState> {
  const { user, error } = await requireVerifiedTradie();
  if (error) return { error };
  const job = await db.job.findUnique({ where: { id: jobId }, select: { category: true } });
  if (!job) return { error: "This job is no longer available." };
  const blocker = getTradeActionBlocker(user, job.category);
  if (blocker) return { error: blocker };
  // Atomic: only one tradie can win the race for a bookable job.
  const res = await db.job.updateMany({
    where: { id: jobId, status: "BOOKABLE", tradieId: null, category: user.trade! },
    data: { status: "ASSIGNED", tradieId: user.id, assignedAt: new Date() },
  });
  if (res.count === 0) return { error: "Someone else just took this job." };
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/jobs");
  return { ok: "Job's yours." };
}

const variationSchema = z.object({
  description: z.string().trim().min(10, "Describe what's extra (10+ characters)").max(2000),
  hours: z.coerce.number({ message: "Enter the extra hours" }).positive("Enter the extra hours").max(100),
});

export async function requestVariation(jobId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { user, error } = await requireVerifiedTradie();
  if (error) return { error };
  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job || job.tradieId !== user.id || job.status !== "ASSIGNED") return { error: "You can't add a variation to this job." };

  const parsed = variationSchema.safeParse({ description: form.get("description"), hours: form.get("hours") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let urls: string[];
  try {
    urls = await saveUploads(form.getAll("photos"), 6);
  } catch (e) {
    return { error: (e as Error).message };
  }
  if (!urls.length) return { error: "Photos of the variation are required." };

  await db.variation.create({
    data: {
      jobId,
      tradieId: user.id,
      description: parsed.data.description,
      hoursRequested: parsed.data.hours,
      photos: { create: urls.map((url) => ({ url, jobId })) },
    },
  });
  revalidatePath(`/jobs/${jobId}`);
  return { ok: "Variation sent to Trade Marketplace for pricing." };
}

const cocSchema = z.object({
  cocNumber: z.string().trim().min(3, "Enter the CoC number").max(40),
  materialsSpent: money("what you spent on materials"),
});

export async function submitCoc(jobId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  if (user.role !== "TRADIE") return { error: "Only tradie accounts can do that." };
  const job = await db.job.findUnique({ where: { id: jobId }, include: { variations: true } });
  if (!job || job.tradieId !== user.id || job.status !== "ASSIGNED") return { error: "You can't submit this job." };
  if (tradeRequirementsPending(job.category) || tradeRequirementsPending(user.trade))
    return { error: "Completion requirements for this trade are not configured yet. The electrical CoC flow cannot complete this job." };
  const blocker = getTradeActionBlocker(user, job.category);
  if (blocker) return { error: blocker };
  if (job.variations.some((v) => v.status === "REQUESTED" || v.status === "PRICED"))
    return { error: "Wait until the open variation is approved or declined." };

  const parsed = cocSchema.safeParse({ cocNumber: form.get("cocNumber"), materialsSpent: form.get("materialsSpent") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let fileUrl: string | undefined;
  try {
    [fileUrl] = await saveUploads([form.get("coc")], 1, { allowPdf: true });
  } catch (e) {
    return { error: (e as Error).message };
  }
  if (!fileUrl) return { error: "Upload the CoC (photo or PDF) to get paid." };

  await db.$transaction([
    db.coc.create({
      data: {
        jobId,
        cocNumber: parsed.data.cocNumber,
        fileUrl,
        materialsSpentCents: Math.round(parsed.data.materialsSpent * 100),
      },
    }),
    db.job.update({ where: { id: jobId }, data: { status: "SUBMITTED" } }),
  ]);
  revalidatePath(`/jobs/${jobId}`);
  return { ok: "CoC uploaded. You'll be paid once the customer confirms." };
}
