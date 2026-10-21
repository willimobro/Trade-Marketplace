import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatNZD, jobRef } from "@/lib/constants";
import { canRecordPayment } from "@/lib/payment-eligibility";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ReceiptPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const user = await requireUser(`/receipts/${jobId}`);
  const job = await db.job.findUnique({
    where: { id: jobId },
    include: { payments: { orderBy: { createdAt: "asc" }, include: { variation: true } } },
  });
  if (!job || (job.customerId !== user.id && user.role !== "ADMIN")) notFound();
  const records = job.payments.filter((payment) =>
    ["PAID", "REFUNDED"].includes(payment.status) &&
    (payment.kind === "JOB" || (payment.kind === "VARIATION" && payment.variation?.status === "APPROVED")),
  );
  const refunded = records.filter((payment) => payment.status === "REFUNDED").reduce((total, payment) => total + payment.amountCents, 0);
  const recorded = records.reduce((total, payment) => total + payment.amountCents, 0);
  const availableCheckout = job.customerId === user.id
    ? job.payments.find((payment) => canRecordPayment({ ...payment, job }))
    : undefined;
  return <div className="mx-auto max-w-3xl px-4 py-8">
    <Link href={`/jobs/${job.id}`} className="btn-ghost mb-5">← Back to job</Link>
    <article className="card space-y-6 p-5 sm:p-8">
      <header>
        <p className="text-sm text-muted">{jobRef(job.jobNumber)}</p>
        <h1 className="mt-2 text-3xl font-bold">Payment record</h1>
        <p className="mt-2 break-words text-lg">{job.title}</p>
      </header>
      <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Demo receipt, not a tax invoice. Test entries do not charge or refund money. This record combines saved job payments and payments for approved extra work; pending payments are excluded.</p>
      {records.length ? <>
        <dl className="space-y-3 rounded-xl bg-paper p-4 text-sm">
          <div className="flex justify-between gap-4"><dt>Recorded payments</dt><dd className="shrink-0 tabular-nums">{formatNZD(recorded)}</dd></div>
          <div className="flex justify-between gap-4"><dt>Recorded refunds</dt><dd className="shrink-0 tabular-nums">{formatNZD(refunded)}</dd></div>
          <div className="flex justify-between gap-4 border-t border-black/10 pt-3 font-bold"><dt>Net recorded payments</dt><dd className="shrink-0 tabular-nums">{formatNZD(recorded - refunded)}</dd></div>
        </dl>
        <p className="text-sm text-muted">These are saved NZD totals including GST, not an amount owing. No separate GST breakdown is available.</p>
        <h2 className="text-lg font-semibold">Saved entries <span className="text-sm font-normal text-muted">({records.length})</span></h2>
        <ol className="divide-y divide-black/10">
          {records.map((payment) => <li key={payment.id} className="space-y-2 py-4">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-semibold">{payment.kind === "JOB" ? "Original job" : "Approved extra work"}</h3>
              <span className="font-semibold tabular-nums">{formatNZD(payment.amountCents)}</span>
            </div>
            {payment.variation && <p className="break-words text-sm">{payment.variation.description}</p>}
            <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${payment.status === "REFUNDED" ? "bg-paper text-ink" : "bg-leaf/15 text-leaf-dark"}`}>{payment.status === "REFUNDED" ? "Test refund recorded" : "Test payment recorded"}</p>
            <p className="text-xs text-muted">{payment.paidAt ? <>Payment recorded <time dateTime={payment.paidAt.toISOString()}>{payment.paidAt.toLocaleString("en-NZ", { timeZone: "Pacific/Auckland", dateStyle: "medium", timeStyle: "short" })}</time> (New Zealand time)</> : "Payment timestamp unavailable"}{payment.status === "REFUNDED" && "; refund date unavailable."}</p>
            <details className="text-xs text-muted">
              <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold underline">Record details</summary>
              <p className="break-all">Record ID: {payment.id}</p>
              <p className="mt-1">Provider: {payment.provider}</p>
            </details>
          </li>)}
        </ol>
      </> : <EmptyState title="No payment records yet">A record appears after a test payment is saved. Pending payments do not appear here.</EmptyState>}
      {availableCheckout && <div className="border-t border-black/10 pt-5">
        <h2 className="font-semibold">A test payment is ready to review</h2>
        <p className="mt-2 text-sm text-muted">{availableCheckout.kind === "JOB" ? "Original job" : "Extra work"} · {formatNZD(availableCheckout.amountCents)} including GST. This pending payment is not included in the saved records.</p>
        <Link href={`/pay/${availableCheckout.id}`} className="btn-primary mt-3">Review test checkout</Link>
      </div>}
    </article>
  </div>;
}
