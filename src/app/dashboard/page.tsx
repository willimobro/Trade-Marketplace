import { DashboardMobileNavigation } from "@/components/DashboardMobileNavigation";
import { headers } from "next/headers";
import { canUseHostedPreview } from "@/lib/hosted-preview";
import { allowsLocalDemo } from "@/app/demo/gate";
import { allowsQuoteDemo } from "@/lib/quote-demo-access";
import { TradieQuoteWorkspace } from "@/components/quote-feed/TradieQuoteWorkspace";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { nextAction } from "@/app/jobs/[id]/next-action";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { releaseOverdue } from "@/lib/jobs";
import { formatNZD, jobRef, timeAgo } from "@/lib/constants";
import { JobCard } from "@/components/JobCard";
import { EmptyState, LicenceBadge } from "@/components/ui";
import { SourceIcon } from "@/components/SourceIcon";
import { CustomerJobCard } from "./CustomerJobCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const user = await requireUser("/dashboard");
  if (user.role === "ADMIN") redirect("/admin");
  await releaseOverdue();
  const demoRuntime = await canUseHostedPreview() || allowsLocalDemo(process.env.TRADE_LOCAL_DEMO, (await headers()).get("host"));
  const quoteDemo = allowsQuoteDemo(demoRuntime, user);
  return (
    <div className={`${styles.page} ${user.role === "CUSTOMER" ? styles.customerPage : ""}`}>
      <header className={`${styles.header} ${user.role === "CUSTOMER" ? styles.customerHeader : quoteDemo ? styles.quoteHeader : ""}`}>
        <nav aria-label="Dashboard navigation" className={styles.nav}><Link href="/">Home</Link>{user.role === "TRADIE" && <Link href="/jobs">Browse</Link>}<Link href="/profile">Account</Link></nav>
        <div>
          {user.role === "TRADIE" && !quoteDemo && <p className={styles.eyebrow}>Tradie workspace</p>}
          <h1 className={styles.heading}>{user.role === "CUSTOMER" ? "Your jobs" : `Kia ora, ${user.name.split(" ")[0]}`}</h1>
          {user.role === "TRADIE" && <p className={styles.subtitle}>{user.trade} · {user.region}</p>}
        </div>
        {user.role === "CUSTOMER" ? (
          <Link href="/jobs/new" className={`${styles.primary} ${styles.actions}`}><SourceIcon name="plus-square" size={20} /> Post a job</Link>
        ) : !quoteDemo ? (
          <div className={styles.actions}>
            <LicenceBadge verified={user.licenceVerified} trade={user.trade} />
            <Link href="/jobs" className={styles.primary}>Job board</Link>
          </div>
        ) : null}
      </header>
      {user.role === "CUSTOMER" ? <CustomerDash userId={user.id} filter={status} /> : quoteDemo ? <>
        <TradieQuoteWorkspace key={user.id} userId={user.id} trade={user.trade} />
        <details className={styles.existingWorkspace}><summary>Existing job activity</summary><TradieDash userId={user.id} /></details>
      </> : <TradieDash userId={user.id} /> }
      <DashboardMobileNavigation customer={user.role === "CUSTOMER"} />
    </div>
  );
}

