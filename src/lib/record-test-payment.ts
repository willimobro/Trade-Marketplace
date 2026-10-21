import type { PrismaClient } from "@prisma/client";
import { canRecordPayment } from "./payment-eligibility";

/** Re-check the saved checkout inside the same transaction as its state changes. */
export async function recordTestPayment(client: PrismaClient, paymentId: string, customerId: string) {
  return client.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { id: paymentId }, include: { job: true, variation: true } });
    if (!payment || payment.job.customerId !== customerId) return null;
    const result = { jobId: payment.jobId, recorded: false };
    if (!canRecordPayment(payment)) return result;
    const paidAt = new Date();
    // Relation guards also prevent an old checkout from reviving a cancelled job.
    const changed = await tx.payment.updateMany({
      where: {
        id: paymentId, status: "PENDING",
        job: { customerId, status: payment.kind === "JOB" ? "PRICED" : "ASSIGNED" },
        ...(payment.kind === "VARIATION" ? { variation: { status: "PRICED" } } : {}),
      },
      data: { status: "PAID", paidAt },
    });
    if (changed.count !== 1) return result;
    if (payment.kind === "JOB") {
      await tx.job.update({ where: { id: payment.jobId }, data: { status: "BOOKABLE", paidAt } });
    } else {
      await tx.variation.update({ where: { id: payment.variationId! }, data: { status: "APPROVED", resolvedAt: paidAt } });
    }
    return { ...result, recorded: true };
  });
}
