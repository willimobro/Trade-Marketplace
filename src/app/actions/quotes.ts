"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import type { FormState } from "./types";

const quoteSchema = z.object({
  price: z.coerce.number().positive("Enter a price").max(1_000_000),
  message: z.string().trim().min(10, "Add a short note about the quote (10+ characters)").max(2000),
});

export async function sendQuote(jobId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser(`/jobs/${jobId}`);
  if (user.role !== "TRADIE") return { error: "Only tradie accounts can quote." };

  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job || job.status !== "OPEN") return { error: "This job isn't taking quotes any more." };

  const parsed = quoteSchema.safeParse({ price: form.get("price"), message: form.get("message") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await db.quote.findUnique({ where: { jobId_tradieId: { jobId, tradieId: user.id } } });
  if (existing) return { error: "You've already quoted on this job." };

  await db.quote.create({
    data: {
      jobId,
      tradieId: user.id,
      priceCents: Math.round(parsed.data.price * 100),
      message: parsed.data.message,
    },
  });
  revalidatePath(`/jobs/${jobId}`);
  return { ok: "Quote sent." };
}

export async function acceptQuote(quoteId: string) {
  const user = await requireUser();
  const quote = await db.quote.findUnique({ where: { id: quoteId }, include: { job: true } });
  if (!quote || quote.job.customerId !== user.id || quote.job.status !== "OPEN") return;

  await db.$transaction([
    db.quote.update({ where: { id: quoteId }, data: { status: "ACCEPTED" } }),
    db.quote.updateMany({
      where: { jobId: quote.jobId, id: { not: quoteId } },
      data: { status: "DECLINED" },
    }),
    db.job.update({ where: { id: quote.jobId }, data: { status: "ASSIGNED" } }),
  ]);
  revalidatePath(`/jobs/${quote.jobId}`);
  revalidatePath("/dashboard");
}
