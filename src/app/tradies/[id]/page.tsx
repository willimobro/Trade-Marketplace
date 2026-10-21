import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { timeAgo } from "@/lib/constants";
import { Avatar, EmptyState, LicenceBadge, Stars } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function TradiePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tradie = await db.user.findUnique({
    where: { id },
    select: {
      name: true, role: true, trade: true, region: true, bio: true, avatarUrl: true, licenceVerified: true, createdAt: true,
      reviewsReceived: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } }, job: { select: { title: true } } },
      },
      _count: { select: { jobsAssigned: { where: { status: "COMPLETED" } } } },
    },
  });
  if (!tradie || tradie.role !== "TRADIE") notFound();

  const reviews = tradie.reviewsReceived;
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/dashboard" className="mb-5 inline-flex min-h-12 items-center text-sm text-muted hover:underline">← Back to your workspace</Link>
      <div className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={tradie.name} url={tradie.avatarUrl} size={80} />
          <div>
            <h1 className="text-2xl font-bold">{tradie.name}</h1>
            <p className="text-sm text-muted">{tradie.trade} · {tradie.region} · joined {timeAgo(tradie.createdAt)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <LicenceBadge verified={tradie.licenceVerified} />
              {avg !== null && <span><Stars rating={avg} /> {avg.toFixed(1)} ({reviews.length})</span>}
              <span className="text-muted">{tradie._count.jobsAssigned} job{tradie._count.jobsAssigned === 1 ? "" : "s"} completed</span>
            </div>
          </div>
        </div>
        {tradie.bio && <p className="mt-5 whitespace-pre-wrap break-words leading-relaxed">{tradie.bio}</p>}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold">Reviews</h2>
      {reviews.length ? (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Stars rating={r.rating} />
                <span className="text-sm font-medium">{r.author.name.split(" ")[0]}</span>
                <span className="ml-auto text-xs text-muted">{timeAgo(r.createdAt)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{r.job.title}</p>
              <p className="mt-2 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No reviews yet">Customer reviews appear after completed jobs. This profile has no reviews to show yet.</EmptyState>
      )}
    </div>
  );
}
