import Link from "next/link";
import { nextAction } from "@/app/jobs/[id]/next-action";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { releaseOverdue } from "@/lib/jobs";
import { formatNZD, jobRef, timeAgo } from "@/lib/constants";
import { JobCard } from "@/components/JobCard";
import { EmptyState, LicenceBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const user = await requireUser("/dashboard");
  if (user.role === "ADMIN") redirect("/admin");
  await releaseOverdue();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">{user.role === "CUSTOMER" ? "Customer workspace" : "Electrician workspace"}</p>
          <h1 className="text-[32px] font-semibold leading-[40px] lg:text-[40px] lg:leading-[48px]">{user.role === "CUSTOMER" ? "Your jobs, moving forward." : `Kia ora, ${user.name.split(" ")[0]}`}</h1>
          <p className="text-sm text-muted">{user.role === "TRADIE" ? `${user.trade} · ${user.region}` : user.region}</p>
        </div>
        {user.role === "CUSTOMER" ? (
          <Link href="/jobs/new" className="btn-primary">+ Post a job</Link>
        ) : (
          <div className="flex items-center gap-3">
            <LicenceBadge verified={user.licenceVerified} />
            <Link href="/jobs" className="btn-primary">Job board</Link>
          </div>
        )}
      </div>
      {user.role === "CUSTOMER" ? <CustomerDash userId={user.id} filter={status} /> : <TradieDash userId={user.id} />}
    </div>
  );
}

async function CustomerDash({ userId, filter }: { userId: string; filter?: string }) {
  const jobs = await db.job.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: "desc" },
    include: { photos: { take: 1, where: { variationId: null } } },
  });
  const filters = [
    ["all", "All jobs"], ["action", "Needs your action"], ["active", "In progress"],
    ["COMPLETED", "Completed"], ["CANCELLED", "Cancelled"],
  ];
  const selected = filters.some(([value]) => value === filter) ? filter! : "all";
  const visible = jobs.filter((job) => selected === "all" ||
    (selected === "action" ? ["PRICED", "SUBMITTED"].includes(job.status) :
      selected === "active" ? !["COMPLETED", "CANCELLED"].includes(job.status) : job.status === selected));
  const attention = jobs.find((job) => ["PRICED", "SUBMITTED"].includes(job.status));
  return (
    <section className="mt-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-forest p-6 text-white sm:p-8">
        <div className="max-w-xl">
          <p className="text-sm text-white/80">{attention ? "Your next action" : "A clear path from job to sign-off"}</p>
          <h2 className="mt-2 text-2xl font-semibold">{attention ? attention.title : "What needs doing?"}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/90">{attention ? nextAction(attention.status, "customer") : "Post your electrical job with photos. Private electrician estimates help Trade Marketplace set your fixed price."}</p>
        </div>
        <Link href={attention ? `/jobs/${attention.id}` : "/jobs/new"} className="btn bg-lime text-forest hover:bg-lime/90">{attention ? "Review job" : "Post a job"}</Link>
      </div>
      <h2 className="mb-3 text-lg font-bold">Your jobs</h2>
      <p className="mb-5 text-sm text-muted">Follow each job from private estimates to your fixed price, assignment and sign-off. Open a job to see your next step.</p>
      <form className="mb-6 flex flex-wrap items-end gap-3">
        <div><label htmlFor="job-status-filter" className="label">Show jobs</label>
          <select id="job-status-filter" name="status" className="input" defaultValue={selected}>
            {filters.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <button className="btn-ghost">Apply filter</button>
        <p className="py-3 text-sm text-muted">{visible.length} of {jobs.length} jobs</p>
      </form>
      {visible.length ? (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((job) => (
            <div key={job.id} className="min-w-0 space-y-3">
              <JobCard job={job} audience="customer" aside={job.priceCents != null && <span className="font-semibold text-ink">{formatNZD(job.priceCents)}</span>} />
              <p className="px-2 text-sm text-muted">{nextAction(job.status, "customer")}</p>
              <Link href={`/receipts/${job.id}`} className="inline-flex min-h-11 items-center px-2 text-sm underline">Payment record</Link>
            </div>
          ))}
        </div>
      ) : jobs.length ? <EmptyState title="No jobs match this filter"><Link href="/dashboard" className="underline">Show all jobs</Link> to see your other job stages.</EmptyState> : (
        <EmptyState title="No jobs yet">
          <Link href="/jobs/new" className="underline">Get a fixed price</Link> - free, no obligation.
        </EmptyState>
      )}
    </section>
  );
}

async function TradieDash({ userId }: { userId: string }) {
  const [active, payouts, estimates, history] = await Promise.all([
    db.job.findMany({
      where: { tradieId: userId, status: { in: ["ASSIGNED", "SUBMITTED", "CANCEL_REVIEW"] } },
      orderBy: { assignedAt: "desc" },
      include: { photos: { take: 1, where: { variationId: null } } },
    }),
    db.payout.findMany({ where: { tradieId: userId }, orderBy: { createdAt: "desc" }, include: { job: { select: { id: true, title: true, jobNumber: true } } } }),
    db.estimate.count({ where: { tradieId: userId } }),
    db.job.findMany({ where: { tradieId: userId, status: { in: ["COMPLETED", "CANCELLED"] } }, orderBy: { createdAt: "desc" }, include: { photos: { take: 1, where: { variationId: null } } } }),
  ]);
  const sum = (status: string) => payouts.filter((p) => p.status === status).reduce((s, p) => s + p.grossCents + p.holidayPayCents, 0);

  return (
    <>
      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Active jobs", active.length.toString()],
          ["Estimates sent", estimates.toString()],
          ["Queued for manual payroll", formatNZD(sum("PENDING"))],
          ["Marked paid by admin", formatNZD(sum("PAID"))],
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
        <h2 className="mb-3 text-lg font-bold">Manual payroll records</h2>
        <p className="mb-4 text-sm text-muted">Trade Marketplace processes payroll separately. These statuses are stored records, not bank-transfer confirmations.</p>
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
                  <span className="text-sm text-muted">{p.status === "PAID" ? "Marked paid by administrator" : "Queued for manual payroll"}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No pay yet">After you upload the CoC and the job is signed off, queued pay appears here.</EmptyState>
        )}
        <p className="mt-2 text-xs text-muted">Amounts are gross including holiday pay, before deductions. PAYE and payment processing are handled outside this app through manual payroll.</p>
      </section>
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">Your job history</h2>
        {history.length ? <div className="grid gap-6 md:grid-cols-2">{history.map((job) => <div key={job.id} className="space-y-3"><JobCard job={job} /><p className="px-2 text-sm text-muted">{nextAction(job.status, "assigned")}</p></div>)}</div>
          : <EmptyState title="No completed or cancelled jobs yet">Your assigned jobs appear here when they are completed or cancelled.</EmptyState>}
      </section>
    </>
  );
}
