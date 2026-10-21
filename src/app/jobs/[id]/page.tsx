import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { jobRates, priceWork } from "@/lib/pricing";
import { releaseOverdue } from "@/lib/jobs";
import { formatNZD, jobRef, timeAgo } from "@/lib/constants";
import { confirmCompletion, requestCancel } from "@/app/actions/jobs";
import { claimJob, requestVariation, submitCoc, submitEstimate } from "@/app/actions/tradie";
import { declineVariation } from "@/app/actions/payments";
import { adminSignOff, priceJob, priceVariation, resolveCancellation } from "@/app/actions/admin";
import { sendMessage } from "@/app/actions/messages";
import { leaveReview } from "@/app/actions/reviews";
import { Avatar, CategoryChip, FormMessage, LicenceBadge, Money, StatusChip, Stars } from "@/components/ui";
import {
  CancelForm, ClaimForm, CocForm, EstimateForm, MessageForm, PriceForm, ResolveCancelForm, ReviewForm, VariationForm,
} from "./forms";

export const dynamic = "force-dynamic";

export default async function JobPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const { id } = await params;
  const { paid } = await searchParams;
  const user = await requireUser(`/jobs/${id}`);
  await releaseOverdue();
  const [settings, job] = await Promise.all([
    getSettings(),
    db.job.findUnique({
      where: { id },
      include: {
        photos: { where: { variationId: null } },
        customer: { select: { id: true, name: true, phone: true, email: true } },
        tradie: {
          select: {
            id: true, name: true, avatarUrl: true, phone: true, registrationNo: true, licenceVerified: true,
            reviewsReceived: { select: { rating: true } },
          },
        },
        estimates: { orderBy: { createdAt: "asc" }, include: { tradie: { select: { name: true } } } },
        variations: { orderBy: { createdAt: "asc" }, include: { photos: true, payments: { where: { status: "PENDING" } } } },
        payments: { where: { kind: "JOB" } },
        messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, name: true, role: true } } } },
        coc: true,
        payout: true,
        review: true,
      },
    }),
  ]);
  if (!job) notFound();

  const isOwner = user.id === job.customerId;
  const isAdmin = user.role === "ADMIN";
  const isAssigned = user.id === job.tradieId;
  const isOtherTradie = user.role === "TRADIE" && !isAssigned;
  // Other tradies only see jobs that are open for estimates or claiming.
  if (isOtherTradie && job.status !== "REVIEW" && job.status !== "BOOKABLE") notFound();
  if (user.role === "CUSTOMER" && !isOwner) notFound();

  const rates = jobRates(job, settings);
  const approved = job.variations.filter((v) => v.status === "APPROVED");
  const scopeHours = (job.hours ?? 0) + approved.reduce((s, v) => s + (v.hours ?? 0), 0);
  const scopeMaterials = (job.materialsCents ?? 0) + approved.reduce((s, v) => s + (v.materialsCents ?? 0), 0);
  const earn = priceWork(scopeHours, 0, rates, { applyMinimum: false });
  const jobPrice = job.hours != null ? priceWork(job.hours, job.materialsCents ?? 0, rates) : null;
  const breakdownMatchesSavedPrice = jobPrice !== null && job.priceCents !== null && jobPrice.totalCents === job.priceCents;
  const pendingJobPayment = job.payments.find((p) => p.status === "PENDING");
  const isPaid = job.payments.some((p) => p.status === "PAID");
  const isRefunded = job.payments.some((p) => p.status === "REFUNDED");
  const autoReleaseAt = job.coc ? new Date(job.coc.uploadedAt.getTime() + settings.autoReleaseHours * 3_600_000) : null;
  const canSeeAddress = isOwner || isAdmin || isAssigned;
  const inThread = isOwner || isAdmin || isAssigned;
  const myEstimate = job.estimates.find((e) => e.tradieId === user.id);
  const openVariation = job.variations.some((v) => v.status === "REQUESTED" || v.status === "PRICED");
  const audience = isOwner ? "customer" : "staff";

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-6">
        <Link href={isAdmin ? "/admin" : user.role === "TRADIE" ? "/jobs" : "/dashboard"} className="text-sm text-muted hover:underline">← Back</Link>
        {paid && <FormMessage state={{ ok: "Test payment recorded. No money was charged." }} />}

        <article className="card overflow-hidden">
          <PhotoGallery photos={job.photos} label="Job" />
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryChip name={job.category} />
              <StatusChip status={job.status} audience={audience} />
              <span className="ml-auto text-xs text-muted">{jobRef(job.jobNumber)} · posted {timeAgo(job.createdAt)}</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold">{job.title}</h1>
            <p className="mt-2 text-sm text-muted">📍 {canSeeAddress ? `${job.address}, ` : ""}{job.suburb}, {job.region}</p>
            <p className="mt-5 whitespace-pre-wrap break-words leading-relaxed">{job.description}</p>
          </div>
        </article>

        {/* Customer: the price */}
        {isOwner && job.priceCents !== null && job.status !== "REVIEW" && (
          <section className="card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold">Your fixed price</h2>
              <p className="text-3xl font-bold text-leaf-dark"><Money cents={job.priceCents} /></p>
            </div>
            {breakdownMatchesSavedPrice && jobPrice ? <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Labour ({jobPrice.hours} hrs, licensed electrician)</span><Money cents={jobPrice.exGstCents - materialsShown(jobPrice.materialsCents, rates.marginPct)} /></div>
              <div className="flex justify-between"><span>Materials</span><Money cents={materialsShown(jobPrice.materialsCents, rates.marginPct)} /></div>
              <div className="flex justify-between text-muted"><span>GST</span><Money cents={jobPrice.gstCents} /></div>
            </div>
            : <p className="mt-3 text-sm text-muted">The saved fixed price above is authoritative. An accurate itemised breakdown is unavailable because the current pricing calculation differs from the saved quote. Ask Trade Marketplace for clarification before proceeding.</p>}
            {job.pricingNote && <p className="mt-3 rounded-lg bg-paper p-3 text-sm">{job.pricingNote}</p>}
            {job.status === "PRICED" && pendingJobPayment && (
              <Link href={`/pay/${pendingJobPayment.id}`} className="btn-primary mt-5 w-full py-3 text-base">
                Review {formatNZD(pendingJobPayment.amountCents)} test payment
              </Link>
            )}
            {isPaid && <p className="mt-4 text-sm text-leaf-dark">Demo payment recorded {job.paidAt ? timeAgo(job.paidAt) : ""} · no money moved</p>}
            {isRefunded && <p className="mt-4 text-sm text-muted">Demo refund recorded · no money moved.</p>}
            <p className="mt-3 text-xs text-muted">
              Includes your Certificate of Compliance. If the electrician finds extra work, you&apos;ll get photos and a price to approve before anything extra is done.
            </p>
          </section>
        )}

        {/* Variations */}
        {job.variations.length > 0 && (isOwner || isAdmin || isAssigned) && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Variations</h2>
            {job.variations.map((v) => {
              const pay = v.payments[0];
              return (
                <div key={v.id} className="card p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip status={v.status} />
                    <span className="text-xs text-muted">{timeAgo(v.createdAt)} · {v.hoursRequested} extra hrs requested</span>
                    {v.priceCents != null && <span className="ml-auto font-bold"><Money cents={v.priceCents} /></span>}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm">{v.description}</p>
                  <PhotoGallery photos={v.photos} label="Variation" />
                  {isOwner && v.status === "PRICED" && pay && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/pay/${pay.id}`} className="btn-primary">Approve &amp; pay {formatNZD(pay.amountCents)}</Link>
                      <form action={declineVariation.bind(null, v.id)}><button className="btn-ghost">Decline</button></form>
                    </div>
                  )}
                  {isOwner && v.status === "PRICED" && (
                    <p className="mt-2 text-xs text-muted">If you decline, the original job is finished as quoted (or made safe) and the extra isn&apos;t done.</p>
                  )}
                  {isAdmin && (v.status === "REQUESTED" || v.status === "PRICED") && (
                    <div className="mt-4 border-t border-black/5 pt-4">
                      <PriceForm
                        action={priceVariation.bind(null, v.id)} rates={rates} applyMinimum={false}
                        initial={{ hours: v.hours ?? v.hoursRequested, materials: (v.materialsCents ?? 0) / 100 }}
                        submitLabel={v.status === "PRICED" ? "Re-price variation" : "Price variation & send to customer"}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* CoC */}
        {job.coc && (isOwner || isAdmin || isAssigned) && (
          <section className="card p-6">
            <h2 className="text-lg font-bold">Certificate of Compliance</h2>
            <p className="mt-1 text-sm">CoC no. <strong>{job.coc.cocNumber}</strong> · uploaded {timeAgo(job.coc.uploadedAt)}</p>
            <a href={job.coc.fileUrl} target="_blank" rel="noreferrer" className="btn-ghost mt-3">View / download CoC</a>
            {isAdmin && (
              <p className={`mt-3 text-sm ${job.coc.materialsSpentCents > scopeMaterials ? "font-semibold text-red-700" : "text-muted"}`}>
                Materials spent {formatNZD(job.coc.materialsSpentCents)} vs budget {formatNZD(scopeMaterials)} (ex GST) - check against Telfer order {jobRef(job.jobNumber)}.
              </p>
            )}
            {job.status === "SUBMITTED" && autoReleaseAt && (
              <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Sign-off window: {settings.autoReleaseHours} hours after CoC upload</p>
                <p className="mt-2">Threshold: <time dateTime={autoReleaseAt.toISOString()}>{autoReleaseAt.toLocaleString("en-NZ", { timeZone: "Pacific/Auckland", dateStyle: "medium", timeStyle: "short" })}</time> (New Zealand time). After this threshold, the next dashboard or job-page load automatically marks the job complete and queues the electrician’s pay for payroll. It does not transfer money immediately.</p>
                <p className="mt-2">Sending a message does not pause this automatic sign-off.</p>
              </div>
            )}
            {isOwner && job.status === "SUBMITTED" && (
              <form action={confirmCompletion.bind(null, job.id)} className="mt-4">
                <p className="mb-3 text-sm text-muted">Happy the work&apos;s done? Confirming queues the electrician&apos;s pay for payroll.</p>
                <button className="btn-primary">Confirm job is complete</button>
              </form>
            )}
          </section>
        )}

        {/* Messages */}
        {inThread && (
          <section id="messages" className="card p-6">
            <h2 className="text-lg font-bold">Messages</h2>
            <p className="text-xs text-muted">
              {isOwner ? "Chat with Trade Marketplace" + (job.tradie ? ` and ${job.tradie.name.split(" ")[0]}` : "") : "Customer, electrician and Trade Marketplace"}
            </p>
            <div className="my-4 max-h-80 space-y-2 overflow-y-auto">
              {job.messages.length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
              {job.messages.map((m) => {
                const mine = m.senderId === user.id;
                const who = m.sender.role === "ADMIN" ? "Trade Marketplace" : m.sender.name.split(" ")[0];
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : ""}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-lime text-forest" : m.sender.role === "ADMIN" ? "bg-forest text-white" : "bg-black/5"}`}>
                      {!mine && <p className="text-xs font-semibold opacity-70">{who}</p>}
                      <p className="whitespace-pre-wrap break-words">{m.body}</p>
                      <p className="mt-0.5 text-xs opacity-60">{timeAgo(m.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {job.status !== "CANCELLED" && <MessageForm action={sendMessage.bind(null, job.id)} />}
          </section>
        )}
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        {/* ---------- Other tradies ---------- */}
        {isOtherTradie && job.status === "REVIEW" && (
          <div className="card p-5">
            <h2 className="font-bold">Help price this job</h2>
            <p className="mb-4 text-xs text-muted">Blind estimate - only Trade Marketplace sees it. How long on site, and what materials at cost?</p>
            {user.licenceVerified ? (
              <EstimateForm
                action={submitEstimate.bind(null, job.id)}
                existing={myEstimate && { hours: myEstimate.hours, materials: myEstimate.materialsCents / 100, note: myEstimate.note }}
              />
            ) : (
              <LicenceBadge verified={false} />
            )}
          </div>
        )}
        {isOtherTradie && job.status === "BOOKABLE" && (
          <div className="card p-5">
            <p className="text-xs text-muted">You earn (gross, before PAYE)</p>
            <p className="text-3xl font-bold text-leaf-dark"><Money cents={earn.tradieTotalCents} /></p>
            <p className="mt-1 text-sm text-muted">
              {earn.hours} hrs × {formatNZD(rates.tradieRateCents)} + {settings.holidayPayPct}% holiday pay
            </p>
            <ul className="my-4 space-y-1 text-sm">
              <li>✓ Customer has paid</li>
              <li>✓ Materials budget {formatNZD(scopeMaterials)} ex GST on our Telfer account</li>
              <li>✓ Extra work priced &amp; paid before you do it</li>
            </ul>
            {user.licenceVerified ? (
              <ClaimForm action={claimJob.bind(null, job.id)} earn={formatNZD(earn.tradieTotalCents)} />
            ) : (
              <LicenceBadge verified={false} />
            )}
          </div>
        )}

        {/* ---------- Assigned tradie ---------- */}
        {isAssigned && (
          <>
            <div className="card p-5">
              <h2 className="font-bold">Your job</h2>
              <p className="mt-2 text-3xl font-bold text-leaf-dark"><Money cents={earn.tradieTotalCents} /></p>
              <p className="text-xs text-muted">{scopeHours} hrs incl. approved variations · gross before PAYE</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div><dt className="text-xs text-muted">Telfer order no.</dt><dd className="font-mono text-base font-bold">{jobRef(job.jobNumber)}</dd></div>
                <div><dt className="text-xs text-muted">Materials budget (ex GST)</dt><dd className="font-semibold">{formatNZD(scopeMaterials)}</dd></div>
                <div><dt className="text-xs text-muted">Customer</dt><dd>{job.customer.name} · {job.customer.phone ?? job.customer.email}</dd></div>
                <div><dt className="text-xs text-muted">Address</dt><dd>{job.address}, {job.suburb}</dd></div>
              </dl>
              {job.payout && (
                <p className="mt-4 rounded-lg bg-leaf/10 p-3 text-sm text-leaf-dark">
                  {job.payout.status === "PAID" ? "✓ Paid" : "Payout queued for the next pay run"} - {formatNZD(job.payout.grossCents + job.payout.holidayPayCents)}
                </p>
              )}
            </div>
            {job.status === "ASSIGNED" && (
              <>
                <div className="card p-5">
                  <h2 className="font-bold">Found extra work?</h2>
                  <p className="mb-4 text-xs text-muted">Don&apos;t do it yet. Send photos - we price it and the customer pays before you carry on.</p>
                  <VariationForm action={requestVariation.bind(null, job.id)} />
                </div>
                <div className="card p-5">
                  <h2 className="font-bold">Finished?</h2>
                  <p className="mb-4 text-xs text-muted">Upload the CoC to get paid. The customer gets a copy.</p>
                  {openVariation ? (
                    <p className="text-sm text-muted">Waiting on the open variation first.</p>
                  ) : (
                    <CocForm action={submitCoc.bind(null, job.id)} />
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* ---------- Customer ---------- */}
        {isOwner && (
          <div className="card space-y-3 p-5">
            <h2 className="font-bold">Status</h2>
            <p className="text-sm">
              {{
                REVIEW: "Next: electricians provide private estimates, then Trade Marketplace reviews them and sets your fixed price.",
                PRICED: "Your fixed price is ready. Next: review the price and test payment. No electrician is assigned yet.",
                BOOKABLE: "Test payment recorded. Next: a verified electrician can claim your job. No appointment is scheduled yet.",
                ASSIGNED: "An electrician has claimed your job. Use messages to agree access and timing; no appointment is scheduled by the app.",
                SUBMITTED: "The work's done and the CoC is uploaded. Please confirm.",
                COMPLETED: "All done. Thanks for using Trade Marketplace!",
                CANCEL_REVIEW: "We're looking into your cancellation and will be in touch.",
                CANCELLED: "This job was cancelled.",
              }[job.status]}
            </p>
            {job.tradie && (
              <div className="flex items-center gap-3 border-t border-black/5 pt-3">
                <Avatar name={job.tradie.name} url={job.tradie.avatarUrl} />
                <div className="text-sm">
                  <Link href={`/tradies/${job.tradie.id}`} className="font-semibold hover:underline">{job.tradie.name}</Link>
                  <p className="text-xs text-muted">{job.tradie.phone ?? ""}</p>
                  <LicenceBadge verified={job.tradie.licenceVerified} />
                </div>
              </div>
            )}
            {["REVIEW", "PRICED", "BOOKABLE", "ASSIGNED"].includes(job.status) && (
              <CancelForm action={requestCancel.bind(null, job.id)} paid={isPaid} />
            )}
            {job.status === "COMPLETED" && job.tradie && !job.review && (
              <div className="border-t border-black/5 pt-3">
                <ReviewForm action={leaveReview.bind(null, job.id)} tradieName={job.tradie.name.split(" ")[0]} />
              </div>
            )}
            {job.review && <p className="text-sm">Your review: <Stars rating={job.review.rating} /></p>}
          </div>
        )}

        {/* ---------- Admin ---------- */}
        {isAdmin && (
          <>
            {(job.status === "REVIEW" || job.status === "PRICED") && (
              <div className="card p-5">
                <h2 className="font-bold">Estimates ({job.estimates.length})</h2>
                <div className="mt-2 divide-y divide-black/5 text-sm">
                  {job.estimates.map((e) => (
                    <div key={e.id} className="py-2">
                      <div className="flex justify-between"><span className="font-medium">{e.tradie.name}</span><span>{e.hours} h · {formatNZD(e.materialsCents)}</span></div>
                      {e.note && <p className="text-xs text-muted">{e.note}</p>}
                    </div>
                  ))}
                  {!job.estimates.length && <p className="py-2 text-muted">None yet.</p>}
                </div>
                {job.estimates.length > 0 && (
                  <p className="mt-2 text-xs text-muted">
                    Median: {median(job.estimates.map((e) => e.hours))} h · {formatNZD(median(job.estimates.map((e) => e.materialsCents)))}
                  </p>
                )}
                <div className="mt-4 border-t border-black/5 pt-4">
                  <h3 className="mb-3 font-semibold">{job.status === "PRICED" ? "Re-price" : "Set the price"}</h3>
                  <PriceForm
                    action={priceJob.bind(null, job.id)} rates={settings} applyMinimum
                    initial={job.hours != null ? { hours: job.hours, materials: (job.materialsCents ?? 0) / 100 } : undefined}
                    submitLabel={job.status === "PRICED" ? "Update price" : "Send price to customer"}
                  />
                </div>
              </div>
            )}
            {job.status === "CANCEL_REVIEW" && (
              <div className="card p-5">
                <h2 className="font-bold text-red-700">Cancellation investigation</h2>
                <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-paper p-3 text-sm">{job.cancelReason}</p>
                <p className="my-3 text-xs text-muted">{job.tradie ? `Assigned to ${job.tradie.name}. ` : "No tradie assigned yet. "}Check messages and talk to both sides before deciding.</p>
                <ResolveCancelForm action={resolveCancellation.bind(null, job.id)} />
              </div>
            )}
            {job.status === "SUBMITTED" && (
              <div className="card p-5">
                <h2 className="font-bold">Sign-off</h2>
                <p className="mt-1 text-sm text-muted">
                  Customer hasn&apos;t confirmed yet. Auto-release is {settings.autoReleaseHours} hrs after upload
                  {job.coc ? ` (${timeAgo(job.coc.uploadedAt)})` : ""}. Check the CoC first.
                </p>
                <form action={adminSignOff.bind(null, job.id)} className="mt-3"><button className="btn-primary w-full">CoC checked - release payout</button></form>
              </div>
            )}
            {job.tradie && (
              <div className="card p-5 text-sm">
                <h2 className="font-bold">Electrician</h2>
                <p className="mt-1">{job.tradie.name} · reg {job.tradie.registrationNo}</p>
                <p className="text-muted">Earns {formatNZD(earn.tradieTotalCents)} for {scopeHours} hrs</p>
                {job.payout && <p className="mt-1">Payout: <StatusChip status={job.payout.status} /></p>}
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
}

// Customer-facing split of the ex-GST price: materials carry their share of the margin.
function materialsShown(materialsCents: number, marginPct: number) {
  return materialsCents + Math.round((materialsCents * marginPct) / 100);
}

function median(xs: number[]) {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function PhotoGallery({ photos, label }: { photos: { id: string; url: string }[]; label: string }) {
  if (!photos.length) return null;
  return <section aria-label={`${label} photos`} className="p-4">
    <h3 className="mb-3 text-sm font-semibold">{label} photos · {photos.length}</h3>
    <div className="grid gap-3 sm:grid-cols-2">
      {photos.map((photo, index) => <details key={photo.id} className="min-w-0 rounded-xl border border-black/10 p-2 open:col-span-full">
        <summary className="cursor-pointer rounded-lg p-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2">
          Photo {index + 1} · expand or collapse
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt={`${label} photo ${index + 1} thumbnail`} className="mt-2 aspect-video w-full rounded-lg object-cover" />
        </summary>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.url} alt={`${label} photo ${index + 1} full view`} className="mt-3 max-h-[70vh] w-full object-contain" />
        <a href={photo.url} target="_blank" rel="noreferrer" className="btn-ghost mt-3">Open original photo {index + 1} (new tab)</a>
      </details>)}
    </div>
  </section>;
}
