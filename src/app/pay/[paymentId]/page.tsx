import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatNZD, jobRef } from "@/lib/constants";
import { payTestMode } from "@/app/actions/payments";
import { SubmitButton } from "@/components/SubmitButton";

export default async function PayPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  const user = await requireUser(`/pay/${paymentId}`);
  const payment = await db.payment.findUnique({ where: { id: paymentId }, include: { job: true, variation: true } });
  if (!payment || payment.job.customerId !== user.id) notFound();

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card p-6">
        <p className="text-xs text-muted">{jobRef(payment.job.jobNumber)} · {payment.kind === "JOB" ? "Job payment" : "Variation"}</p>
        <h1 className="mt-1 text-xl font-bold">{payment.job.title}</h1>
        {payment.variation && <p className="mt-2 text-sm text-muted">{payment.variation.description}</p>}
        <p className="mt-6 text-4xl font-bold">{formatNZD(payment.amountCents)}</p>
        <p className="text-xs text-muted">incl GST</p>

        {payment.status === "PENDING" ? (
          <>
            <div className="mt-6 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">
              <strong>Test mode.</strong> No real payment provider is connected yet - this button marks it paid without charging anything.
            </div>
            <form action={payTestMode.bind(null, payment.id)} className="mt-4">
              <SubmitButton className="btn-primary w-full py-3 text-base" pending="Processing…">Pay {formatNZD(payment.amountCents)} (test)</SubmitButton>
            </form>
          </>
        ) : (
          <p className="mt-6 text-sm text-leaf-dark">This payment is {payment.status.toLowerCase()}.</p>
        )}
        <Link href={`/jobs/${payment.jobId}`} className="mt-4 block text-center text-sm text-muted hover:underline">Back to job</Link>
      </div>
    </div>
  );
}
