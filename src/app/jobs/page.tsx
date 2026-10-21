import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { jobRates, priceWork } from "@/lib/pricing";
import { REGIONS, formatNZD } from "@/lib/constants";
import { JobDiscovery } from "@/components/discovery/JobDiscovery";
import { LicenceBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

// The tradie job board: jobs to estimate, and paid jobs to claim.
export default async function JobsPage({ searchParams }: { searchParams: Promise<{ region?: string }> }) {
  const user = await getCurrentUser();
  if (user?.role === "CUSTOMER") redirect("/dashboard");
  if (user?.role === "ADMIN") redirect("/admin");

  const sp = await searchParams;
  const region = sp.region === "" ? undefined : (REGIONS as readonly string[]).includes(sp.region ?? "") ? sp.region : user?.region;
  const include = { photos: { take: 1 } } as const;

  const [settings, bookable, review, myEstimates] = await Promise.all([
    getSettings(),
    db.job.findMany({ where: { status: "BOOKABLE" }, orderBy: { paidAt: "asc" }, include }),
    db.job.findMany({ where: { status: "REVIEW" }, orderBy: { createdAt: "asc" }, include }),
    user ? db.estimate.findMany({ where: { tradieId: user.id }, select: { jobId: true } }) : [],
  ]);
  const estimated = new Set(myEstimates.map((e) => e.jobId));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Find your next job</h1>
          <p className="text-sm text-muted">Browse open electrical work and choose your next step.</p>
        </div>

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

      <p className="mt-6 text-sm text-muted">Private estimates help Trade Marketplace set the fixed price. Estimating does not reserve work. Jobs with a recorded customer payment are available for verified electricians to claim.</p>
      <JobDiscovery defaultRegion={region ?? ""} storageScope={user?.id ?? "guest"} jobs={[...bookable, ...review].map((job) => ({
        id: job.id, jobNumber: job.jobNumber, title: job.title, description: job.description,
        region: job.region, suburb: job.suburb, status: job.status, cover: job.photos[0]?.url,
        detail: job.status === "BOOKABLE" ? `Gross pay ${formatNZD(priceWork(job.hours ?? 0, 0, jobRates(job, settings), { applyMinimum: false }).tradieTotalCents)} · ${job.hours ?? 0} hrs` : estimated.has(job.id) ? "Your private estimate is submitted" : "Provide a private estimate",
      }))} />
    </div>
  );
}
