import { Suspense } from "react";
import { HomeBrowse } from "@/components/HomeBrowse";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { jobRates, priceWork } from "@/lib/pricing";
import { formatNZD } from "@/lib/constants";
import { tradeRequirementsPending } from "@/lib/trade-readiness";

export const dynamic = "force-dynamic";
export default async function Home() {
  const [jobs, settings, user] = await Promise.all([
    db.job.findMany({
      where: { status: { in: ["BOOKABLE", "REVIEW"] } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, title: true, category: true, status: true, hours: true,
        tradieRateCents: true, onCostPct: true, marginPct: true, gstPct: true,
        photos: { where: { variationId: null }, take: 1, select: { url: true } },
      },
    }),
    getSettings(), getCurrentUser(),
  ]);
  const cards = jobs.map(job => ({
    id: job.id, title: job.title, cover: job.photos[0]?.url ?? null,
    payAmount: job.status === "BOOKABLE" && !tradeRequirementsPending(job.category)
      ? formatNZD(priceWork(job.hours ?? 0, 0, jobRates(job, settings), { applyMinimum: false }).tradieTotalCents)
      : null,
  }));
  return <Suspense fallback={<p role="status">Loading browse…</p>}><HomeBrowse jobs={cards} storageScope={user?.id ?? "guest"} /></Suspense>;
}
