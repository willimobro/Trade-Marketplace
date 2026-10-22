"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { JobCardFrame } from "@/components/job-cards/JobCardFrame";
import { JobPhotoCarousel } from "@/components/job-cards/JobPhotoCarousel";
import cardStyles from "@/components/job-cards/job-card.module.css";
import { DEMO_JOBS, DEMO_TRADES, demoTrade, findDemoJob, formatDemoMoney, type DemoJob } from "@/lib/quote-demo/jobs";
import { clearComposerDraft, loadQuoteDraft, MAX_QUOTE_DRAFT_AMOUNT_LENGTH, saveQuoteDraft, type QuoteDraft } from "@/lib/quote-demo/drafts";
import { CLAIM_COST, getDemoQuoteStatus, getPointsBalance, QuoteDemoError, type QuoteDemoState } from "@/lib/quote-demo/model";
import { loadQuoteDemo, resetQuoteDemo, saveDemoClaim, saveDemoCompletion, saveDemoQuote, subscribeQuoteDemo } from "@/lib/quote-demo/storage";
import { readWorkspaceNavigation, workspaceSearch, type WorkspaceTab } from "./workspace-navigation";
import { quoteFormError } from "./quote-form";
import styles from "./quote-feed.module.css";

type Modal = { kind: "quote" | "accepted" | "claim" | "success"; jobId: string } | null;

