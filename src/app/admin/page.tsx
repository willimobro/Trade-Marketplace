import styles from "./admin.module.css";
import Link from "next/link";
import { db } from "@/lib/db";
import { releaseOverdue } from "@/lib/jobs";
import { formatNZD, jobRef, timeAgo } from "@/lib/constants";


export const dynamic = "force-dynamic";

const jobSelect = {
  id: true, jobNumber: true, title: true, suburb: true, region: true, status: true, createdAt: true, priceCents: true,
  _count: { select: { estimates: true } },
} as const;

export default async function AdminPage() {
  await releaseOverdue();
  const [toPrice, variations, cancels, signOff, awaitingPay, bookable, inProgress, pendingTradies, pendingPayouts] = await Promise.all([
    db.job.findMany({ where: { status: "REVIEW" }, orderBy: { createdAt: "asc" }, select: jobSelect }),
    db.variation.findMany({ where: { status: "REQUESTED" }, orderBy: { createdAt: "asc" }, include: { job: { select: jobSelect } } }),
    db.job.findMany({ where: { status: "CANCEL_REVIEW" }, select: jobSelect }),
    db.job.findMany({ where: { status: "SUBMITTED" }, select: jobSelect }),
    db.job.findMany({ where: { status: "PRICED" }, select: jobSelect }),
    db.job.findMany({ where: { status: "BOOKABLE" }, select: jobSelect }),
    db.job.findMany({ where: { status: "ASSIGNED" }, select: jobSelect }),
    db.user.count({ where: { role: "TRADIE", licenceVerified: false } }),
    db.payout.aggregate({ where: { status: "PENDING" }, _sum: { grossCents: true, holidayPayCents: true }, _count: true }),
  ]);

  const adminActions = toPrice.length + variations.length + cancels.length;

  type Row = { id: string; jobNumber: number; title: string; suburb: string; region: string; status: string; createdAt: Date; priceCents: number | null; _count: { estimates: number } };
  const Queue = ({ title, jobs, urgent, note }: { title: string; jobs: Row[]; urgent?: boolean; note?: (j: Row) => string }) => (
    <section className={`card ${styles.queue}`}>
      <h2 className={styles.queueHeading}>
        {title}
        <span className={`chip ${jobs.length && urgent ? "bg-amber-100 text-amber-900" : "bg-black/10"}`}>{jobs.length}</span>
      </h2>
      {jobs.length ? (
        <div className="divide-y divide-black/10">
          {jobs.map((j) => (
            <Link key={j.id} href={`/jobs/${j.id}`} className={styles.queueRow}>
              <span className="font-mono text-xs text-muted">{jobRef(j.jobNumber)}</span>
              <span className={styles.queueTitle}>{j.title}</span>
              <span className={styles.queueMeta}>{note ? note(j) : `${j.suburb} · ${timeAgo(j.createdAt)}`}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No jobs waiting at this stage.</p>
      )}
    </section>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold sm:text-4xl">Operations</h1>

      </div>

      <p className="max-w-2xl text-muted">Review the scope and blind estimates, then set the customer’s fixed price. Each queue shows who needs to act next.</p>
      <section aria-label="Next operational actions" className={styles.metricGrid}>
        <a href="#admin-review" className="card block p-5 hover:bg-paper"><span className="text-3xl font-bold">{adminActions}</span><h2 className="mt-2 font-semibold">Job reviews</h2><p className="mt-2 text-sm text-muted">Set a fixed price, review extra work or investigate a cancellation.</p></a>
        <Link href="/admin/tradies" className="card block p-5 hover:bg-paper"><span className="text-3xl font-bold">{pendingTradies}</span><h2 className="mt-2 font-semibold">Licence checks</h2><p className="mt-2 text-sm text-muted">Review registration before updating verified status.</p></Link>
        <Link href="/admin/payouts" className="card block p-5 hover:bg-paper"><span className="text-3xl font-bold">{pendingPayouts._count}</span><h2 className="mt-2 font-semibold">Payroll records</h2><p className="mt-2 text-sm text-muted">Export and reconcile pending records outside the app.</p></Link>
      </section>
      <div id="admin-review" className="scroll-mt-24"><h2 className="text-xl font-bold">Needs an admin decision</h2><p className="mt-2 text-sm text-muted">Open a job to review its evidence and available actions. Counts are current at page load; these are not overdue or SLA alerts.</p></div>
      <div className={styles.queueGrid}>
        <Queue title="Admin · Set fixed price" urgent jobs={toPrice} note={(j) => `${j._count.estimates} estimate${j._count.estimates === 1 ? "" : "s"} · ${timeAgo(j.createdAt)}`} />
        <section className={`card ${styles.queue}`}>
          <h2 className={styles.queueHeading}>
            Admin · Price extra work
            <span className={`chip ${variations.length ? "bg-amber-100 text-amber-900" : "bg-black/10"}`}>{variations.length}</span>
          </h2>
          {variations.length ? (
            <div className="divide-y divide-black/10">
              {variations.map((v) => (
                <Link key={v.id} href={`/jobs/${v.job.id}`} className={styles.queueRow}>
                  <div className="grid gap-2">
                    <span className="font-mono text-xs text-muted">{jobRef(v.job.jobNumber)}</span>
                    <span className={styles.queueTitle}>{v.job.title}</span>
                    <span className="text-xs font-semibold text-red-700">{timeAgo(v.createdAt)} - sparky waiting</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{v.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No jobs waiting at this stage.</p>
          )}
        </section>
        <Queue title="Admin · Review cancellations" urgent jobs={cancels} />
      </div>
      <div><h2 className="text-xl font-bold">Waiting on customers & electricians</h2><p className="mt-2 text-sm text-muted">Monitor these stages. The next action belongs to the person named in each queue.</p></div>
      <div className={styles.queueGrid}>
        <Queue title="Customer · Confirm completed work" jobs={signOff} />
        <Queue title="Customer · Review price & test payment" jobs={awaitingPay} note={(j) => formatNZD(j.priceCents ?? 0)} />
        <Queue title="Electrician · Claim available work" urgent jobs={bookable} note={(j) => `test payment recorded · ${j.region}`} />
        <Queue title="Electrician · Complete assigned work" jobs={inProgress} />
      </div>
      {toPrice.length + variations.length + cancels.length + signOff.length + awaitingPay.length + bookable.length + inProgress.length + pendingTradies + pendingPayouts._count === 0 && (
        <p className="rounded-2xl border border-black/10 bg-white p-6 text-muted">No active jobs, licence checks or payroll records are waiting. New work will appear here.</p>
      )}
    </div>
  );
}
