import { MessageReadReceipt } from "@/app/messages/MessageReadReceipt";
import { ConversationSection } from "./ConversationSection";
import { getTradeActionBlocker, tradeRequirementsPending } from "@/lib/trade-readiness";
import { ClearPostedJobDraft } from "@/app/jobs/new/job-draft";
import { SourceIcon } from "@/components/SourceIcon";
import Link from "next/link";
import styles from "./detail.module.css";
import { PhotoGallery } from "@/components/PhotoGallery";
import { DocumentPanel } from "@/components/DocumentPanel";
import { ConfirmAction } from "@/app/admin/ConfirmAction";
import { nextAction } from "./next-action";
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
import { Avatar, CategoryChip, LicenceBadge, Money, StatusChip, Stars } from "@/components/ui";
import {
  CancelForm, ClaimForm, CocForm, EstimateForm, MessageForm, PriceForm, ResolveCancelForm, ReviewForm, VariationForm,
} from "./forms";

export const dynamic = "force-dynamic";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
            id: true, name: true, avatarUrl: true, phone: true, registrationNo: true, licenceVerified: true, trade: true,
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

  const tradeBlocker = getTradeActionBlocker(user, job.category);
  const pendingRequirements = tradeRequirementsPending(job.category);
  const isOwner = user.id === job.customerId;
  const isAdmin = user.role === "ADMIN";
  const isAssigned = user.id === job.tradieId;
  const isOtherTradie = user.role === "TRADIE" && !isAssigned;
  // Other tradies only see jobs that are open for estimates or claiming.
  if (isOtherTradie && job.status !== "REVIEW" && job.status !== "BOOKABLE") {
    return <section className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-semibold">This job is no longer available</h1>
      <p role="status" className="mt-4 text-muted">{job.tradieId ? "This job has been assigned to another tradie. Your account is not assigned to it." : "This job’s stage has changed and it is not currently open for estimates or claims."} Check the job board for current opportunities.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/jobs" className="btn-primary">Find available jobs</Link><Link href="/dashboard" className="btn-ghost">Your workspace</Link></div>
    </section>;
  }
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
    <div className={styles.screen}>
      {isOwner && <ClearPostedJobDraft userId={user.id} fields={{ category: job.category, title: job.title, description: job.description, region: job.region, suburb: job.suburb, address: job.address }} createdAt={job.createdAt.toISOString()} />}
      <div className={styles.main}>
        <article className={styles.job}>
          <div className={styles.backdrop}>
            <Link href={isAdmin ? "/admin" : user.role === "TRADIE" ? "/jobs" : "/dashboard"} className={styles.back}><span aria-hidden="true" className={styles.closeGlyph}><SourceIcon name="x" size={26} /></span><span className="sr-only">Back to jobs</span></Link>
          </div>
          {job.photos.length > 0 ? <div className={styles.hero}><PhotoGallery photos={job.photos} label="Job" /></div> : <div className={styles.noPhoto}><p>No job photos supplied</p></div>}
          <div className={styles.detailPanel}>
            <h1 className={styles.title}>{job.title}</h1>
            <p className={styles.posted}>{jobRef(job.jobNumber)} · posted {timeAgo(job.createdAt)}</p>
            <div className={styles.metadata}>
              <CategoryChip name={job.category} />
              <StatusChip status={job.status} audience={audience} />
            </div>
            {isOtherTradie && job.status === "REVIEW" && !tradeBlocker && <a href="#job-actions" className={styles.quoteLink}>Provide blind estimate <span aria-hidden="true">↗</span></a>}
            <h2 className={styles.detailsHeading}>Details</h2>
            <p className={styles.location}>{canSeeAddress ? `${job.address}, ` : ""}{job.suburb}, {job.region}</p>
            <p className={styles.description}>{job.description}</p>
          </div>
        </article>

        {/* Current workflow sections below adapt original typography; no equivalent admin flow exists in the source. */}
        <section aria-label="Next step" className="card border-l-4 border-l-forest p-5">
          <h2 className="font-semibold">What happens next</h2>
          <p className="mt-2 text-sm">{nextAction(job.status, isAdmin ? "admin" : isOwner ? "customer" : isAssigned ? "assigned" : "tradie", job.category)}</p>
          {(isOwner || isAdmin) && <Link href={`/receipts/${job.id}`} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline">View payment record</Link>}
          {isOwner && (job.status === "REVIEW" || job.status === "BOOKABLE") && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer py-3 font-semibold">Waiting for an update?</summary>
              <p className="mt-2 text-muted">{job.status === "REVIEW"
                ? "Tradies’ private estimates help Trade Marketplace set your fixed price. An estimate is not a customer quote or an appointment. No fixed price is ready to accept at this stage."
                : "Your job is available for a tradie to claim. A recorded test payment does not assign a tradie or schedule an appointment. Check this job’s status and payment record before attempting another payment."}</p>
              <p className="mt-3 text-muted">You can add relevant details or ask about the current stage in the job conversation. Messages are saved here; sending one does not change the job’s status.</p>
              <a href="#messages" className="mt-2 inline-flex min-h-11 items-center font-semibold underline">Open job conversation</a>
              <p><Link href="/support" className="inline-flex min-h-11 items-center underline">View help and support options</Link></p>
            </details>
          )}
        </section>

        {inThread && job.cancelReason && <section aria-label="Cancellation record" className="card p-5">
          <h2 className="font-semibold">Cancellation record</h2>
          <p className="mt-2 text-sm text-muted">Saved cancellation reason and any recorded investigation outcome. The current job status is shown separately.</p>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm">{job.cancelReason}</p>
        </section>}

        {/* Customer: the price */}
        {isOwner && job.priceCents !== null && job.status !== "REVIEW" && (
          <section className="card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold">Original job fixed price</h2>
              <p className="text-3xl font-bold text-leaf-dark"><Money cents={job.priceCents} /></p>
            </div>
            {breakdownMatchesSavedPrice && jobPrice ? <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Labour ({jobPrice.hours} hrs, licensed tradie)</span><Money cents={jobPrice.exGstCents - materialsShown(jobPrice.materialsCents, rates.marginPct)} /></div>
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
              {job.category === "Electrical" ? "Includes the electrical Certificate of Compliance. " : "Completion documents for this trade still need to be defined. "}If the tradie finds extra work, you&apos;ll get photos and a price to approve before anything extra is done.
            </p>
          </section>
        )}

        {pendingRequirements && <section className="card p-5" aria-label="Trade requirements"><h2 className="font-semibold">{job.category} requirements pending</h2><p className="mt-2 text-sm">You can post and review this job. Verification and completion requirements for this trade still need to be configured before estimates, claiming and completion are enabled. Use messages to ask Trade Marketplace about the next step.</p></section>}

        {/* Variations */}
        {job.variations.length > 0 && (isOwner || isAdmin || isAssigned) && (
          <section className={styles.variations}>
            <h2 className="text-lg font-bold">Variations</h2>
            {job.variations.map((v) => {
              const pay = v.payments[0];
              return (
                <div key={v.id} className={`card ${styles.variationCard}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip status={v.status} />
                    <span className="text-xs text-muted">{timeAgo(v.createdAt)} · {v.hoursRequested} extra hrs requested</span>
                    {v.priceCents != null && <span className="ml-auto font-bold"><Money cents={v.priceCents} /></span>}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm">{v.description}</p>
                  <PhotoGallery photos={v.photos} label="Variation" />
                  {isOwner && v.status === "PRICED" && pay && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/pay/${pay.id}`} className="btn-primary">Review {formatNZD(pay.amountCents)} test payment</Link>
                      <ConfirmAction action={declineVariation.bind(null, v.id)} label="Review decline" description={`Decline this extra work: ${v.description}? The extra work will not be approved. Review the scope before confirming.`} confirmLabel="Decline extra work" destructive />
                    </div>
                  )}
                  {isOwner && v.status === "PRICED" && (
                    <p className="mt-2 text-xs text-muted">Review the scope and test payment before approving extra work. If you decline, the original job is finished as quoted (or made safe) and the extra isn&apos;t done.</p>
                  )}
                  {isAdmin && (v.status === "REQUESTED" || v.status === "PRICED") && (
                    <div className={styles.variationPricing}>
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
            <DocumentPanel url={job.coc.fileUrl} />
            {isAdmin && (
              <p className={`mt-3 text-sm ${job.coc.materialsSpentCents > scopeMaterials ? "font-semibold text-red-700" : "text-muted"}`}>
                Materials spent {formatNZD(job.coc.materialsSpentCents)} vs budget {formatNZD(scopeMaterials)} (ex GST) - check against Telfer order {jobRef(job.jobNumber)}.
              </p>
            )}
            {job.status === "SUBMITTED" && !pendingRequirements && autoReleaseAt && (
              <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Sign-off window: {settings.autoReleaseHours} hours after CoC upload</p>
                <p className="mt-2">Threshold: <time dateTime={autoReleaseAt.toISOString()}>{autoReleaseAt.toLocaleString("en-NZ", { timeZone: "Pacific/Auckland", dateStyle: "medium", timeStyle: "short" })}</time> (New Zealand time). After this threshold, the next dashboard or job-page load automatically marks the job complete and queues the tradie’s pay for payroll. It does not transfer money immediately.</p>
                <p className="mt-2">Sending a message does not pause this automatic sign-off.</p>
              </div>
            )}
            {isOwner && job.status === "SUBMITTED" && !pendingRequirements && (
              <div className="mt-4"><ConfirmAction action={confirmCompletion.bind(null, job.id)} label="Review completion" description="Confirm that you have reviewed the completed work and CoC. Confirming marks the job complete and queues the tradie’s pay for manual payroll; it does not transfer money." confirmLabel="Confirm job is complete" /></div>
            )}
          </section>
        )}

        {/* Messages */}
        {inThread && (
          <ConversationSection>
            <MessageReadReceipt userId={user.id} jobId={job.id} latestMessageId={job.messages.at(-1)?.id ?? null} />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 id="conversation-heading" className="text-lg font-bold">Messages</h2>
              <p className="text-sm font-semibold text-forest">{job.priceCents !== null ? `Job price ${formatNZD(job.priceCents)}` : "Price pending"}</p>
            </div>
            <p className="text-xs text-muted">
              {isOwner ? "Chat with Trade Marketplace" + (job.tradie ? ` and ${job.tradie.name.split(" ")[0]}` : "") : "Customer, tradie and Trade Marketplace"}
            </p>
            <div className={styles.messageList}>
              {job.messages.length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
              {job.messages.map((m) => {
                const mine = m.senderId === user.id;
                const who = m.sender.role === "ADMIN" ? "Trade Marketplace" : m.sender.name.split(" ")[0];
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : ""}`}>
                    <div className={`${styles.messageBubble} text-sm ${mine ? "bg-lime text-forest" : m.sender.role === "ADMIN" ? "bg-forest text-white" : "bg-black/5"}`}>
                      {!mine && <p className="text-xs font-semibold">{who}</p>}
                      <p className="whitespace-pre-wrap break-words">{m.body}</p>
                      <p className="mt-0.5 text-xs">{timeAgo(m.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {job.status !== "CANCELLED" && <MessageForm action={sendMessage.bind(null, job.id)} />}
          </ConversationSection>
        )}
      </div>

      <aside id="job-actions" aria-label="Job actions" className={`${styles.actions} ${isOtherTradie && job.status === "REVIEW" ? styles.estimateActions : ""}`}>
        {/* ---------- Other tradies ---------- */}
        {isOtherTradie && job.status === "REVIEW" && (
          <div className="card p-5">
            <h2 className="font-bold">Help price this job</h2>
            <p className="mb-4 text-xs text-muted">Blind estimate - only Trade Marketplace sees it. How long on site, and what materials at cost?</p>
            {!tradeBlocker ? (
              <EstimateForm
                action={submitEstimate.bind(null, job.id)}
                existing={myEstimate && { hours: myEstimate.hours, materials: myEstimate.materialsCents / 100, note: myEstimate.note }}
              />
            ) : (
              <p role="status" className="text-sm text-muted">{tradeBlocker}</p>
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
              <li>✓ Customer test payment recorded</li>
              <li>✓ Materials budget {formatNZD(scopeMaterials)} ex GST on our Telfer account</li>
              <li>✓ Extra work needs a price and customer approval before you do it</li>
            </ul>
            {!tradeBlocker ? (
              <ClaimForm action={claimJob.bind(null, job.id)} earn={formatNZD(earn.tradieTotalCents)} />
            ) : (
              <p role="status" className="text-sm text-muted">{tradeBlocker}</p>
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
                  {job.payout.status === "PAID" ? "Marked paid by an administrator" : "Queued for manual payroll"} - <span className="trade-money">{formatNZD(job.payout.grossCents + job.payout.holidayPayCents)}</span>
                </p>
              )}
            </div>
            {job.status === "ASSIGNED" && (
              <>
                <div className="card p-5">
                  <h2 className="font-bold">Found extra work?</h2>
                  <p className="mb-4 text-xs text-muted">Don&apos;t do it yet. Send photos - we price it and the customer pays before you carry on.</p>
                  {tradeBlocker ? <p role="status" className="text-sm text-muted">{tradeBlocker} Use messages to discuss extra work with Trade Marketplace.</p> : <VariationForm action={requestVariation.bind(null, job.id)} />}
                </div>
                <div className="card p-5">
                  <h2 className="font-bold">Finished?</h2>
                  <p className="mb-4 text-xs text-muted">{pendingRequirements ? "Completion requirements for this trade are not configured yet. Contact Trade Marketplace in messages; an electrical CoC is not a substitute." : "Upload the electrical CoC for sign-off. After sign-off, pay is queued for manual payroll. The customer can view the CoC."}</p>
                  {pendingRequirements ? <Link href="#messages" className="underline">Discuss completion requirements</Link> : openVariation ? (
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
              {nextAction(job.status, "customer", job.category)}
            </p>
            {job.tradie && (
              <div className="flex items-center gap-3 border-t border-black/5 pt-3">
                <Avatar name={job.tradie.name} url={job.tradie.avatarUrl} />
                <div className="text-sm">
                  <Link href={`/tradies/${job.tradie.id}`} className="font-semibold hover:underline">{job.tradie.name}</Link>
                  <p className="text-xs text-muted">{job.tradie.phone ?? ""}</p>
                  <LicenceBadge verified={job.tradie.licenceVerified} trade={job.tradie.trade} />
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
                <div className={styles.variationPricing}>
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
            {job.status === "SUBMITTED" && !pendingRequirements && (
              <div className="card p-5">
                <h2 className="font-bold">Sign-off</h2>
                <p className="mt-1 text-sm text-muted">
                  Customer hasn&apos;t confirmed yet. Auto-release is {settings.autoReleaseHours} hrs after upload
                  {job.coc ? ` (${timeAgo(job.coc.uploadedAt)})` : ""}. Check the CoC first.
                </p>
                <div className="mt-3"><ConfirmAction action={adminSignOff.bind(null, job.id)} label="Review admin sign-off" description="Confirm you have checked the CoC and material costs. Sign-off marks the job complete and queues a manual payroll record without waiting for customer confirmation. It does not transfer money." confirmLabel="Sign off and queue payroll" /></div>
              </div>
            )}
            {job.tradie && (
              <div className="card p-5 text-sm">
                <h2 className="font-bold">Tradie</h2>
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
