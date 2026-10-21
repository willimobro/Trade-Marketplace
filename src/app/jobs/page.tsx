import { SourceIcon } from "@/components/SourceIcon";
import Link from "next/link";
import styles from "./jobs.module.css";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { jobRates, priceWork } from "@/lib/pricing";
import { CATEGORY_NAMES, REGIONS, formatNZD } from "@/lib/constants";
import { JobDiscovery } from "@/components/discovery/JobDiscovery";
import { tradeRequirementsPending } from "@/lib/trade-readiness";
import { LicenceBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

// The tradie job board: jobs to estimate, and paid jobs to claim.
export default async function JobsPage({ searchParams }: { searchParams: Promise<{ region?: string; q?: string; category?: string }> }) {
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
          <span>Work in the trades? Sign up to claim these jobs.</span>
          <Link href="/for-tradies" className={styles.button}>How it works</Link>
        </div>
      )}
      {user?.role === "TRADIE" && (!user.licenceVerified || user.trade !== "Electrical") && (
        <div className={styles.notice}>
          <LicenceBadge verified={user.licenceVerified} trade={user.trade} />
          <span>{user.trade === "Electrical" ? "You can browse while your electrical registration awaits review. Verification is required to estimate or claim electrical jobs." : "You can browse, but verification and completion requirements for your trade are not configured yet."}</span>
        </div>
      )}

      <JobDiscovery initialCategory={CATEGORY_NAMES.includes(sp.category as typeof CATEGORY_NAMES[number]) ? sp.category : ""} initialQuery={typeof sp.q === "string" ? sp.q.slice(0, 200) : ""} defaultRegion={region ?? ""} storageScope={user?.id ?? "guest"} jobs={[...bookable, ...review].map((job) => ({
        id: job.id, jobNumber: job.jobNumber, title: job.title, description: job.description,
        category: job.category, region: job.region, suburb: job.suburb, status: job.status, cover: job.photos[0]?.url,
        detail: tradeRequirementsPending(job.category) ? "Trade requirements pending. Estimating and claiming unavailable." : job.status === "BOOKABLE" ? "Gross pay before PAYE" : estimated.has(job.id) ? "Your private estimate is submitted" : "Provide a private estimate",
        payAmount: job.status === "BOOKABLE" ? formatNZD(priceWork(job.hours ?? 0, 0, jobRates(job, settings), { applyMinimum: false }).tradieTotalCents) : undefined,
        hours: job.hours ?? 0,
      }))} />
      <details className={styles.pricingHelp}><summary>How job pricing works</summary><p>Private estimates help Trade Marketplace set the fixed price. Estimating does not reserve work. Claiming requires a recorded customer test payment, a matching trade and configured verification requirements.</p></details>
    </div>
  );
}