function Icon({ name, size = 20 }: { name: "coin" | "arrow" | "pin" | "check" | "close" | "clock" | "chevron" | "bolt" | "info"; size?: number }) {
  const paths: Record<typeof name, React.ReactNode> = {
    coin: <><circle cx="12" cy="12" r="9" /><path d="M12 6v12M15 8.5h-4.5a2 2 0 0 0 0 4H13a2 2 0 0 1 0 4H8.5" /></>,
    arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chevron: <path d="m9 5 7 7-7 7" />,
    bolt: <path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function JobPhoto({ job }: { job: DemoJob }) {
  return <div className={styles.dialogPhoto}><JobPhotoCarousel photos={job.photos} title={job.title} compact /></div>;
}

export function TradieQuoteWorkspace({ userId, trade, intro }: { userId: string; trade: string | null; intro?: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navigation = readWorkspaceNavigation(searchParams.toString());
  const tab = navigation.tab;
  const filter = navigation.trade;
  const ownTrade = demoTrade(trade);
  const [state, setState] = useState<QuoteDemoState | null>(null);
  const [storageFailure, setStorageFailure] = useState<QuoteDemoError | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");
  const [invalidField, setInvalidField] = useState<"amount" | "scope" | null>(null);
  const [formFocus, setFormFocus] = useState<"amount" | "scope" | "error" | "accepted" | null>(null);
  const [draftFailure, setDraftFailure] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [quoteSaved, setQuoteSaved] = useState(false);
  const [pointsInfoOpen, setPointsInfoOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const pointsDialog = useRef<HTMLDialogElement>(null);
  const pointsInfoButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const acceptedHeading = useRef<HTMLHeadingElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);
  const scopeInput = useRef<HTMLTextAreaElement>(null);
  const formErrorElement = useRef<HTMLParagraphElement>(null);
  const feedHeadings = useRef(new Map<string, HTMLHeadingElement>());
  const alive = useRef(true);
  const user = useRef(userId);
  const focusAfterClose = useRef(false);
  const quoteDraftMemory = useRef(new Map<string, QuoteDraft>());
  const formId = useId();

  const read = useCallback(async () => {
    try {
      const loaded = await loadQuoteDemo(userId);
      if (alive.current && user.current === userId) { setState(current => !current || loaded.revision >= current.revision ? loaded : current); setStorageFailure(null); }
    } catch (error) {
      if (alive.current && user.current === userId) setStorageFailure(error instanceof QuoteDemoError ? error : new QuoteDemoError("storage-unavailable", "Workspace storage is unavailable. Retry to reconnect."));
    }
  }, [userId]);

  useEffect(() => {
    alive.current = true;
    user.current = userId;
    setState(null); setStorageFailure(null); setModal(null); setNotice(""); setDraftFailure("");
    void read();
    const unsubscribe = subscribeQuoteDemo(userId, () => void read());
    return () => { alive.current = false; unsubscribe(); };
  }, [read, userId]);

  useEffect(() => {
    const node = pointsDialog.current;
    if (pointsInfoOpen && node && !node.open) node.showModal();
    if (!pointsInfoOpen && node?.open) { node.close(); pointsInfoButton.current?.focus(); }
  }, [pointsInfoOpen]);

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
    if (busy || !formFocus) return;
    const target = { amount: amountInput, scope: scopeInput, error: formErrorElement, accepted: acceptedHeading }[formFocus].current;
    if (target) { target.focus(); setFormFocus(null); }
  }, [busy, formFocus, modal]);

  useEffect(() => {
    if (modal?.kind === "claim" && state?.claims.some((claim) => claim.jobId === modal.jobId)) {
      setModal({ kind: "success", jobId: modal.jobId });
    }
    if (modal?.kind === "quote" && state && getDemoQuoteStatus(state, modal.jobId) === "accepted") {
      setModal({ kind: "accepted", jobId: modal.jobId });
      setFormError(""); setInvalidField(null); setFormFocus("accepted");
    }
  }, [modal, state]);

  const points = state ? getPointsBalance(state) : 0;
  const quotedIds = new Set(state?.quotes.map((quote) => quote.jobId));
  const claimedIds = new Set(state?.claims.map((claim) => claim.jobId));
  const sorted = [...DEMO_JOBS].sort((a, b) => Number(b.trade === ownTrade) - Number(a.trade === ownTrade));
  const matches = (job: DemoJob) => filter === "all" || job.trade === filter;
  const feed = sorted.filter((job) => job.stage === "quoting" && matches(job));
  const available = sorted.filter((job) => job.stage === "available" && matches(job) && !claimedIds.has(job.id));
  const quotes = [...(state?.quotes ?? [])].reverse().filter((quote) => { const job = findDemoJob(quote.jobId); return job && matches(job); });
  const claims = [...(state?.claims ?? [])].reverse().filter((claim) => { const job = findDemoJob(claim.jobId); return job && matches(job); }).sort((a, b) => Number(!!a.completedAt) - Number(!!b.completedAt));
  const modalJob = modal ? findDemoJob(modal.jobId) : undefined;
  const modalQuote = state?.quotes.find(quote => quote.jobId === modal?.jobId);
  const editing = !!modalJob && quotedIds.has(modalJob.id);
  const disabled = busy || !state || !!storageFailure;

  const ready = state?.userId === userId;
  // Returning from a detail page restores its card without making the old
  // single-card selection or skipped-job session a source of routing state.
  useLayoutEffect(() => {
    if (ready && tab === "feed" && navigation.quoteJob) feedHeadings.current.get(navigation.quoteJob)?.focus();
  }, [ready, tab, filter, navigation.quoteJob]);

  useEffect(() => { setModal(null); setNotice(""); setQuoteSaved(false); }, [tab, filter]);

  function switchTab(next: WorkspaceTab) {
    router.push(`/dashboard?${workspaceSearch({ tab: next, trade: filter })}`, { scroll: false });
  }
  function goToFeed() { focusAfterClose.current = !!modal; setModal(null); router.push(`/dashboard?${workspaceSearch({ tab: "feed", trade: "all" })}`, { scroll: false }); requestAnimationFrame(() => heading.current?.focus()); }
  function detailHref(jobId: string) { return `/quote-jobs/${jobId}?${workspaceSearch({ tab, trade: filter, quoteJob: jobId })}`; }
  function draftKey(jobId: string) { return JSON.stringify([userId, jobId]); }
  function openQuote(job: DemoJob) {
    if (state && getDemoQuoteStatus(state, job.id) === "accepted") return;
    const existing = state?.quotes.find((quote) => quote.jobId === job.id);
    const loaded = loadQuoteDraft(userId, job.id);
    const draft = loaded.ok ? loaded.value ?? quoteDraftMemory.current.get(draftKey(job.id)) : quoteDraftMemory.current.get(draftKey(job.id));
    setDraftFailure(loaded.ok ? "" : loaded.error.message);
    setAmount(draft?.amount ?? (existing ? String(existing.amountCents / 100) : "")); setNote(draft?.scope ?? existing?.note ?? ""); setFormError(""); setInvalidField(null); setFormFocus(null); setModal({ kind: "quote", jobId: job.id });
  }

  function changeQuoteDraft(nextAmount: string, nextScope: string) {
    setAmount(nextAmount); setNote(nextScope); setFormError(""); setInvalidField(null);
    if (modal?.kind !== "quote") return;
    const value = { amount: nextAmount, scope: nextScope };
    quoteDraftMemory.current.set(draftKey(modal.jobId), value);
    const saved = saveQuoteDraft(userId, modal.jobId, value);
    setDraftFailure(saved.ok ? "" : saved.error.message);
  }

  function discardQuoteDraft() {
    if (modal?.kind !== "quote") return;
    const cleared = clearComposerDraft(userId, modal.jobId, "quote");
    setDraftFailure(cleared.ok ? "" : cleared.error.message);
    if (!cleared.ok) return;
    quoteDraftMemory.current.delete(draftKey(modal.jobId));
    const existing = state?.quotes.find((quote) => quote.jobId === modal.jobId);
    setAmount(existing ? String(existing.amountCents / 100) : ""); setNote(existing?.note ?? ""); setFormError(""); setInvalidField(null);
    document.getElementById(`${formId}-amount`)?.focus();
  }
  function openClaim(job: DemoJob) { setFormError(""); setModal({ kind: "claim", jobId: job.id }); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!modalJob || modal?.kind !== "quote" || disabled || state && getDemoQuoteStatus(state, modalJob.id) === "accepted") return;
    const invalid = quoteFormError(amount, note);
    if (invalid) { setFormError(invalid.message); setInvalidField(invalid.field); setFormFocus(invalid.field); return; }
    setBusy(true); setFormError("");
    try {
      const saved = await saveDemoQuote(userId, modalJob.id, amount, note);
      const cleared = clearComposerDraft(userId, modalJob.id, "quote", { amount, scope: note });
      if (!alive.current || user.current !== userId) return;
      quoteDraftMemory.current.delete(draftKey(modalJob.id)); setDraftFailure(cleared.ok ? "" : cleared.error.message);
      focusAfterClose.current = true; setState(saved.state); setModal(null); setQuoteSaved(true);
      setNotice(saved.result.rewarded ? "+1 point. Quote saved to Quoted jobs." : "Quote updated. Your point was already earned on this job.");
    } catch (error) {
      if (!alive.current || user.current !== userId) return;
      if (error instanceof QuoteDemoError && ["storage-unavailable", "invalid-storage"].includes(error.code)) setStorageFailure(error);
      setFormError(error instanceof Error ? error.message : "Your quote could not be saved. Please retry.");
      if (error instanceof QuoteDemoError && error.code === "quote-accepted") {
        setModal({ kind: "accepted", jobId: modalJob.id }); setFormFocus("accepted");
        await read();
      } else setFormFocus("error");
    } finally { setBusy(false); }
  }

  async function claim() {
    if (!modalJob || disabled) return;
    setBusy(true); setFormError("");
    try {
      const saved = await saveDemoClaim(userId, modalJob.id);
      if (!alive.current || user.current !== userId) return;
      setState(saved.state); setModal({ kind: "success", jobId: modalJob.id });
      setNotice(saved.result.alreadyClaimed ? "This job was already claimed. No extra points spent." : "Job claimed. 5 points spent.");
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
      setState(saved.state); setNotice("Job complete. Your points balance is unchanged.");
      heading.current?.focus();
    } catch (error) {
      if (!alive.current || user.current !== userId) return;
      if (error instanceof QuoteDemoError && ["storage-unavailable", "invalid-storage"].includes(error.code)) setStorageFailure(error);
      setNotice(error instanceof Error ? error.message : "Completion could not be saved. Please retry.");
    } finally { setBusy(false); }
  }

  async function reset() {
    setBusy(true);
    try { setState(await resetQuoteDemo(userId)); setStorageFailure(null); setModal(null); setNotice("This account's preview data has been reset."); }
    catch (error) { setStorageFailure(error instanceof QuoteDemoError ? error : new QuoteDemoError("storage-unavailable", "Could not reset preview data. Please retry.")); }
    finally { setBusy(false); }
  }

  return <section className={styles.workspace} data-mode="trade" aria-label="Tradie quote workspace">
    <header className={styles.workspaceHeader}>
      {intro}
      <section className={styles.pointsPanel} aria-label="Your points">
        <div className={styles.pointsBalance}>
          <span className={styles.bigCoin}><Icon name="coin" size={31} /></span>
          <div><span className={styles.pointsLabel}>Points</span><p><strong>{state ? points : "—"}</strong><button ref={pointsInfoButton} className={styles.pointsInfoButton} type="button" aria-label="How points work" aria-controls={`${formId}-points-info`} aria-expanded={pointsInfoOpen} onClick={() => setPointsInfoOpen(true)}><Icon name="info" size={20} /></button></p></div>
        </div>
        <button className={`${styles.secondary} ${styles.pointsNav}`} onClick={goToFeed}>Quote more jobs<Icon name="arrow" /></button>
      </section>
    </header>
    <div className={styles.workspaceNav}>
      <nav className={styles.tabs} aria-label="Workspace views">
        {([ ["feed", "Find work", null], ["available", "Jobs", DEMO_JOBS.filter((job) => job.stage === "available" && !claimedIds.has(job.id)).length], ["quoted", "Quoted jobs", state?.quotes.length ?? 0], ["claimed", "Your jobs", state?.claims.length ?? 0] ] as const).map(([value, label, count]) =>
          <Link key={value} href={`/dashboard?${workspaceSearch({ tab: value, trade: filter })}`} scroll={false} aria-current={tab === value ? "page" : undefined} className={tab === value ? styles.activeTab : ""}>{label}{count !== null && <span>{count}</span>}</Link>)}
      </nav>
      <label className={styles.tradeFilter}><span>Trade</span><select aria-label="Filter jobs by trade" value={filter} onChange={(event) => router.push(`/dashboard?${workspaceSearch({ tab, trade: event.target.value })}`, { scroll: false })}>{<option value="all">All trades</option>}{DEMO_TRADES.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>

    {storageFailure && <div className={styles.storageError} role="alert"><div><strong>Your saved workspace is unavailable.</strong><p>{storageFailure.message}</p></div><div className={styles.errorActions}><button onClick={() => void read()} disabled={busy}>Retry storage</button>{storageFailure.code === "invalid-storage" && <button onClick={() => void reset()} disabled={busy}>Reset this account&apos;s preview data</button>}</div></div>}
    {draftFailure && !modal && <p className={styles.formError} role="status">{draftFailure}</p>}
    {notice && <div className={styles.notice} role="status"><Icon name="check" size={18} /><span>{notice}</span>{quoteSaved && <button onClick={() => switchTab("quoted")}>View quoted jobs<Icon name="arrow" size={16} /></button>}</div>}

    <div className={styles.sectionHeading}>
      <div>
        <h2 ref={heading} tabIndex={-1}>{tab === "feed" ? "Quote more jobs" : tab === "quoted" ? "Quoted jobs" : tab === "claimed" ? "Your jobs" : "Jobs"}</h2>
        {tab === "available" && <p className={styles.sectionHelp}>Claiming jobs costs 5 points</p>}
      </div>
      {tab === "feed" && <span className={styles.feedCount}>{feed.length}<span> jobs</span></span>}
    </div>

    {!state && !storageFailure ? <div className={styles.loading} role="status">Opening your workspace…</div> : tab === "feed" ? <div className={cardStyles.grid}>{feed.length ? feed.map((job) => {
      const quote = state?.quotes.find((item) => item.jobId === job.id);
      const status = state ? getDemoQuoteStatus(state, job.id) : undefined;
      return <JobCardFrame key={job.id} title={job.title} href={detailHref(job.id)} photos={job.photos} quoteStatus={status}
        headingRef={(node) => { if (node) feedHeadings.current.set(job.id, node); else feedHeadings.current.delete(job.id); }} focusTarget
        meta={<span>{job.trade} · {job.suburb}</span>}
        status={<span>{status === "accepted" ? "Customer accepted your quote" : quote ? "Quote saved" : "Open for quotes"} · {job.distance}</span>}
        moneyValue={!!quote} valueLabel={quote ? "Your quote" : "Your estimate"} value={quote ? formatDemoMoney(quote.amountCents) : "To quote"}
        actions={status === "accepted" ? <Link className={cardStyles.secondaryAction} href={detailHref(job.id)}>View job<Icon name="arrow" size={18} /></Link> : quote ? <button className={cardStyles.secondaryAction} onClick={() => openQuote(job)} disabled={disabled}>Edit quote<Icon name="chevron" size={18} /></button> : <button className={cardStyles.primaryAction} onClick={() => openQuote(job)} disabled={disabled}>Quote <span className={styles.quoteReward}>+1 point</span><Icon name="arrow" size={18} /></button>} />;
    }) : <div className={styles.empty}><h3>No jobs in this view.</h3><p>Choose another trade to find work to quote.</p><button className={styles.secondary} onClick={goToFeed}>Show all trades</button></div>}</div>
      : tab === "available" ? <div className={cardStyles.grid}>{available.length ? available.map((job) => <JobCardFrame key={job.id} title={job.title} href={detailHref(job.id)} photos={job.photos} quoteStatus={state ? getDemoQuoteStatus(state, job.id) : undefined}
        meta={<span>{job.trade} · {job.suburb}</span>}
        status={<><span className={cardStyles.statusDot} /><span>Ready to claim · {job.distance}</span></>}
        moneyValue valueLabel="Fixed price" value={formatDemoMoney(job.priceCents!)}
        actions={<button className={cardStyles.primaryAction} onClick={() => openClaim(job)} disabled={disabled}>Review &amp; claim<span className={styles.claimCost}><Icon name="coin" size={18} />5 points</span></button>} />) : <div className={styles.empty}><h3>No available jobs in this view.</h3><p>Try all trades or review your claimed jobs.</p><button className={styles.secondary} onClick={() => router.push(`/dashboard?${workspaceSearch({ tab: "claimed", trade: "all" })}`, { scroll: false })}>View your jobs</button></div>}</div>
      : tab === "quoted" ? <div className={cardStyles.grid}>{quotes.length ? quotes.map((quote) => {
        const job = findDemoJob(quote.jobId)!;
        const quoteStatus = state ? getDemoQuoteStatus(state, job.id) : undefined;
        return <JobCardFrame key={job.id} title={job.title} href={detailHref(job.id)} photos={job.photos} quoteStatus={quoteStatus}
          meta={<span>{job.trade} · {job.suburb}</span>}
          status={<span>{quoteStatus === "accepted" ? "Customer accepted your quote" : "Quote saved"} · {job.distance}</span>}
          moneyValue valueLabel="Your quote" value={formatDemoMoney(quote.amountCents)}
          actions={quoteStatus === "accepted" ? <Link className={cardStyles.secondaryAction} href={detailHref(job.id)}>View job<Icon name="arrow" size={18} /></Link> : <button className={cardStyles.secondaryAction} onClick={() => openQuote(job)} disabled={disabled}>Edit quote<Icon name="chevron" size={18} /></button>} />;
      }) : <div className={styles.empty}><span className={styles.emptyIcon}><Icon name="coin" size={30} /></span><h3>No quoted jobs yet.</h3><p>Your saved quotes will appear here.</p><button className={styles.secondary} onClick={goToFeed}>Quote more jobs<Icon name="arrow" size={18} /></button></div>}</div>
      : <div className={cardStyles.grid}>{claims.length ? claims.map((saved) => {
        const job = findDemoJob(saved.jobId)!;
        return <JobCardFrame key={job.id} title={job.title} href={detailHref(job.id)} photos={job.photos} quoteStatus={state ? getDemoQuoteStatus(state, job.id) : undefined} completed={!!saved.completedAt}
          meta={<span>{job.trade} · {job.suburb}</span>}
          status={<><Icon name="check" size={16} /><span>{saved.completedAt ? "Complete" : "Claimed"} · 5 points spent</span></>}
          moneyValue valueLabel="Fixed price" value={formatDemoMoney(job.priceCents!)}
          actions={saved.completedAt ? <Link className={cardStyles.secondaryAction} href={detailHref(job.id)}>View job<Icon name="arrow" size={18} /></Link> : <button className={cardStyles.primaryAction} onClick={() => void complete(job)} disabled={disabled}>{busy ? "Saving…" : "Complete job"}<Icon name="check" size={18} /></button>} />;
      }) : <div className={styles.empty}><span className={styles.emptyIcon}><Icon name="bolt" size={30} /></span><h3>No claimed jobs yet.</h3><p>Claim a job for 5 points.</p><button className={styles.secondary} onClick={() => switchTab("available")}>Browse jobs<Icon name="arrow" size={18} /></button></div>}</div>}


    <dialog className={`${styles.dialog} ${styles.pointsDialog}`} ref={pointsDialog} id={`${formId}-points-info`} aria-labelledby={`${formId}-points-title`} onCancel={(event) => { event.preventDefault(); setPointsInfoOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setPointsInfoOpen(false); }}>
      <div className={styles.dialogInner}><button className={styles.close} aria-label="Close points information" onClick={() => setPointsInfoOpen(false)}><Icon name="close" size={22} /></button><h2 id={`${formId}-points-title`}>How points work</h2><p>You start with 3 points. Your first quote on each job earns 1 point. Editing a quote earns no extra points. Claiming a job costs 5 points.</p></div>
    </dialog>

    <dialog className={styles.dialog} ref={dialog} aria-labelledby={`${formId}-title`} onCancel={(event) => { if (busy) event.preventDefault(); else setModal(null); }} onClick={(event) => { if (event.target === event.currentTarget && !busy) setModal(null); }}>
      {modal && modalJob && <div className={styles.dialogInner}>
        <button className={styles.close} aria-label="Close dialog" onClick={() => setModal(null)} disabled={busy}><Icon name="close" size={22} /></button>
        {modal.kind === "quote" ? <>
          <h2 id={`${formId}-title`}>{editing ? "Edit quote" : "Quote this job"}</h2>
          <div className={styles.dialogJob}><JobPhoto job={modalJob} /><div><span>{modalJob.trade} · {modalJob.suburb}</span><h3>{modalJob.title}</h3></div></div>
          <form onSubmit={submit} noValidate>
            <label className={styles.fieldLabel} htmlFor={`${formId}-amount`}>Your estimate <span>NZD, including GST if applicable</span></label><div className={styles.amountField}><span>$</span><input ref={amountInput} autoFocus id={`${formId}-amount`} inputMode="decimal" autoComplete="off" maxLength={MAX_QUOTE_DRAFT_AMOUNT_LENGTH} placeholder="0.00" value={amount} onChange={(event) => changeQuoteDraft(event.target.value, note)} aria-describedby={`${formId}-error`} aria-invalid={invalidField === "amount"} required disabled={busy} /></div>
            <label className={styles.fieldLabel} htmlFor={`${formId}-scope`}>What’s included?</label><textarea ref={scopeInput} id={`${formId}-scope`} placeholder="Labour, materials and anything the customer should know…" value={note} onChange={(event) => changeQuoteDraft(amount, event.target.value)} rows={4} maxLength={1000} aria-describedby={`${formId}-scope-help ${formId}-error`} aria-invalid={invalidField === "scope"} required disabled={busy} /><p id={`${formId}-scope-help`} className={styles.fieldHelp}>A clear scope note, 10–1,000 characters.</p>
            <div className={styles.formReward}><Icon name="coin" size={21} /><span>{editing ? "Already earned: 1 point. Edits don’t earn more." : "Save your first quote on this job to earn 1 point."}</span></div>
            <p ref={formErrorElement} tabIndex={-1} id={`${formId}-error`} className={styles.formError} role="alert">{formError}</p><button className={styles.primary} type="submit" disabled={disabled}>{busy ? "Saving quote…" : editing ? "Save changes" : "Save quote + earn 1 point"}<Icon name="arrow" size={18} /></button>
            {draftFailure && <p className={styles.formError} role="status">{draftFailure}</p>}
            <button className={styles.secondary} type="button" onClick={discardQuoteDraft} disabled={busy}>Discard unsent quote</button>
          </form><p className={styles.modalFine}>Preview only. Nothing is sent to the customer.</p>
        </> : modal.kind === "accepted" ? <>
          <h2 ref={acceptedHeading} tabIndex={-1} id={`${formId}-title`}>Quote accepted</h2>
          <div className={styles.dialogJob}><JobPhoto job={modalJob} /><div><span>{modalJob.trade} · {modalJob.suburb}</span><h3>{modalJob.title}</h3></div></div>
          <div className={styles.acceptedSummary}>{modalQuote && <><span>Accepted quote</span><strong>{formatDemoMoney(modalQuote.amountCents)}</strong><p>{modalQuote.note}</p></>}<p>This quote is locked. Unsent edits stay in your draft and do not change the accepted price or scope.</p></div>
          <Link className={styles.secondary} href={detailHref(modalJob.id)}>View job details<Icon name="arrow" size={18} /></Link>
          <p className={styles.modalFine}>Your points balance is unchanged.</p>
        </> : modal.kind === "claim" ? <>
          <h2 id={`${formId}-title`}>{points < CLAIM_COST ? "Not enough points" : "Review claim"}</h2>
          <div className={styles.dialogJob}><JobPhoto job={modalJob} /><div><span>{modalJob.trade} · {modalJob.suburb}</span><h3>{modalJob.title}</h3></div></div>
          <p className={styles.claimDescription}>{modalJob.description}</p><dl className={styles.claimSummary}><div><dt>Fixed price</dt><dd>{formatDemoMoney(modalJob.priceCents!)}</dd></div><div><dt>Your balance</dt><dd>{points} points</dd></div><div><dt>Cost to claim</dt><dd>−5 points</dd></div><div><dt>{points < CLAIM_COST ? "Points needed" : "Balance after claim"}</dt><dd>{points < CLAIM_COST ? CLAIM_COST - points : points - CLAIM_COST} points</dd></div></dl>
          <p className={styles.formError} role="alert">{formError}</p>{points < CLAIM_COST ? <><p className={styles.claimHint}>Each first quote earns 1 point. You’re {CLAIM_COST - points} {CLAIM_COST - points === 1 ? "quote" : "quotes"} away.</p><button className={styles.secondary} onClick={goToFeed}>Quote more jobs<Icon name="arrow" size={18} /></button></> : <button className={styles.primary} onClick={() => void claim()} disabled={disabled}>{busy ? "Saving claim…" : "Confirm claim · 5 points"}<Icon name="arrow" size={18} /></button>}
          <p className={styles.modalFine}>Preview only. No work is booked or customer contacted.</p>
        </> : <div className={styles.success}><span className={styles.successIcon}><Icon name="check" size={36} /></span><h2 ref={successHeading} tabIndex={-1} id={`${formId}-title`}>Job claimed</h2><p>{modalJob.title}</p><div className={styles.successBalance}><Icon name="coin" size={23} /><strong>{points}</strong> points remaining</div><p className={styles.claimHint}>Find this job in Your jobs.</p><button className={styles.secondary} onClick={() => { focusAfterClose.current = true; setModal(null); switchTab("claimed"); }}>View your jobs<Icon name="arrow" size={18} /></button><button className={styles.textButton} onClick={goToFeed}>Keep quoting</button><p className={styles.modalFine}>No real work has been booked.</p></div>}
      </div>}
    </dialog>
  </section>;
}

export default TradieQuoteWorkspace;
