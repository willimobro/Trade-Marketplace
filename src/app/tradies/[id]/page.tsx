import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { timeAgo } from "@/lib/constants";
import { Avatar, EmptyState, LicenceBadge, Stars } from "@/components/ui";
import styles from "./tradie.module.css";

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
  const joined = tradie.createdAt.toLocaleDateString("en-NZ", { month: "long", year: "numeric" });

  return (
    <div className={`${styles.screen} mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10`}>
      <Link href="/dashboard" className="mb-5 inline-flex min-h-12 items-center text-sm text-muted hover:underline">← Back to your workspace</Link>
      <div className="card p-6 sm:p-8">
        <p className="eyebrow mb-5">Public tradie profile</p>
        <div className="flex flex-wrap items-start gap-4">
          <Avatar name={tradie.name} url={tradie.avatarUrl} size={80} />
          <div className="min-w-0 flex-1 basis-48">
            <h1 className={styles.name}>{tradie.name}</h1>
            <p className="mt-2 text-sm text-muted">{tradie.trade ?? "Trade not set"} · {tradie.region}</p>
            <p className="mt-1 text-sm text-muted">Joined {joined}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <LicenceBadge verified={tradie.licenceVerified} trade={tradie.trade} />
            </div>
          </div>
        </div>
        <dl className={styles.stats}>
          <div><dt>Jobs completed</dt><dd>{tradie._count.jobsAssigned}</dd></div>
          <div><dt>Customer reviews</dt><dd>{reviews.length}</dd></div>
          <div><dt>Average rating</dt><dd>{avg === null ? <span className={styles.noRating}>No ratings yet</span> : <><span>{avg.toFixed(1)} <span className={styles.ratingScale}>/ 5</span></span><Stars rating={avg} className={styles.ratingStars} /></>}</dd></div>
        </dl>
        <section className={styles.about} aria-labelledby="about-tradie"><h2 id="about-tradie" className="text-lg font-bold">About {tradie.name.split(/\s+/)[0]}</h2>
          {tradie.bio?.trim() ? <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed">{tradie.bio}</p> : <p className="mt-3 text-sm text-muted">This tradie hasn’t added a bio yet.</p>}
        </section>
        {tradie.trade !== "Electrical" && <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Verification requirements for this trade are pending. This profile does not confirm trade qualifications.</p>}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold">Customer reviews {reviews.length > 0 && <span className="font-normal text-muted">({reviews.length})</span>}</h2>
      {reviews.length ? (
        <div className="space-y-3">
          {reviews.map((r) => (
            <article key={r.id} aria-label={`Review by ${r.author.name.split(/\s+/)[0]}`} className="card min-w-0 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Stars rating={r.rating} />
                <span className="min-w-0 break-words text-sm font-medium">{r.author.name.split(/\s+/)[0]}</span>
                <time dateTime={r.createdAt.toISOString()} className="ml-auto text-xs text-muted">{timeAgo(r.createdAt)}</time>
              </div>
              <p className="mt-2 break-words text-xs text-muted">{r.job.title}</p>
              {r.comment.trim() && <p className="mt-3 whitespace-pre-wrap break-words text-sm">{r.comment}</p>}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No reviews yet">Customer reviews appear after completed jobs. This profile has no reviews to show yet.</EmptyState>
      )}
    </div>
  );
}
