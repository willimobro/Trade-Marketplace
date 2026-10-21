import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatNZD, jobRef } from "@/lib/constants";
import { payTestMode } from "@/app/actions/payments";
import { canRecordPayment } from "@/lib/payment-eligibility";
import { SubmitButton } from "@/components/SubmitButton";

export default async function PayPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  const user = await requireUser(`/pay/${paymentId}`);
  const payment = await db.payment.findUnique({ where: { id: paymentId }, include: { job: true, variation: true } });
  if (!payment || payment.job.customerId !== user.id) notFound();

  const canPay = canRecordPayment(payment);

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="card p-6 sm:p-8">
        <p className="mb-5 rounded-xl bg-amber-50 p-3 font-semibold text-amber-900">Test checkout · no real money moves</p>
        <p className="text-xs text-muted">{jobRef(payment.job.jobNumber)} · {payment.kind === "JOB" ? "Job payment" : "Variation"}</p>
        <h1 className="mt-1 text-xl font-bold">{payment.job.title}</h1>
        {payment.variation && <p className="mt-2 text-sm text-muted">{payment.variation.description}</p>}
        <p className="mt-6 text-4xl font-bold">{formatNZD(payment.amountCents)}</p>
        <p className="text-sm text-muted">NZD · includes GST</p>
        <p className="mt-4 text-sm text-muted">{payment.kind === "JOB" ? "Recording this test payment makes the job available for an eligible tradie to claim. It does not schedule an appointment." : "Recording this test payment approves the extra work described above."}</p>

        {canPay ? (
          <>
            <form action={payTestMode.bind(null, payment.id)} className="mt-4">
              <SubmitButton className="btn-primary w-full py-3 text-base" pending="Processing…">Record test payment · {formatNZD(payment.amountCents)}</SubmitButton>
            </form>
          </>
        ) : (
          <p className="mt-6 text-sm text-leaf-dark">{payment.status === "REFUNDED" ? "Demo refund recorded · no money moved." : payment.status === "PENDING" ? "This payment is no longer available for the job’s current stage. Return to the job for the latest status." : `This payment is ${payment.status.toLowerCase()}.`}</p>
        )}
        <Link href={`/receipts/${payment.jobId}`} className="btn-ghost mt-4 w-full">View consolidated payment record</Link>
        <Link href={`/jobs/${payment.jobId}`} className="mt-4 block text-center text-sm text-muted hover:underline">Back to job</Link>
      </div>
    </div>
  );
}
