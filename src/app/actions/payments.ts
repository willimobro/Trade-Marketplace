"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { recordTestPayment } from "@/lib/record-test-payment";

// TEST MODE: marks the payment paid without taking money. Swap this for a real
// payment provider (e.g. Stripe Checkout + webhook) before going live.
export async function payTestMode(paymentId: string) {
  const user = await requireUser();
  const result = await recordTestPayment(db, paymentId, user.id);
  if (!result) redirect("/dashboard");
  revalidatePath(`/jobs/${result.jobId}`);
  redirect(`/jobs/${result.jobId}${result.recorded ? "?paid=1" : ""}`);
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
