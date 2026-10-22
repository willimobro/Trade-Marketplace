"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { DEMO_JOBS, DEMO_TRADES, demoTrade, findDemoJob, formatDemoMoney, type DemoJob } from "@/lib/quote-demo/jobs";
import { CLAIM_COST, getPointsBalance, QuoteDemoError, type QuoteDemoState } from "@/lib/quote-demo/model";
import { loadQuoteDemo, resetQuoteDemo, saveDemoClaim, saveDemoCompletion, saveDemoQuote, subscribeQuoteDemo } from "@/lib/quote-demo/storage";
import styles from "./quote-feed.module.css";

type Tab = "feed" | "available" | "quoted" | "claimed";
type Modal = { kind: "quote" | "claim" | "success"; jobId: string } | null;

function Icon({ name, size = 20 }: { name: "coin" | "arrow" | "pin" | "check" | "close" | "clock" | "chevron" | "bolt"; size?: number }) {
  const paths: Record<typeof name, React.ReactNode> = {
    coin: <><circle cx="12" cy="12" r="9" /><path d="M12 6v12M15 8.5h-4.5a2 2 0 0 0 0 4H13a2 2 0 0 1 0 4H8.5" /></>,
    arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chevron: <path d="m9 5 7 7-7 7" />,
    bolt: <path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z" />,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function JobPhoto({ job, className, priority = false }: { job: DemoJob; className?: string; priority?: boolean }) {
  return <div className={`${styles.photo} ${className ?? ""}`}><Image src={job.image} alt={job.imageAlt} fill sizes="(max-width: 700px) 100vw, 500px" priority={priority} className={styles.photoImage} /></div>;
}

function QuotedBadge() {
  return <span className={styles.quotedBadge}><Icon name="check" size={14} />Quoted<span className={styles.badgeCoin}><Icon name="coin" size={15} /></span></span>;
}

export function TradieQuoteWorkspace({ userId, trade }: { userId: string; trade: string | null }) {
  const ownTrade = demoTrade(trade);
  const [state, setState] = useState<QuoteDemoState | null>(null);
  const [storageFailure, setStorageFailure] = useState<QuoteDemoError | null>(null);
  const [tab, setTab] = useState<Tab>("feed");
  const [filter, setFilter] = useState("all");
  const [cursor, setCursor] = useState(0);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [quoteSaved, setQuoteSaved] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const feedFocusTarget = useRef<HTMLHeadingElement>(null);
  const focusAfterFeedChange = useRef(false);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const alive = useRef(true);
  const user = useRef(userId);
  const focusAfterClose = useRef(false);
  const formId = useId();

  const read = useCallback(async () => {
    try {
      const loaded = await loadQuoteDemo(userId);
      if (alive.current && user.current === userId) { setState(loaded); setStorageFailure(null); }
    } catch (error) {
      if (alive.current && user.current === userId) setStorageFailure(error instanceof QuoteDemoError ? error : new QuoteDemoError("storage-unavailable", "Demo storage is unavailable. Retry to reconnect."));
    }
  }, [userId]);

  useEffect(() => {
    alive.current = true;
    user.current = userId;
    setState(null); setStorageFailure(null); setModal(null); setNotice(""); setTab("feed"); setSkipped([]); setCursor(0);
    void read();
    const unsubscribe = subscribeQuoteDemo(userId, () => void read());
    return () => { alive.current = false; unsubscribe(); };
  }, [read, userId]);

  useEffect(() => {
    const node = dialog.current;
    if (modal && node && !node.open) node.showModal();
    if (modal?.kind === "success") requestAnimationFrame(() => successHeading.current?.focus());
    if (!modal && node?.open) {
      node.close();
      if (focusAfterClose.current) { heading.current?.focus(); focusAfterClose.current = false; }
    }
  }, [modal]);

  useEffect(() => {
    if (modal?.kind === "claim" && state?.claims.some((claim) => claim.jobId === modal.jobId)) {
      setModal({ kind: "success", jobId: modal.jobId });
    }
  }, [modal, state]);

  const points = state ? getPointsBalance(state) : 0;
  const quotedIds = new Set(state?.quotes.map((quote) => quote.jobId));
  const claimedIds = new Set(state?.claims.map((claim) => claim.jobId));
  const sorted = [...DEMO_JOBS].sort((a, b) => Number(b.trade === ownTrade) - Number(a.trade === ownTrade));
  const matches = (job: DemoJob) => filter === "all" || job.trade === filter;
  const feed = sorted.filter((job) => job.stage === "quoting" && matches(job) && !quotedIds.has(job.id) && !skipped.includes(job.id));
  const currentIndex = feed.length ? cursor % feed.length : 0;
  const current = feed[currentIndex];
  const available = sorted.filter((job) => job.stage === "available" && matches(job) && !claimedIds.has(job.id));
  const quotes = [...(state?.quotes ?? [])].reverse().filter((quote) => { const job = findDemoJob(quote.jobId); return job && matches(job); });
  const claims = [...(state?.claims ?? [])].reverse().filter((claim) => { const job = findDemoJob(claim.jobId); return job && matches(job); });
  const modalJob = modal ? findDemoJob(modal.jobId) : undefined;
  const editing = !!modalJob && quotedIds.has(modalJob.id);
  const disabled = busy || !state || !!storageFailure;

  // The keyed card (and its Skip button) unmounts. Focus only after React has
  // committed the replacement card or empty state; never focus the old node.
  useLayoutEffect(() => {
    if (focusAfterFeedChange.current && tab === "feed") {
      feedFocusTarget.current?.focus();
      focusAfterFeedChange.current = false;
    }
  }, [current?.id, skipped, tab]);

  function switchTab(next: Tab) { setTab(next); setNotice(""); setQuoteSaved(false); }
  function goToFeed() { focusAfterClose.current = true; setModal(null); setTab("feed"); setFilter("all"); setSkipped([]); setCursor(0); setNotice(""); setQuoteSaved(false); requestAnimationFrame(() => heading.current?.focus()); }
  function openQuote(job: DemoJob) {
    const existing = state?.quotes.find((quote) => quote.jobId === job.id);
    setAmount(existing ? String(existing.amountCents / 100) : ""); setNote(existing?.note ?? ""); setFormError(""); setModal({ kind: "quote", jobId: job.id });
  }
  function openClaim(job: DemoJob) { setFormError(""); setModal({ kind: "claim", jobId: job.id }); }
  function next() { if (feed.length > 1) setCursor((value) => (value + 1) % feed.length); }
  function skip() { if (current && !disabled) { focusAfterFeedChange.current = true; setSkipped((items) => [...items, current.id]); setNotice(`Skipped ${current.title}. You can come back to it.`); } }
  function pointerStart(event: PointerEvent<HTMLDivElement>) { if (event.isPrimary) pointer.current = { x: event.clientX, y: event.clientY }; }
  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (!pointer.current) return;
    const dx = event.clientX - pointer.current.x, dy = event.clientY - pointer.current.y;
    pointer.current = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) next(); else if (feed.length > 1) setCursor((value) => (value + feed.length - 1) % feed.length);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!modalJob || disabled) return;
    setBusy(true); setFormError("");
    try {
      const saved = await saveDemoQuote(userId, modalJob.id, amount, note);
      if (!alive.current || user.current !== userId) return;
      focusAfterClose.current = true; setState(saved.state); setModal(null); setQuoteSaved(true);
      setNotice(saved.result.rewarded ? "+1 point. Quote saved to Quoted Jobs." : "Quote updated. Your point was already earned on this job.");
    } catch (error) {
      if (!alive.current || user.current !== userId) return;
      if (error instanceof QuoteDemoError && ["storage-unavailable", "invalid-storage"].includes(error.code)) setStorageFailure(error);
      setFormError(error instanceof Error ? error.message : "Your quote could not be saved. Please retry.");
    } finally { setBusy(false); }
  }

  async function claim() {
    if (!modalJob || disabled) return;
    setBusy(true); setFormError("");
    try {
      const saved = await saveDemoClaim(userId, modalJob.id);
      if (!alive.current || user.current !== userId) return;
      setState(saved.state); setModal({ kind: "success", jobId: modalJob.id });
      setNotice(saved.result.alreadyClaimed ? "This sample job was already claimed. No extra points spent." : "Sample job claimed. 5 points spent.");
    } catch (error) {
      if (!alive.current || user.current !== userId) return;
      if (error instanceof QuoteDemoError && error.code === "insufficient-points") { await read(); }
      if (error instanceof QuoteDemoError && ["storage-unavailable", "invalid-storage"].includes(error.code)) setStorageFailure(error);
      setFormError(error instanceof Error ? error.message : "The claim could not be saved. Please retry.");
    } finally { setBusy(false); }
  }

  async function complete(job: DemoJob) {
    if (disabled) return;
    setBusy(true);
    try {
      const saved = await saveDemoCompletion(userId, job.id);
      if (!alive.current || user.current !== userId) return;
      setState(saved.state); setNotice("Sample job complete. Your points balance is unchanged.");
      heading.current?.focus();
    } catch (error) {
      if (!alive.current || user.current !== userId) return;
      if (error instanceof QuoteDemoError && ["storage-unavailable", "invalid-storage"].includes(error.code)) setStorageFailure(error);
      setNotice(error instanceof Error ? error.message : "Completion could not be saved. Please retry.");
    } finally { setBusy(false); }
  }

  async function reset() {
    setBusy(true);
    try { setState(await resetQuoteDemo(userId)); setStorageFailure(null); setModal(null); setNotice("This user's sample data has been reset."); setSkipped([]); setCursor(0); }
    catch (error) { setStorageFailure(error instanceof QuoteDemoError ? error : new QuoteDemoError("storage-unavailable", "Could not reset sample data. Please retry.")); }
    finally { setBusy(false); }
  }

  return <section className={styles.workspace} data-mode="trade" aria-label="Sample tradie quote workspace">
    <div className={styles.demoLine}><span className={styles.demoDot} />SAMPLE WORKSPACE<span>{storageFailure ? "Storage unavailable" : state ? "Saved on this device" : "Connecting storage…"}</span></div>
    <section className={styles.pointsPanel} aria-label="Your points">
      <div className={styles.pointsBalance}>
        <span className={styles.bigCoin}><Icon name="coin" size={31} /></span>
        <div><span className={styles.pointsLabel}>Demo points</span><p><strong>{state ? points : "—"}</strong><span>points</span></p></div>
      </div>
      <div className={styles.pointsMessage}><strong>Earn 1 per quote. Claim for 5.</strong><p>Includes 3 starter points for this demo.</p></div>
      <button className={styles.primary} onClick={goToFeed}>Quote more jobs<Icon name="arrow" /></button>
    </section>
    <div className={styles.workspaceNav}>
      <div className={styles.tabs} role="group" aria-label="Workspace views">
        {([ ["feed", "Quote feed", null], ["available", "Available jobs", DEMO_JOBS.filter((job) => job.stage === "available" && !claimedIds.has(job.id)).length], ["quoted", "Quoted Jobs", state?.quotes.length ?? 0], ["claimed", "My claims", state?.claims.length ?? 0] ] as const).map(([value, label, count]) =>
          <button key={value} aria-pressed={tab === value} className={tab === value ? styles.activeTab : ""} onClick={() => switchTab(value)}>{label}{count !== null && <span>{count}</span>}</button>)}
      </div>
      <label className={styles.tradeFilter}><span>Trade</span><select aria-label="Filter jobs by trade" value={filter} onChange={(event) => { setFilter(event.target.value); setCursor(0); }}>{<option value="all">All trades</option>}{DEMO_TRADES.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>

    {storageFailure && <div className={styles.storageError} role="alert"><div><strong>Demo storage needs a moment.</strong><p>{storageFailure.message}</p></div><div className={styles.errorActions}><button onClick={() => void read()} disabled={busy}>Retry storage</button>{storageFailure.code === "invalid-storage" && <button onClick={() => void reset()} disabled={busy}>Reset this user&apos;s sample data</button>}</div></div>}
    {notice && <div className={styles.notice} role="status"><Icon name="check" size={18} /><span>{notice}</span>{quoteSaved && <button onClick={() => switchTab("quoted")}>View quoted jobs<Icon name="arrow" size={16} /></button>}</div>}

    <div className={styles.sectionHeading}>
      <div><p className={styles.eyebrow}>{tab === "feed" ? "YOUR NEXT OPPORTUNITY" : tab === "quoted" ? "YOUR KNOW-HOW, PUT TO WORK" : tab === "claimed" ? "YOUR SAMPLE CLAIMS" : "READY WHEN YOU ARE"}</p>
        <h2 ref={heading} tabIndex={-1}>{tab === "feed" ? "Quote more jobs" : tab === "quoted" ? "Quoted Jobs" : tab === "claimed" ? "My claims" : "Available jobs"}</h2>
        <p>{tab === "feed" ? "Take a look. Send a quote. Build your balance." : tab === "quoted" ? "Every first quote earned you 1 point. All in one place." : tab === "claimed" ? "Your claimed sample jobs and the points you spent." : "Use 5 points to claim a sample job that suits you."}</p>
      </div>
      {tab === "feed" && current && <span className={styles.feedCount}>{currentIndex + 1}<span> / {feed.length}</span></span>}
    </div>

    {!state && !storageFailure ? <div className={styles.loading} role="status">Opening your sample workspace…</div> : tab === "feed" ? current ? <>
      <article className={styles.feedCard} key={current.id}>
        <div className={styles.feedVisual} onPointerDown={pointerStart} onPointerUp={pointerEnd} onPointerCancel={() => { pointer.current = null; }}>
          <JobPhoto job={current} priority />
          <span className={styles.photoTrade}>{current.trade}</span><span className={styles.earnBadge}><Icon name="coin" size={16} />+1 point</span>
          <div className={styles.photoCaption}><span><Icon name="pin" size={15} />{current.suburb} · {current.distance}</span><h3 ref={feedFocusTarget} tabIndex={-1} data-testid="quote-feed-focus-target">{current.title}</h3></div>
        </div>
        <div className={styles.feedDetails}>
          <div className={styles.jobTopline}><span className={styles.openDot} />Open for quotes<span>{current.posted}</span></div>
          <h3>The job at a glance</h3><p className={styles.description}>{current.description}</p>
          <div className={styles.detailTags}>{current.details.map((item) => <span key={item}>{item}</span>)}</div>
          <p className={styles.timing}><Icon name="clock" size={17} />{current.timing}</p>
          <div className={styles.feedActions}><button className={styles.skip} onClick={skip} disabled={disabled} aria-label={`Skip ${current.title}`}>Skip</button><button className={styles.primary} onClick={() => openQuote(current)} disabled={disabled}>Quote this job<Icon name="arrow" /></button></div>
        </div>
      </article>
      <div className={styles.feedFooter}><span>{feed.length} jobs to explore{ownTrade && filter === "all" ? ` · ${ownTrade} first` : ""}</span><button onClick={next} disabled={feed.length < 2 || disabled}>Next job<Icon name="arrow" size={18} /></button></div>
    </> : <div className={styles.empty}><span className={styles.emptyIcon}><Icon name="check" size={30} /></span><h3 ref={feedFocusTarget} tabIndex={-1} data-testid="quote-feed-focus-target">{skipped.length ? "A breather? You’ve earned it." : "You’re all caught up."}</h3><p>{skipped.length ? "Come back to the jobs you skipped, or see what is available." : "Your saved quotes are in Quoted Jobs. Find your next opportunity in Available jobs."}</p><div>{skipped.length > 0 && <button className={styles.primary} onClick={() => { focusAfterFeedChange.current = true; setSkipped([]); setCursor(0); setNotice(""); }}>Show skipped jobs</button>}<button className={styles.secondary} onClick={() => switchTab("available")}>Browse available jobs<Icon name="arrow" size={18} /></button></div></div>
      : tab === "available" ? <div className={styles.jobGrid}>{available.length ? available.map((job) => <article className={styles.smallCard} key={job.id}><div className={styles.smallVisual}><JobPhoto job={job} /><span className={styles.photoTrade}>{job.trade}</span><span className={styles.readyBadge}>Ready to claim</span></div><div className={styles.smallBody}><p className={styles.location}><Icon name="pin" size={15} />{job.suburb} · {job.distance}</p><h3>{job.title}</h3><p className={styles.smallDescription}>{job.description}</p><div className={styles.cardPrice}><div><span>Sample fixed price</span><strong>{formatDemoMoney(job.priceCents!)}</strong></div><span className={styles.claimCost}><Icon name="coin" size={18} />5 points</span></div><button className={styles.primary} onClick={() => openClaim(job)} disabled={disabled}>Review &amp; claim<Icon name="arrow" size={18} /></button></div></article>) : <div className={styles.empty}><h3>No available jobs in this view.</h3><p>Try all trades, or review your sample claims.</p><button className={styles.secondary} onClick={() => { setFilter("all"); switchTab("claimed"); }}>View my claims</button></div>}</div>
      : tab === "quoted" ? <div className={styles.quotedGrid}>{quotes.length ? quotes.map((quote) => { const job = findDemoJob(quote.jobId)!; return <article className={styles.quotedCard} key={job.id}><div className={styles.quotedVisual}><JobPhoto job={job} /><QuotedBadge /></div><div className={styles.quotedBody}><p className={styles.location}>{job.trade} · {job.suburb}</p><h3>{job.title}</h3><div className={styles.quotedBottom}><div><span>Your quote</span><strong>{formatDemoMoney(quote.amountCents)}</strong></div><button className={styles.secondary} onClick={() => openQuote(job)} disabled={disabled}>Edit quote<Icon name="chevron" size={16} /></button></div></div></article>; }) : <div className={styles.empty}><span className={styles.emptyIcon}><Icon name="coin" size={30} /></span><h3>Your first point starts here.</h3><p>Send a quote from the feed. We’ll keep it here for you.</p><button className={styles.primary} onClick={goToFeed}>Quote more jobs<Icon name="arrow" size={18} /></button></div>}</div>
      : <div className={styles.savedList}>{claims.length ? claims.map((saved) => { const job = findDemoJob(saved.jobId)!; return <article className={styles.savedCard} key={job.id}><JobPhoto job={job} /><div className={styles.savedBody}><div className={styles.savedMeta}><span>{job.trade} · {job.suburb}</span><span className={styles.claimedBadge}><Icon name="check" size={14} />{saved.completedAt ? "Sample complete" : "Sample claimed"}</span></div><h3>{job.title}</h3><p>{saved.completedAt ? "Completed in this demo. No real work or payment is recorded." : "Next: try completing this sample job."}</p><div className={styles.savedBottom}><strong>{formatDemoMoney(job.priceCents!)}</strong>{saved.completedAt ? <span className={styles.claimCost}><Icon name="coin" size={17} />5 points spent</span> : <button className={styles.completeButton} onClick={() => void complete(job)} disabled={disabled}>{busy ? "Saving…" : "Complete sample job"}<Icon name="check" size={16} /></button>}</div></div></article>; }) : <div className={styles.empty}><span className={styles.emptyIcon}><Icon name="bolt" size={30} /></span><h3>Make your points work for you.</h3><p>Claim an available sample job for 5 points.</p><button className={styles.primary} onClick={() => switchTab("available")}>Browse available jobs<Icon name="arrow" size={18} /></button></div>}</div>}

    <p className={styles.disclaimer}>3 starter demo points. Illustrative photos. No real quotes, bookings or payments are sent.</p>

    <dialog className={styles.dialog} ref={dialog} aria-labelledby={`${formId}-title`} onCancel={(event) => { if (busy) event.preventDefault(); else setModal(null); }} onClick={(event) => { if (event.target === event.currentTarget && !busy) setModal(null); }}>
      {modal && modalJob && <div className={styles.dialogInner}>
        <button className={styles.close} aria-label="Close dialog" onClick={() => setModal(null)} disabled={busy}><Icon name="close" size={22} /></button>
        {modal.kind === "quote" ? <>
          <p className={styles.eyebrow}>{editing ? "YOUR SAVED QUOTE" : "A LITTLE KNOW-HOW. ONE MORE POINT."}</p><h2 id={`${formId}-title`}>{editing ? "Fine-tune your quote." : "What’s your quote?"}</h2>
          <div className={styles.dialogJob}><JobPhoto job={modalJob} /><div><span>{modalJob.trade} · {modalJob.suburb}</span><h3>{modalJob.title}</h3></div></div>
          <form onSubmit={submit} noValidate>
            <label className={styles.fieldLabel} htmlFor={`${formId}-amount`}>Your estimate <span>NZD, including GST if applicable</span></label><div className={styles.amountField}><span>$</span><input autoFocus id={`${formId}-amount`} inputMode="decimal" autoComplete="off" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} aria-describedby={`${formId}-error`} aria-invalid={!!formError} required /></div>
            <label className={styles.fieldLabel} htmlFor={`${formId}-scope`}>What’s included?</label><textarea id={`${formId}-scope`} placeholder="Labour, materials and anything the customer should know…" value={note} onChange={(event) => setNote(event.target.value)} rows={4} maxLength={1000} aria-describedby={`${formId}-scope-help ${formId}-error`} aria-invalid={!!formError} required /><p id={`${formId}-scope-help`} className={styles.fieldHelp}>A clear scope note, 10–1,000 characters.</p>
            <div className={styles.formReward}><Icon name="coin" size={21} /><span>{editing ? "Already earned: 1 point. Edits don’t earn more." : "Save your first quote on this job to earn 1 point."}</span></div>
            <p id={`${formId}-error`} className={styles.formError} role="alert">{formError}</p><button className={styles.primary} type="submit" disabled={disabled}>{busy ? "Saving quote…" : editing ? "Save changes" : "Save quote + earn 1 point"}<Icon name="arrow" size={18} /></button>
          </form><p className={styles.modalFine}>A sample estimate for this demo. Nothing is sent to a customer.</p>
        </> : modal.kind === "claim" ? <>
          <p className={styles.eyebrow}>PUT YOUR POINTS TO WORK</p><h2 id={`${formId}-title`}>{points < CLAIM_COST ? "A few more points to go." : "Your next job starts here."}</h2>
          <div className={styles.dialogJob}><JobPhoto job={modalJob} /><div><span>{modalJob.trade} · {modalJob.suburb}</span><h3>{modalJob.title}</h3></div></div>
          <p className={styles.claimDescription}>{modalJob.description}</p><dl className={styles.claimSummary}><div><dt>Sample fixed price</dt><dd>{formatDemoMoney(modalJob.priceCents!)}</dd></div><div><dt>Your balance</dt><dd>{points} points</dd></div><div><dt>Cost to claim</dt><dd>−5 points</dd></div><div><dt>{points < CLAIM_COST ? "Points needed" : "Balance after claim"}</dt><dd>{points < CLAIM_COST ? CLAIM_COST - points : points - CLAIM_COST} points</dd></div></dl>
          <p className={styles.formError} role="alert">{formError}</p>{points < CLAIM_COST ? <><p className={styles.claimHint}>Each first quote earns 1 point. You’re {CLAIM_COST - points} {CLAIM_COST - points === 1 ? "quote" : "quotes"} away.</p><button className={styles.primary} onClick={goToFeed}>Quote more jobs<Icon name="arrow" size={18} /></button></> : <button className={styles.primary} onClick={() => void claim()} disabled={disabled}>{busy ? "Saving claim…" : "Confirm claim · 5 points"}<Icon name="arrow" size={18} /></button>}
          <p className={styles.modalFine}>This claims a sample job only. It does not book work or contact a customer.</p>
        </> : <div className={styles.success}><span className={styles.successIcon}><Icon name="check" size={36} /></span><p className={styles.eyebrow}>NICE WORK</p><h2 ref={successHeading} tabIndex={-1} id={`${formId}-title`}>Sample job claimed.</h2><p>{modalJob.title}</p><div className={styles.successBalance}><Icon name="coin" size={23} /><strong>{points}</strong> points remaining</div><p className={styles.claimHint}>Next: open your claim and try completing the sample job.</p><button className={styles.primary} onClick={() => { focusAfterClose.current = true; setModal(null); setTab("claimed"); }}>View my claims<Icon name="arrow" size={18} /></button><button className={styles.textButton} onClick={goToFeed}>Keep quoting</button><p className={styles.modalFine}>No real work has been booked.</p></div>}
      </div>}
    </dialog>
  </section>;
}

export default TradieQuoteWorkspace;
