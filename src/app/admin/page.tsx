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

  type Row = { id: string; jobNumber: number; title: string; suburb: string; region: string; status: string; createdAt: Date; priceCents: number | null; _count: { estimates: number } };
  const Queue = ({ title, jobs, urgent, note }: { title: string; jobs: Row[]; urgent?: boolean; note?: (j: Row) => string }) => (
    <section className="card overflow-hidden p-4 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 font-bold">
        {title}
        <span className={`chip ${jobs.length && urgent ? "bg-amber-100 text-amber-900" : "bg-black/10"}`}>{jobs.length}</span>
      </h2>
      {jobs.length ? (
        <div className="divide-y divide-black/10">
          {jobs.map((j) => (
            <Link key={j.id} href={`/jobs/${j.id}`} className="flex min-h-16 flex-wrap items-center gap-3 rounded-xl py-4 text-sm hover:bg-paper">
              <span className="font-mono text-xs text-muted">{jobRef(j.jobNumber)}</span>
              <span className="min-w-0 flex-1 font-semibold">{j.title}</span>
              <span className="text-xs text-muted">{note ? note(j) : `${j.suburb} · ${timeAgo(j.createdAt)}`}</span>
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
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/tradies" className="chip min-h-12 bg-amber-400/20 px-4 py-3 text-amber-900">{pendingTradies} licence check{pendingTradies === 1 ? "" : "s"}</Link>
          <Link href="/admin/payouts" className="chip min-h-12 bg-leaf/15 px-4 py-3 text-leaf-dark">
            {pendingPayouts._count} payout{pendingPayouts._count === 1 ? "" : "s"} · {formatNZD((pendingPayouts._sum.grossCents ?? 0) + (pendingPayouts._sum.holidayPayCents ?? 0))}
          </Link>
        </div>
      </div>

      <p className="max-w-2xl text-muted">Review the scope and blind estimates, then set the customer’s fixed price. Each queue shows who needs to act next.</p>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Queue title="Admin · Set fixed price" urgent jobs={toPrice} note={(j) => `${j._count.estimates} estimate${j._count.estimates === 1 ? "" : "s"} · ${timeAgo(j.createdAt)}`} />
        <section className="card overflow-hidden p-4 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-bold">
            Admin · Price extra work
            <span className={`chip ${variations.length ? "bg-amber-100 text-amber-900" : "bg-black/10"}`}>{variations.length}</span>
          </h2>
          {variations.length ? (
            <div className="divide-y divide-black/10">
              {variations.map((v) => (
                <Link key={v.id} href={`/jobs/${v.job.id}`} className="block rounded-xl py-4 text-sm hover:bg-paper">
                  <div className="flex flex-wrap gap-3">
                    <span className="font-mono text-xs text-muted">{jobRef(v.job.jobNumber)}</span>
                    <span className="min-w-0 flex-1 font-semibold">{v.job.title}</span>
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
