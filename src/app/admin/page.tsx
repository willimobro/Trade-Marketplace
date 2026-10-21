import Link from "next/link";
import { db } from "@/lib/db";
import { releaseOverdue } from "@/lib/jobs";
import { formatNZD, jobRef, timeAgo } from "@/lib/constants";
import { EmptyState, StatusChip } from "@/components/ui";

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
    <section>
      <h2 className="mb-2 flex items-center gap-2 font-bold">
        {title}
        <span className={`chip ${jobs.length && urgent ? "bg-red-500 text-white" : "bg-black/10"}`}>{jobs.length}</span>
      </h2>
      {jobs.length ? (
        <div className="card divide-y divide-black/5">
          {jobs.map((j) => (
            <Link key={j.id} href={`/jobs/${j.id}`} className="flex flex-wrap items-center gap-3 p-3 text-sm hover:bg-black/[0.02]">
              <span className="font-mono text-xs text-muted">{jobRef(j.jobNumber)}</span>
              <span className="min-w-0 flex-1 truncate font-medium">{j.title}</span>
              <span className="text-xs text-muted">{note ? note(j) : `${j.suburb} · ${timeAgo(j.createdAt)}`}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Nothing here.</p>
      )}
    </section>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold">Trade Marketplace admin</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/admin/tradies" className="chip bg-amber-400/20 py-1 text-amber-900">{pendingTradies} licence check{pendingTradies === 1 ? "" : "s"}</Link>
          <Link href="/admin/payouts" className="chip bg-leaf/15 py-1 text-leaf-dark">
            {pendingPayouts._count} payout{pendingPayouts._count === 1 ? "" : "s"} · {formatNZD((pendingPayouts._sum.grossCents ?? 0) + (pendingPayouts._sum.holidayPayCents ?? 0))}
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Queue title="Needs pricing" urgent jobs={toPrice} note={(j) => `${j._count.estimates} estimate${j._count.estimates === 1 ? "" : "s"} · ${timeAgo(j.createdAt)}`} />
        <section>
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            Variations to price
            <span className={`chip ${variations.length ? "bg-red-500 text-white" : "bg-black/10"}`}>{variations.length}</span>
          </h2>
          {variations.length ? (
            <div className="card divide-y divide-black/5">
              {variations.map((v) => (
                <Link key={v.id} href={`/jobs/${v.job.id}`} className="block p-3 text-sm hover:bg-black/[0.02]">
                  <div className="flex gap-3">
                    <span className="font-mono text-xs text-muted">{jobRef(v.job.jobNumber)}</span>
                    <span className="flex-1 truncate font-medium">{v.job.title}</span>
                    <span className="text-xs font-semibold text-red-700">{timeAgo(v.createdAt)} - sparky waiting</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted">{v.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Nothing here.</p>
          )}
        </section>
        <Queue title="Cancellation investigations" urgent jobs={cancels} />
        <Queue title="CoC sign-off" jobs={signOff} />
        <Queue title="Priced - waiting for customer to pay" jobs={awaitingPay} note={(j) => formatNZD(j.priceCents ?? 0)} />
        <Queue title="Paid - waiting for a sparky" urgent jobs={bookable} note={(j) => `paid · ${j.region}`} />
        <Queue title="In progress" jobs={inProgress} />
      </div>
      {toPrice.length + variations.length + cancels.length === 0 && (
        <EmptyState title="All caught up ✓"><StatusChip status="COMPLETED" /></EmptyState>
      )}
    </div>
  );
}
