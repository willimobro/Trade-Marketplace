import "server-only";
import { db } from "./db";
import { getSettings } from "./settings";
import { jobRates, priceWork } from "./pricing";

const FIRST_JOB_NUMBER = 1001;

export async function nextJobNumber() {
  const last = await db.job.aggregate({ _max: { jobNumber: true } });
  return Math.max((last._max.jobNumber ?? 0) + 1, FIRST_JOB_NUMBER);
}

/** Hours and materials the customer has paid for: the job plus approved variations. */
export async function paidScope(jobId: string) {
  const job = await db.job.findUniqueOrThrow({
    where: { id: jobId },
    include: { variations: { where: { status: "APPROVED" } } },
  });
  const hours = (job.hours ?? 0) + job.variations.reduce((s, v) => s + (v.hours ?? 0), 0);
  const materialsCents = (job.materialsCents ?? 0) + job.variations.reduce((s, v) => s + (v.materialsCents ?? 0), 0);
  return { job, hours, materialsCents };
}

/** Releases payouts the customer never responded to. Cheap; called on page loads instead of a cron. */
export async function releaseOverdue() {
  const { autoReleaseHours } = await getSettings();
  const cutoff = new Date(Date.now() - autoReleaseHours * 3_600_000);
  const overdue = await db.job.findMany({
    where: { status: "SUBMITTED", coc: { uploadedAt: { lt: cutoff } } },
    select: { id: true },
  });
  for (const j of overdue) await completeJob(j.id);
}

/** Signs a job off and queues the tradie's payout. Safe to call twice. */
export async function completeJob(jobId: string) {
  const { job, hours } = await paidScope(jobId);
  if (job.status !== "SUBMITTED" || !job.tradieId) return false;
  const rates = jobRates(job, await getSettings());
  const p = priceWork(hours, 0, rates, { applyMinimum: false });

  const updated = await db.job.updateMany({
    where: { id: jobId, status: "SUBMITTED" },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
  if (updated.count === 0) return false;
  await db.payout.create({
    data: {
      jobId,
      tradieId: job.tradieId,
      hours,
      rateCents: rates.tradieRateCents,
      grossCents: p.tradieGrossCents,
      holidayPayCents: p.holidayPayCents,
    },
  });
  return true;
}
