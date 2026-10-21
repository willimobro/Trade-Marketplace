import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatNZD, jobRef } from "@/lib/constants";
import { payTestMode } from "@/app/actions/payments";
import { canRecordPayment } from "@/lib/payment-eligibility";
import { tradeRequirementsPending } from "@/lib/trade-readiness";
import { SubmitButton } from "@/components/SubmitButton";

export const dynamic = "force-dynamic";

export default async function PayPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  const user = await requireUser(`/pay/${paymentId}`);
  const payment = await db.payment.findUnique({ where: { id: paymentId }, include: { job: true, variation: true } });
  if (!payment || payment.job.customerId !== user.id) notFound();

  const canPay = canRecordPayment(payment);
  const isJobPayment = payment.kind === "JOB";
  const pendingRequirements = tradeRequirementsPending(payment.job.category);
  const paymentState = payment.status === "PAID"
    ? "Test payment recorded"
    : payment.status === "REFUNDED"
      ? "Test refund recorded"
      : canPay ? "Ready to review" : "Checkout unavailable";

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12">
      <Link href={`/jobs/${payment.jobId}`} className="mb-5 inline-flex min-h-11 items-center text-sm font-semibold underline">← Back to job</Link>
      <div className="card p-6 sm:p-8">
        <p className="text-xs text-muted">{jobRef(payment.job.jobNumber)} · {isJobPayment ? "Original job" : "Extra work"}</p>
        <h1 className="mt-2 text-2xl font-bold">{canPay ? "Review test payment" : paymentState}</h1>
        <p className="mt-3 break-words text-lg font-semibold">{payment.job.title}</p>
        <p className="mt-1 text-sm text-muted">{payment.job.suburb}, {payment.job.region}</p>

        <section aria-labelledby="payment-scope-heading" className="mt-6 border-t border-black/10 pt-5">
          <h2 id="payment-scope-heading" className="font-semibold">{isJobPayment ? "Job scope" : "Extra work for approval"}</h2>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm">{isJobPayment ? payment.job.description : payment.variation?.description ?? "Return to the job to review this payment’s scope."}</p>
          {isJobPayment && payment.job.pricingNote && <div className="mt-3 rounded-xl bg-paper p-3 text-sm"><p className="font-semibold">Note from Trade Marketplace</p><p className="mt-1 whitespace-pre-wrap break-words">{payment.job.pricingNote}</p></div>}
        </section>

        <dl className="mt-6 rounded-xl bg-paper p-4">
          <dt className="text-sm text-muted">{isJobPayment ? "Original job total" : "Extra-work total"}</dt>
          <dd className="mt-1 break-words text-4xl font-bold tabular-nums">{formatNZD(payment.amountCents)}</dd>
          <dd className="mt-1 text-sm text-muted">NZD · includes GST</dd>
        </dl>

        {canPay ? (
          <>
            <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">Test checkout · no real money moves</p>
            <p className="mt-4 text-sm text-muted">{isJobPayment
              ? pendingRequirements
                ? `Recording this test payment saves a payment record for the job. ${payment.job.category} verification and completion requirements are still pending, so claiming is not enabled. It does not schedule an appointment.`
                : "Recording this test payment makes the job available for an eligible tradie to claim. It does not schedule an appointment."
              : "Recording this test payment approves only the extra work described above, in addition to the original job."}</p>
            <form action={payTestMode.bind(null, payment.id)} className="mt-4">
              <SubmitButton className="btn-primary w-full py-3 text-base" pending="Recording test payment…">{isJobPayment ? "Record test payment" : "Approve extra work & record test payment"} · {formatNZD(payment.amountCents)}</SubmitButton>
            </form>
          </>
        ) : (
          <p role="status" className="mt-6 rounded-xl bg-paper p-4 text-sm">{payment.status === "REFUNDED" ? "A test refund is saved for this payment. No money was charged or refunded." : payment.status === "PAID" ? "This test payment is already saved. No money was charged. You can view it in the job’s payment record." : "This checkout is no longer available for the job’s current stage. Return to the job for the latest status before taking another action."}</p>
        )}
        <Link href={`/receipts/${payment.jobId}`} className="btn-ghost mt-4 w-full">View consolidated payment record</Link>
      </div>
    </div>
  );
}
