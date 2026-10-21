/** Existing lifecycle: base payment before claiming; extra work during assignment. */
export function canRecordPayment(payment: {
  status: string;
  kind: string;
  job: { status: string };
  variation: { status: string } | null;
}): boolean {
  if (payment.status !== "PENDING") return false;
  if (payment.kind === "JOB") return payment.job.status === "PRICED";
  return payment.kind === "VARIATION" && payment.job.status === "ASSIGNED" && payment.variation?.status === "PRICED";
}
