import { demoDistanceKm } from "@/lib/demo-distances";
import { Suspense } from "react";
import { HomeBrowse } from "@/components/HomeBrowse";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { jobRates, priceWork } from "@/lib/pricing";
import { formatNZD } from "@/lib/constants";
import { tradeRequirementsPending } from "@/lib/trade-readiness";
import { CustomerLanding } from "@/components/landing/CustomerLanding";
import { WorkspaceHome } from "@/components/workspace-mode/WorkspaceHome";

export const dynamic = "force-dynamic";
export default async function Home({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const user = await getCurrentUser();
  const { view } = await searchParams;
  // Acquisition has its own first step; existing account/search browsing stays intact.
  if (!user && view !== "search") return <CustomerLanding />;
  const [jobs, settings] = await Promise.all([
    db.job.findMany({
      where: {
        status: { in: ["BOOKABLE", "REVIEW"] },
        // Match detail-page ownership without widening access to private jobs.
        ...(user?.role === "CUSTOMER" ? { customerId: user.id } : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, title: true, category: true, status: true, hours: true,
        tradieRateCents: true, onCostPct: true, marginPct: true, gstPct: true,
        photos: { where: { variationId: null }, take: 1, select: { url: true } },
      },
    }),
    getSettings(),
  ]);
  const cards = jobs.map(job => ({
    id: job.id, distanceKm: demoDistanceKm(job.id), title: job.title, cover: job.photos[0]?.url ?? null,
    payAmount: job.status === "BOOKABLE" && !tradeRequirementsPending(job.category)
      ? formatNZD(priceWork(job.hours ?? 0, 0, jobRates(job, settings), { applyMinimum: false }).tradieTotalCents)
      : null,
  }));
  return <WorkspaceHome search={view === "search"}><Suspense fallback={<p role="status">Loading browse…</p>}><HomeBrowse jobs={cards} storageScope={user?.id ?? "guest"} /></Suspense></WorkspaceHome>;
}
