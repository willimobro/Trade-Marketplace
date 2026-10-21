import styles from "../admin.module.css";
import Link from "next/link";
import { db } from "@/lib/db";
import { markPayoutPaid } from "@/app/actions/admin";
import { formatNZD, jobRef, timeAgo } from "@/lib/constants";
import { ConfirmAction } from "../ConfirmAction";
import { PayrollExport } from "./PayrollExport";
import { StatusChip } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const payouts = await db.payout.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { tradie: { select: { name: true, email: true } }, job: { select: { id: true, jobNumber: true, title: true } } },
  });
  const pending = payouts.filter((p) => p.status === "PENDING");
  const total = pending.reduce((s, p) => s + p.grossCents + p.holidayPayCents, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Payroll records</h1>
          <p className="mt-3 text-muted">{pending.length} pending · {formatNZD(total)} gross including holiday pay</p>
        </div>
      </div>
      <p className="max-w-2xl text-sm text-muted">Review the exported records in your payroll process. Exporting does not run payroll, calculate take-home pay or transfer money. Marking paid only updates this demo’s record.</p>
      <PayrollExport count={pending.length} total={formatNZD(total)} />
      <h2 className="text-xl font-bold">Record detail & reconciliation</h2>
      <div className="grid gap-4">
        {payouts.map((p) => (
          <article key={p.id} className={`card space-y-4 ${styles.record}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className={styles.person}>
                <h2 className="font-bold">{p.tradie.name}</h2>
                <p className="text-sm text-muted">{p.tradie.email}</p>
                <Link href={`/jobs/${p.job.id}`} className="mt-2 inline-block py-2 font-medium underline underline-offset-4">{jobRef(p.job.jobNumber)} · {p.job.title}</Link>
              </div>
              <StatusChip status={p.status} />
            </div>
            <dl className={styles.amounts}>
              <div><dt className="text-muted">Hours</dt><dd className="mt-1 font-semibold tabular-nums">{p.hours}</dd></div>
              <div><dt className="text-muted">Gross pay</dt><dd className="mt-1 font-semibold tabular-nums">{formatNZD(p.grossCents)}</dd></div>
              <div><dt className="text-muted">Holiday pay</dt><dd className="mt-1 font-semibold tabular-nums">{formatNZD(p.holidayPayCents)}</dd></div>
              <div><dt className="text-muted">Total before deductions</dt><dd className="mt-1 font-semibold tabular-nums">{formatNZD(p.grossCents + p.holidayPayCents)}</dd></div>
            </dl>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted">Created {timeAgo(p.createdAt)}{p.paidAt ? ` · Manually marked paid ${timeAgo(p.paidAt)}` : ""}</p>
              {p.status === "PENDING" && <ConfirmAction action={markPayoutPaid.bind(null, p.id)} label="Review paid status" description={`Record ${formatNZD(p.grossCents + p.holidayPayCents)} gross for ${p.tradie.name} as paid? Confirm it has been reconciled outside this app. This does not transfer money.`} confirmLabel="Mark record paid" />}
            </div>
          </article>
        ))}
        {!payouts.length && <div className="card p-6"><h2 className="font-bold">No payroll records yet</h2><p className="mt-2 text-muted">Eligible completed jobs will appear here for payroll review.</p></div>}
      </div>
    </div>
  );
}
