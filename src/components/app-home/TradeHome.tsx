"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DashboardNavigationLink } from "@/components/DashboardNavigationLink";
import { JobCardFrame } from "@/components/job-cards/JobCardFrame";
import { SourceIcon } from "@/components/SourceIcon";
import cardStyles from "@/components/job-cards/job-card.module.css";
import { DEMO_JOBS, findDemoJob, formatDemoMoney } from "@/lib/quote-demo/jobs";
import { getPointsBalance, type QuoteDemoState } from "@/lib/quote-demo/model";
import { loadQuoteDemo, subscribeQuoteDemo } from "@/lib/quote-demo/storage";
import styles from "./trade-home.module.css";

export type TradeHomeProps = {
  userId: string;
  name: string;
  prototype: boolean;
  activeJobs: { id: string; title: string; cover: string | null; status: string }[];
  pendingPayCents: number;
};

function Arrow() {
  return <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

function jobStatus(status: string) {
  return ({ ASSIGNED: "In progress", SUBMITTED: "Awaiting checks", CANCEL_REVIEW: "Cancellation review" } as Record<string, string>)[status] ?? status.toLowerCase().replaceAll("_", " ");
}

export function TradeHome({ userId, name, prototype, activeJobs, pendingPayCents }: TradeHomeProps) {
  const [saved, setSaved] = useState<QuoteDemoState | null>(null);
  const [storageError, setStorageError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setSaved(null);
    setStorageError(false);
    if (!prototype) return;
    let active = true;
    async function read() {
      try {
        const next = await loadQuoteDemo(userId);
        if (active) {
          setSaved(current => !current || next.revision >= current.revision ? next : current);
          setStorageError(false);
        }
      } catch {
        if (active) setStorageError(true);
      }
    }
    void read();
    const unsubscribe = subscribeQuoteDemo(userId, () => void read());
    return () => { active = false; unsubscribe(); };
  }, [prototype, retry, userId]);

  // Never show another account's local state while the new read is pending.
  const state = prototype && saved?.userId === userId && !storageError ? saved : null;
  const claimedIds = new Set(state?.claims.map(claim => claim.jobId));
  // An accepted quote is not an assignment. Only claimed work belongs here.
  const demoCurrent = state ? DEMO_JOBS.filter(job => state.claims.some(claim => claim.jobId === job.id && !claim.completedAt)) : [];
  const available = state ? DEMO_JOBS.filter(job => job.stage === "available" && !claimedIds.has(job.id)) : [];
  const completedCount = state?.claims.filter(claim => !!claim.completedAt).length ?? 0;
  const currentCount = activeJobs.length + demoCurrent.length;
  const firstName = name.trim().split(/\s+/)[0];
  const quoteHref = prototype ? "/dashboard?quoteView=feed" : "/jobs";
  const currentHref = prototype ? "/dashboard?quoteView=claimed" : "/dashboard";

  return <section className={styles.home} data-mode="trade" data-testid="trade-home" aria-labelledby="trade-home-title">
    <header className={styles.hero}>
      <div className={styles.welcome}>
        {firstName && <p>Hi, {firstName}</p>}
        <h1 id="trade-home-title">Home</h1>
      </div>
      <DashboardNavigationLink className={`${styles.quoteEntry} trade-motion-action`} href={quoteHref} data-testid="trade-home-quote">
        <SourceIcon name="magnifier" size={29} navigation />
        <span><strong>Quote more jobs</strong></span>
        <Arrow />
      </DashboardNavigationLink>
    </header>

    <div className={styles.content}>
      <div className={`${styles.summary} ${!prototype ? styles.summaryPair : ""}`} aria-label="Workspace overview">
        <a className={styles.stat} href="#trade-current-jobs"><span>Current jobs</span><strong data-testid="trade-home-current-count">{prototype && !state ? "—" : currentCount}</strong></a>
        {prototype && <a className={`${styles.stat} ${styles.points}`} href="/dashboard?quoteView=feed"><span>Points</span><strong data-testid="trade-home-points">{state ? getPointsBalance(state) : "—"}</strong></a>}
        <div className={`${styles.stat} ${styles.pay}`}><span>Queued pay</span><strong className="trade-money" data-testid="trade-home-pending-pay">{formatDemoMoney(pendingPayCents)}</strong><small>Gross · manual payroll</small></div>
      </div>

      <section className={styles.section} aria-labelledby="trade-current-jobs">
        <div className={styles.sectionHeading}><h2 id="trade-current-jobs">Current jobs</h2>{(!activeJobs.length || demoCurrent.length > 0) && <a href={currentHref}>View all<Arrow /></a>}</div>
        <div className={styles.currentList} data-testid="trade-home-current-jobs">
          {activeJobs.map(job => <a className={`${styles.jobRow} trade-motion-card`} href={`/jobs/${job.id}`} key={`owned-${job.id}`}>
            <span className={styles.jobPhoto}>{job.cover ? <Image src={job.cover} width={60} height={60} unoptimized alt="" /> : <SourceIcon name="jobs" size={27} navigation />}</span>
            <span className={styles.jobText}><strong>{job.title}</strong><span>{jobStatus(job.status)}</span></span><Arrow />
          </a>)}
          {demoCurrent.map(job => {
            const quote = state?.quotes.find(item => item.jobId === job.id);
            const accepted = !!state?.acceptances.some(item => item.jobId === job.id);
            return <a className={`${styles.jobRow} trade-motion-card`} href={`/quote-jobs/${job.id}?quoteView=${accepted ? "quoted" : "claimed"}`} key={`preview-${job.id}`}>
              <span className={styles.jobPhoto}><Image src={job.image} width={60} height={60} unoptimized alt="" /></span>
              <span className={styles.jobText}><strong>{job.title}</strong><span>{accepted ? "Quote accepted" : "Claimed"}{quote && <> · <span className="trade-money">{formatDemoMoney(quote.amountCents)}</span></>}</span></span><Arrow />
            </a>;
          })}
          {!activeJobs.length && (!prototype || state) && !demoCurrent.length && <p className={styles.empty}>No current jobs. Find your next one below.</p>}
          {prototype && !state && !storageError && <p className={styles.loading} role="status">Loading your saved workspace…</p>}
        </div>
        {prototype && state && <nav className={styles.savedLinks} aria-label="Saved work">
          <a href="/dashboard?quoteView=quoted">Quoted jobs<span>{state.quotes.filter(quote => !!findDemoJob(quote.jobId)).length}</span><Arrow /></a>
          <a href="/dashboard?quoteView=claimed">Complete<span>{completedCount}</span><SourceIcon name="check" size={18} /></a>
        </nav>}
        {prototype && storageError && <div className={styles.error} role="status"><p>Your saved workspace is unavailable.</p><button type="button" onClick={() => setRetry(value => value + 1)}>Retry</button></div>}
      </section>

      <section className={styles.section} aria-labelledby="trade-available-work">
        <div className={styles.sectionHeading}><h2 id="trade-available-work">Available work</h2><DashboardNavigationLink href={prototype ? "/dashboard?quoteView=available" : "/jobs"}>View all<Arrow /></DashboardNavigationLink></div>
        {prototype ? state ? available.length ? <>
          <p className={styles.help}>Claim a job for 5 points.</p>
          <div className={styles.jobGrid} data-testid="trade-home-available-jobs">{available.slice(0, 3).map(job => <JobCardFrame key={job.id} title={job.title} href={`/quote-jobs/${job.id}?quoteView=available`} photos={job.photos}
            meta={<span>{job.distance}</span>}
            
            moneyValue valueLabel="Fixed price" value={formatDemoMoney(job.priceCents!)}
            actions={<a className={cardStyles.secondaryAction} href={`/quote-jobs/${job.id}?quoteView=available`}>View job<Arrow /></a>} />)}</div>
        </> : <div className={styles.empty}><p>You’ve claimed all available jobs.</p><a className={styles.browseLink} href="/dashboard?quoteView=feed">Quote more jobs<Arrow /></a></div> : <a className={styles.browseLink} href="/dashboard?quoteView=available">Browse available jobs<Arrow /></a> : <Link className={styles.discover} href="/jobs"><SourceIcon name="magnifier" size={26} navigation /><span>Find your next job</span><Arrow /></Link>}
      </section>
    </div>
  </section>;
}

export default TradeHome;
