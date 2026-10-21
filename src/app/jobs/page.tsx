import { SourceIcon } from "@/components/SourceIcon";
import Link from "next/link";
import styles from "./jobs.module.css";
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
export default async function JobsPage({ searchParams }: { searchParams: Promise<{ region?: string; q?: string }> }) {
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
    <div className={styles.screen}>
      <header className={styles.header}>
        <Link href="/" className={styles.back} aria-label="Back to browse"><SourceIcon name="back" size={26} /></Link>
        <h1>All Jobs</h1>
        {!user && <Link href="/jobs/new" className={styles.post} aria-label="Post a job"><SourceIcon name="plus-square" size={26} /></Link>}
      </header>

      {!user && (
        <div className={styles.notice}>
          <span>Registered sparky? Sign up to claim these jobs.</span>
          <Link href="/for-tradies" className={styles.button}>How it works</Link>
        </div>
      )}
      {user && !user.licenceVerified && (
        <div className={styles.notice}>
          <LicenceBadge verified={false} />
          <span>We&apos;re checking your registration. You can look around, but can&apos;t estimate or claim jobs until it&apos;s verified.</span>
        </div>
      )}

      <p className={styles.intro}>Private estimates help Trade Marketplace set the fixed price. Estimating does not reserve work. Jobs with a recorded customer payment are available for verified electricians to claim.</p>
      <JobDiscovery initialQuery={typeof sp.q === "string" ? sp.q.slice(0, 200) : ""} defaultRegion={region ?? ""} storageScope={user?.id ?? "guest"} jobs={[...bookable, ...review].map((job) => ({
        id: job.id, jobNumber: job.jobNumber, title: job.title, description: job.description,
        region: job.region, suburb: job.suburb, status: job.status, cover: job.photos[0]?.url,
        detail: job.status === "BOOKABLE" ? "Gross pay before PAYE" : estimated.has(job.id) ? "Your private estimate is submitted" : "Provide a private estimate",
        payAmount: job.status === "BOOKABLE" ? formatNZD(priceWork(job.hours ?? 0, 0, jobRates(job, settings), { applyMinimum: false }).tradieTotalCents) : undefined,
        hours: job.hours ?? 0,
      }))} />
    </div>
  );
}