async function CustomerDash({ userId, filter }: { userId: string; filter?: string }) {
  const jobs = await db.job.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      photos: { take: 1, where: { variationId: null } },
      payments: { where: { kind: "JOB", status: "PENDING" }, select: { id: true, amountCents: true }, orderBy: { createdAt: "desc" } },
    },
  });
  const filters = [
    ["all", "All jobs"], ["action", "Needs your action"], ["active", "In progress"],
    ["COMPLETED", "Completed"], ["CANCELLED", "Cancelled"],
  ];
  const selected = filters.some(([value]) => value === filter) ? filter! : "all";
  const visible = jobs.filter((job) => selected === "all" ||
    (selected === "action" ? ["PRICED", "SUBMITTED"].includes(job.status) :
      selected === "active" ? !["COMPLETED", "CANCELLED"].includes(job.status) : job.status === selected));
  return (
    <section className={`${styles.section} ${styles.customerSection}`} aria-label="Your jobs">
      <form className={`${styles.filter} ${styles.customerFilter}`}>
        <div><label htmlFor="job-status-filter" className="label">Show jobs</label>
          <select id="job-status-filter" name="status" className="input" defaultValue={selected}>
            {filters.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <button className={styles.secondary}>Apply filter</button>
        <p className={styles.jobCount}>{visible.length} of {jobs.length} jobs</p>
      </form>
      {visible.length ? (
        <div className={styles.customerJobs}>
          {visible.map((job) => <CustomerJobCard key={job.id} job={job} pendingPaymentId={job.payments.find((payment) => payment.amountCents === job.priceCents)?.id} />)}
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
      <section className={styles.stats}>
        {[
          ["Active jobs", active.length.toString()],
          ["Estimates sent", estimates.toString()],
          ["Queued for manual payroll", formatNZD(sum("PENDING"))],
          ["Marked paid by admin", formatNZD(sum("PAID"))],
        ].map(([label, value]) => (
          <div key={label} className={styles.stat}>
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-1 text-xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your active jobs</h2>
        {active.length ? (
          <div className={styles.jobList}>{active.map((job) => <JobCard key={job.id} job={job} />)}</div>
        ) : (
          <EmptyState title="No active jobs"><Link href="/jobs" className="underline">Check the job board</Link>.</EmptyState>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Manual payroll records</h2>
        <p className={styles.copy}>Trade Marketplace processes payroll separately. These statuses are stored records, not bank-transfer confirmations.</p>
        {payouts.length ? (
          <div className={styles.payroll}>
            {payouts.map((p) => (
              <article key={p.id} className="p-4">
              <Link href={`/jobs/${p.job.id}`} className="flex flex-wrap items-center gap-3 hover:bg-black/[0.02]">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.job.title}</p>
                  <p className="text-xs text-muted">{jobRef(p.job.jobNumber)} · {p.hours} hrs · {timeAgo(p.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatNZD(p.grossCents + p.holidayPayCents)}</p>
                  <span className="text-sm text-muted">{p.status === "PAID" ? "Marked paid by administrator" : "Queued for manual payroll"}</span>
                </div>
              </Link>
              <details className="mt-3 text-sm">
                <summary className="min-h-11 cursor-pointer py-3 underline">View saved earnings breakdown</summary>
                <dl className="space-y-2">
                  <div className="flex justify-between gap-3"><dt>Saved hours</dt><dd>{p.hours}</dd></div>
                  <div className="flex justify-between gap-3"><dt>Saved hourly rate</dt><dd>{formatNZD(p.rateCents)}</dd></div>
                  <div className="flex justify-between gap-3"><dt>Gross earnings</dt><dd>{formatNZD(p.grossCents)}</dd></div>
                  <div className="flex justify-between gap-3"><dt>Holiday pay</dt><dd>{formatNZD(p.holidayPayCents)}</dd></div>
                  <div className="flex justify-between gap-3 font-bold"><dt>Total before deductions</dt><dd>{formatNZD(p.grossCents + p.holidayPayCents)}</dd></div>
                </dl>
                <p className="mt-3 text-muted">These are saved manual payroll amounts, not a payslip or bank-transfer confirmation. Deductions and net pay are not recorded here.</p>
              </details>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No pay yet">After the applicable completion checks and sign-off, queued pay appears here.</EmptyState>
        )}
        <p className="mt-2 text-xs text-muted">Amounts are gross including holiday pay, before deductions. PAYE and payment processing are handled outside this app through manual payroll.</p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your job history</h2>
        {history.length ? <div className={styles.jobList}>{history.map((job) => <div key={job.id} className="space-y-3"><JobCard job={job} /><p className={styles.next}>{nextAction(job.status, "assigned", job.category)}</p></div>)}</div>
          : <EmptyState title="No completed or cancelled jobs yet">Your assigned jobs appear here when they are completed or cancelled.</EmptyState>}
      </section>
    </>
  );
}
