import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { jobRates, priceWork } from "@/lib/pricing";
import { REGIONS, formatNZD } from "@/lib/constants";
import { JobCard } from "@/components/JobCard";
import { EmptyState, LicenceBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

// The tradie job board: jobs to estimate, and paid jobs to claim.
export default async function JobsPage({ searchParams }: { searchParams: Promise<{ region?: string }> }) {
  const user = await getCurrentUser();
  if (user?.role === "CUSTOMER") redirect("/dashboard");
  if (user?.role === "ADMIN") redirect("/admin");

  const sp = await searchParams;
  const region = (REGIONS as readonly string[]).includes(sp.region ?? "") ? sp.region : user?.region;
  const include = { photos: { take: 1 } } as const;

  const [settings, bookable, review, myEstimates] = await Promise.all([
    getSettings(),
    db.job.findMany({ where: { status: "BOOKABLE", region }, orderBy: { paidAt: "asc" }, include }),
    db.job.findMany({ where: { status: "REVIEW", region }, orderBy: { createdAt: "asc" }, include }),
    user ? db.estimate.findMany({ where: { tradieId: user.id }, select: { jobId: true } }) : [],
  ]);
  const estimated = new Set(myEstimates.map((e) => e.jobId));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Job board</h1>
          <p className="text-sm text-muted">{region ?? "All of NZ"}</p>
        </div>
        <form className="flex gap-2">
          <select className="input" name="region" defaultValue={region ?? ""} aria-label="Region">
            <option value="">All of NZ</option>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <button className="btn-ghost">Go</button>
        </form>
      </div>

      {!user && (
        <div className="card mt-6 flex flex-wrap items-center gap-3 p-4 text-sm">
          <span>Registered sparky? Sign up to claim these jobs.</span>
          <Link href="/for-tradies" className="btn-primary ml-auto">How it works</Link>
        </div>
      )}
      {user && !user.licenceVerified && (
        <div className="card mt-6 flex flex-wrap items-center gap-3 p-4 text-sm">
          <LicenceBadge verified={false} />
          <span>We&apos;re checking your registration. You can look around, but can&apos;t estimate or claim jobs until it&apos;s verified.</span>
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-bold">Ready to book <span className="text-sm font-normal text-muted">· paid, first in gets it</span></h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {bookable.map((job) => {
            const p = priceWork(job.hours ?? 0, 0, jobRates(job, settings), { applyMinimum: false });
            return (
              <JobCard
                key={job.id}
                job={job}
                audience="none"
                aside={<span className="chip bg-leaf text-white">You earn {formatNZD(p.tradieTotalCents)} · {p.hours} hrs</span>}
              />
            );
          })}
        </div>
        {!bookable.length && <EmptyState title="No paid jobs waiting right now">New ones show up here as soon as the customer pays.</EmptyState>}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold">Help price these <span className="text-sm font-normal text-muted">· blind estimates</span></h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {review.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              audience="none"
              aside={estimated.has(job.id) ? <span className="chip bg-leaf/15 text-leaf-dark">✓ Estimated</span> : <span className="chip bg-amber-400/20 text-amber-900">Needs estimate</span>}
            />
          ))}
        </div>
        {!review.length && <EmptyState title="Nothing to price right now" />}
      </section>
    </div>
  );
}
