import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatNZD, timeAgo } from "@/lib/constants";
import { acceptQuote, sendQuote } from "@/app/actions/quotes";
import { sendMessage } from "@/app/actions/messages";
import { setJobStatus } from "@/app/actions/jobs";
import { leaveReview } from "@/app/actions/reviews";
import { Avatar, CategoryChip, LicenceBadge, StatusChip, Stars } from "@/components/ui";
import { MessageForm, QuoteForm, ReviewForm } from "./forms";

export const dynamic = "force-dynamic";

const tradieSelect = {
  id: true, name: true, avatarUrl: true, trade: true, region: true, phone: true, email: true, licenceVerified: true,
  reviewsReceived: { select: { rating: true } },
} as const;

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const job = await db.job.findUnique({
    where: { id },
    include: {
      photos: true,
      customer: { select: { id: true, name: true, avatarUrl: true, phone: true, email: true } },
      quotes: {
        orderBy: { createdAt: "asc" },
        include: {
          tradie: { select: tradieSelect },
          messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, name: true } } } },
        },
      },
      reviews: true,
    },
  });
  if (!job) notFound();

  const isOwner = user?.id === job.customerId;
  const myQuote = user ? job.quotes.find((q) => q.tradieId === user.id) : undefined;
  // Customers see every quote on their job; a tradie only ever sees their own.
  const visibleQuotes = isOwner ? job.quotes : myQuote ? [myQuote] : [];
  const accepted = job.quotes.find((q) => q.status === "ACCEPTED");
  const canQuote = user?.role === "TRADIE" && !myQuote && job.status === "OPEN";
  const needsReview = isOwner && job.status === "COMPLETED" && accepted && job.reviews.length === 0;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
      <div className="min-w-0 space-y-6">
        <Link href="/jobs" className="text-sm text-muted hover:underline">← All jobs</Link>

        <article className="card overflow-hidden">
          {job.photos.length > 0 && (
            <div className={`grid gap-1 bg-forest ${job.photos.length > 1 ? "grid-cols-2 sm:grid-cols-3" : ""}`}>
              {job.photos.map((p, i) => (
                <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className={i === 0 && job.photos.length > 2 ? "col-span-2 row-span-2" : ""}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={`Job photo ${i + 1}`} className="h-full max-h-96 w-full object-cover" />
                </a>
              ))}
            </div>
          )}
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryChip name={job.category} />
              <StatusChip status={job.status} />
              <span className="ml-auto text-xs text-muted">Posted {timeAgo(job.createdAt)}</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold">{job.title}</h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              <span>📍 {job.suburb}, {job.region}</span>
              {job.budget && <span>💰 Budget {job.budget}</span>}
              <span>{job.quotes.length} quote{job.quotes.length === 1 ? "" : "s"}</span>
            </div>
            <p className="mt-5 whitespace-pre-wrap leading-relaxed">{job.description}</p>
            <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-4">
              <Avatar name={job.customer.name} url={job.customer.avatarUrl} size={36} />
              <div className="text-sm">
                <p className="font-medium">{job.customer.name.split(" ")[0]}</p>
                <p className="text-xs text-muted">Job poster</p>
              </div>
            </div>
          </div>
        </article>

        {visibleQuotes.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold">{isOwner ? `Quotes (${visibleQuotes.length})` : "Your quote"}</h2>
            {visibleQuotes.map((q) => {
              const ratings = q.tradie.reviewsReceived.map((r) => r.rating);
              const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
              const isAccepted = q.status === "ACCEPTED";
              return (
                <div key={q.id} className={`card p-5 ${isAccepted ? "ring-2 ring-leaf" : ""}`}>
                  <div className="flex flex-wrap items-start gap-3">
                    <Link href={`/tradies/${q.tradie.id}`} className="flex items-center gap-3 hover:opacity-80">
                      <Avatar name={q.tradie.name} url={q.tradie.avatarUrl} />
                      <div>
                        <p className="font-semibold">{q.tradie.name}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                          <span>{q.tradie.trade} · {q.tradie.region}</span>
                          {avg !== null ? (
                            <span><Stars rating={avg} /> ({ratings.length})</span>
                          ) : (
                            <span>No reviews yet</span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="ml-auto text-right">
                      <p className="text-xl font-bold text-leaf-dark">{formatNZD(q.priceCents)}</p>
                      <StatusChip status={q.status} />
                    </div>
                  </div>
                  <div className="mt-2"><LicenceBadge verified={q.tradie.licenceVerified} /></div>
                  <p className="mt-3 whitespace-pre-wrap text-sm">{q.message}</p>

                  {isOwner && job.status === "OPEN" && (
                    <form action={acceptQuote.bind(null, q.id)} className="mt-4">
                      <button className="btn-primary">Accept this quote</button>
                      <span className="ml-3 text-xs text-muted">Other quotes will be declined.</span>
                    </form>
                  )}

                  {isAccepted && (
                    <div className="mt-4 rounded-xl bg-leaf/10 p-3 text-sm">
                      <p className="font-semibold text-leaf-dark">Contact details</p>
                      {isOwner ? (
                        <p className="mt-1">{q.tradie.name}: {q.tradie.phone ?? "no phone listed"} · {q.tradie.email}</p>
                      ) : (
                        <p className="mt-1">{job.customer.name}: {job.customer.phone ?? "no phone listed"} · {job.customer.email}</p>
                      )}
                    </div>
                  )}

                  <div className="mt-5 border-t border-black/5 pt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      Messages {isOwner ? `with ${q.tradie.name.split(" ")[0]}` : `with ${job.customer.name.split(" ")[0]}`}
                    </p>
                    <div className="mb-3 max-h-72 space-y-2 overflow-y-auto">
                      {q.messages.length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
                      {q.messages.map((m) => {
                        const mine = m.senderId === user?.id;
                        return (
                          <div key={m.id} className={`flex ${mine ? "justify-end" : ""}`}>
                            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-leaf text-white" : "bg-black/5"}`}>
                              <p className="whitespace-pre-wrap">{m.body}</p>
                              <p className={`mt-0.5 text-[10px] ${mine ? "text-white/70" : "text-muted"}`}>{timeAgo(m.createdAt)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {job.status !== "CLOSED" && <MessageForm action={sendMessage.bind(null, q.id)} />}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        {canQuote && (
          <div className="card p-5">
            <h2 className="font-bold">Quote this job</h2>
            <p className="mb-4 text-xs text-muted">Only the job poster sees your quote.</p>
            <QuoteForm action={sendQuote.bind(null, job.id)} />
          </div>
        )}

        {!user && job.status === "OPEN" && (
          <div className="card p-5">
            <p className="font-semibold">Are you a tradie?</p>
            <p className="mt-1 text-sm text-muted">Log in or sign up to quote on this job.</p>
            <div className="mt-4 flex gap-2">
              <Link href={`/login?next=/jobs/${job.id}`} className="btn-ghost">Log in</Link>
              <Link href={`/signup?role=TRADIE&next=/jobs/${job.id}`} className="btn-primary">Sign up as a tradie</Link>
            </div>
          </div>
        )}

        {user?.role === "TRADIE" && !myQuote && job.status !== "OPEN" && (
          <div className="card p-5 text-sm text-muted">This job is no longer taking quotes.</div>
        )}

        {isOwner && (
          <div className="card space-y-3 p-5">
            <h2 className="font-bold">Your job</h2>
            {job.status === "OPEN" && (
              <>
                <p className="text-sm text-muted">
                  {job.quotes.length ? "Compare the quotes and accept the one you like." : "Waiting for quotes - tradies nearby can see your job now."}
                </p>
                <form action={setJobStatus.bind(null, job.id, "CLOSED")}>
                  <button className="btn-ghost w-full">Close job (stop quotes)</button>
                </form>
              </>
            )}
            {job.status === "ASSIGNED" && (
              <form action={setJobStatus.bind(null, job.id, "COMPLETED")}>
                <p className="mb-3 text-sm text-muted">Once the work&apos;s done and you have your CoC, mark it complete.</p>
                <button className="btn-primary w-full">Mark as completed</button>
              </form>
            )}
            {needsReview && accepted && (
              <ReviewForm action={leaveReview.bind(null, job.id)} tradieName={accepted.tradie.name.split(" ")[0]} />
            )}
            {job.status === "COMPLETED" && job.reviews[0] && (
              <div className="text-sm">
                <p>Your review: <Stars rating={job.reviews[0].rating} /></p>
                <p className="mt-1 text-muted">&ldquo;{job.reviews[0].comment}&rdquo;</p>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
