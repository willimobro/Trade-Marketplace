import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { releaseOverdue } from "@/lib/jobs";
import { formatNZD, jobRef, timeAgo } from "@/lib/constants";
import { JobCard } from "@/components/JobCard";
import { EmptyState, LicenceBadge, StatusChip } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  if (user.role === "ADMIN") redirect("/admin");
  await releaseOverdue();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kia ora, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-muted">{user.role === "TRADIE" ? `${user.trade} · ${user.region}` : user.region}</p>
        </div>
        {user.role === "CUSTOMER" ? (
          <Link href="/jobs/new" className="btn-primary">+ Get a price</Link>
        ) : (
          <div className="flex items-center gap-3">
            <LicenceBadge verified={user.licenceVerified} />
            <Link href="/jobs" className="btn-primary">Job board</Link>
          </div>
        )}
      </div>
      {user.role === "CUSTOMER" ? <CustomerDash userId={user.id} /> : <TradieDash userId={user.id} />}
    </div>
  );
}

async function CustomerDash({ userId }: { userId: string }) {
  const jobs = await db.job.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: "desc" },
    include: { photos: { take: 1, where: { variationId: null } } },
  });
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-bold">Your jobs</h2>
      {jobs.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id} job={job} audience="customer"
              aside={job.priceCents != null && <span className="font-semibold text-ink">{formatNZD(job.priceCents)}</span>}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No jobs yet">
          <Link href="/jobs/new" className="underline">Get a fixed price</Link> - free, no obligation.
        </EmptyState>
      )}
    </section>
  );
}

async function TradieDash({ userId }: { userId: string }) {
  const [active, payouts, estimates] = await Promise.all([
    db.job.findMany({
      where: { tradieId: userId, status: { in: ["ASSIGNED", "SUBMITTED", "CANCEL_REVIEW"] } },
      orderBy: { assignedAt: "desc" },
      include: { photos: { take: 1, where: { variationId: null } } },
    }),
    db.payout.findMany({ where: { tradieId: userId }, orderBy: { createdAt: "desc" }, include: { job: { select: { id: true, title: true, jobNumber: true } } } }),
    db.estimate.count({ where: { tradieId: userId } }),
  ]);
  const sum = (status: string) => payouts.filter((p) => p.status === status).reduce((s, p) => s + p.grossCents + p.holidayPayCents, 0);

  return (
    <>
      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Active jobs", active.length.toString()],
          ["Estimates sent", estimates.toString()],
          ["Pay queued", formatNZD(sum("PENDING"))],
          ["Paid to date", formatNZD(sum("PAID"))],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-1 text-xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">Your active jobs</h2>
        {active.length ? (
          <div className="grid gap-3 md:grid-cols-2">{active.map((job) => <JobCard key={job.id} job={job} />)}</div>
        ) : (
          <EmptyState title="No active jobs"><Link href="/jobs" className="underline">Check the job board</Link>.</EmptyState>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">Pay</h2>
        {payouts.length ? (
          <div className="card divide-y divide-black/5">
            {payouts.map((p) => (
              <Link key={p.id} href={`/jobs/${p.job.id}`} className="flex flex-wrap items-center gap-3 p-4 hover:bg-black/[0.02]">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.job.title}</p>
                  <p className="text-xs text-muted">{jobRef(p.job.jobNumber)} · {p.hours} hrs · {timeAgo(p.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatNZD(p.grossCents + p.holidayPayCents)}</p>
                  <StatusChip status={p.status} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No pay yet">Finish a job and upload the CoC - it shows here.</EmptyState>
        )}
        <p className="mt-2 text-xs text-muted">Amounts are gross incl. holiday pay. PAYE is deducted through payroll.</p>
      </section>
    </>
  );
}
