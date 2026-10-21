"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

// TEST MODE: marks the payment paid without taking money. Swap this for a real
// payment provider (e.g. Stripe Checkout + webhook) before going live.
export async function payTestMode(paymentId: string) {
  const user = await requireUser();
  const payment = await db.payment.findUnique({ where: { id: paymentId }, include: { job: true, variation: true } });
  if (!payment || payment.job.customerId !== user.id || payment.status !== "PENDING") redirect("/dashboard");

  if (payment.kind === "JOB") {
    if (payment.job.status !== "PRICED") redirect(`/jobs/${payment.jobId}`);
    await db.$transaction([
      db.payment.update({ where: { id: paymentId }, data: { status: "PAID", paidAt: new Date() } }),
      db.job.update({ where: { id: payment.jobId }, data: { status: "BOOKABLE", paidAt: new Date() } }),
    ]);
  } else if (payment.variationId && payment.variation?.status === "PRICED") {
    await db.$transaction([
      db.payment.update({ where: { id: paymentId }, data: { status: "PAID", paidAt: new Date() } }),
      db.variation.update({ where: { id: payment.variationId }, data: { status: "APPROVED", resolvedAt: new Date() } }),
    ]);
  }
  revalidatePath(`/jobs/${payment.jobId}`);
  redirect(`/jobs/${payment.jobId}?paid=1`);
}

export async function declineVariation(variationId: string) {
  const user = await requireUser();
  const v = await db.variation.findUnique({ where: { id: variationId }, include: { job: true } });
  if (!v || v.job.customerId !== user.id || v.status !== "PRICED") return;
  await db.$transaction([
    db.payment.deleteMany({ where: { variationId, status: "PENDING" } }),
    db.variation.update({ where: { id: variationId }, data: { status: "DECLINED", resolvedAt: new Date() } }),
  ]);
  revalidatePath(`/jobs/${v.jobId}`);
}
