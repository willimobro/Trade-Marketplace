import { db } from "@/lib/db";
import { AppHome } from "./AppHome";
import { redirect } from "next/navigation";

export async function SignedInHome({ user }: { user: { id: string; name: string; role: string; region: string } }) {
  if (user.role === "ADMIN") redirect("/admin");
  const [activeJobs, payouts] = user.role === "TRADIE" ? await Promise.all([
    db.job.findMany({ where: { tradieId: user.id, status: { in: ["ASSIGNED", "SUBMITTED", "CANCEL_REVIEW"] } }, orderBy: { assignedAt: "desc" }, select: { id: true, title: true, status: true, photos: { where: { variationId: null }, take: 1, select: { url: true } } } }),
    db.payout.findMany({ where: { tradieId: user.id, status: "PENDING" }, select: { grossCents: true, holidayPayCents: true } }),
  ]) : [[], []];
  return <AppHome user={user} activeJobs={activeJobs.map(job => ({ id: job.id, title: job.title, status: job.status, cover: job.photos[0]?.url ?? null }))} pendingPayCents={payouts.reduce((sum, payout) => sum + payout.grossCents + payout.holidayPayCents, 0)} />;
}
