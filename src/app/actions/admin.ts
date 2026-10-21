"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { jobRates, priceWork } from "@/lib/pricing";
import { completeJob } from "@/lib/jobs";
import type { FormState } from "./types";

const scopeSchema = z.object({
  hours: z.coerce.number({ message: "Enter hours" }).positive("Enter hours").max(500),
  materials: z.coerce.number({ message: "Enter materials" }).min(0).max(200_000),
  note: z.string().trim().max(1000).optional(),
});

export async function priceJob(jobId: string, _prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job || (job.status !== "REVIEW" && job.status !== "PRICED")) return { error: "This job can't be priced now." };

  const parsed = scopeSchema.safeParse({ hours: form.get("hours"), materials: form.get("materials"), note: form.get("note") || undefined });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const s = await getSettings();
  const p = priceWork(parsed.data.hours, Math.round(parsed.data.materials * 100), s);

  await db.$transaction([
    // Re-pricing replaces any unpaid payment request.
    db.payment.deleteMany({ where: { jobId, kind: "JOB", status: "PENDING" } }),
    db.job.update({
      where: { id: jobId },
      data: {
        status: "PRICED",
        hours: p.hours,
        materialsCents: p.materialsCents,
        tradieRateCents: s.tradieRateCents,
        onCostPct: s.onCostPct,
        marginPct: s.marginPct,
        gstPct: s.gstPct,
        priceCents: p.totalCents,
        pricingNote: parsed.data.note ?? null,
        pricedAt: new Date(),
      },
    }),
    db.payment.create({ data: { jobId, kind: "JOB", amountCents: p.totalCents } }),
  ]);
  revalidatePath(`/jobs/${jobId}`);
  return { ok: "Price sent to the customer." };
}

export async function priceVariation(variationId: string, _prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const v = await db.variation.findUnique({ where: { id: variationId }, include: { job: true } });
  if (!v || (v.status !== "REQUESTED" && v.status !== "PRICED")) return { error: "This variation can't be priced now." };

  const parsed = scopeSchema.safeParse({ hours: form.get("hours"), materials: form.get("materials") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Variations use the job's frozen rates and no minimum charge.
  const rates = jobRates(v.job, await getSettings());
  const p = priceWork(parsed.data.hours, Math.round(parsed.data.materials * 100), rates, { applyMinimum: false });

  await db.$transaction([
    db.payment.deleteMany({ where: { variationId, status: "PENDING" } }),
    db.variation.update({
      where: { id: variationId },
      data: { status: "PRICED", hours: p.hours, materialsCents: p.materialsCents, priceCents: p.totalCents },
    }),
    db.payment.create({ data: { jobId: v.jobId, variationId, kind: "VARIATION", amountCents: p.totalCents } }),
  ]);
  revalidatePath(`/jobs/${v.jobId}`);
  return { ok: "Variation priced and sent to the customer." };
}

export async function resolveCancellation(jobId: string, _prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job || job.status !== "CANCEL_REVIEW") return { error: "No cancellation to resolve." };
  const outcome = form.get("outcome");
  if (outcome !== "REFUND" && outcome !== "REINSTATE") return { error: "Pick an outcome." };
  const note = String(form.get("note") ?? "").trim();
  if (note.length < 5) return { error: "Record the outcome of the investigation." };

  if (outcome === "REFUND") {
    await db.$transaction([
      db.payment.updateMany({ where: { jobId, status: "PAID" }, data: { status: "REFUNDED" } }),
      db.job.update({ where: { id: jobId }, data: { status: "CANCELLED", cancelReason: `${job.cancelReason}\n\nOutcome: ${note}` } }),
    ]);
  } else {
    await db.job.update({
      where: { id: jobId },
      data: { status: job.tradieId ? "ASSIGNED" : "BOOKABLE", cancelReason: `${job.cancelReason}\n\nReinstated: ${note}` },
    });
  }
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/admin");
  return { ok: outcome === "REFUND" ? "Refunded and cancelled." : "Job reinstated." };
}

/** TM checked the CoC; release payout without waiting for the customer. */
export async function adminSignOff(jobId: string) {
  await requireAdmin();
  await completeJob(jobId);
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/admin");
}

export async function markPayoutPaid(payoutId: string) {
  await requireAdmin();
  await db.payout.updateMany({ where: { id: payoutId, status: "PENDING" }, data: { status: "PAID", paidAt: new Date() } });
  revalidatePath("/admin/payouts");
}

export async function setLicence(userId: string, verified: boolean) {
  await requireAdmin();
  const result = await db.user.updateMany({
    where: { id: userId, role: "TRADIE", ...(verified ? { trade: "Electrical" } : {}) },
    data: { licenceVerified: verified },
  });
  if (verified && result.count === 0) throw new Error("Verification is available only for electrical accounts with configured requirements. Other trades cannot be verified through the EWRB flow.");
  revalidatePath("/admin/tradies");
}

const settingsSchema = z.object({
  tradieRate: z.coerce.number().min(23.5, "Below minimum wage").max(500),
  holidayPayPct: z.coerce.number().min(8, "Casual holiday pay is at least 8%").max(50),
  onCostPct: z.coerce.number().min(0).max(100),
  marginPct: z.coerce.number().min(0).max(200),
  gstPct: z.coerce.number().min(0).max(50),
  minHours: z.coerce.number().min(0).max(24),
  autoReleaseHours: z.coerce.number().int().min(1).max(720),
});

export async function updateSettings(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { tradieRate, ...rest } = parsed.data;
  if (rest.onCostPct < rest.holidayPayPct) return { error: "On-costs must include the holiday pay %." };
  await db.settings.upsert({
    where: { id: 1 },
    create: { id: 1, tradieRateCents: Math.round(tradieRate * 100), ...rest },
    update: { tradieRateCents: Math.round(tradieRate * 100), ...rest },
  });
  revalidatePath("/", "layout");
  return { ok: "Saved. New rates apply to jobs priced from now on." };
}
