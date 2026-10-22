"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { MessageReadReceipt } from "@/app/messages/MessageReadReceipt";
import { JobPhotoCarousel } from "@/components/job-cards/JobPhotoCarousel";
import { SourceIcon } from "@/components/SourceIcon";
import { formatDemoMoney, type DemoJob } from "@/lib/quote-demo/jobs";
import { CLAIM_COST, getDemoQuoteStatus, getPointsBalance, QuoteDemoError, validateDemoComment, validateQuote, type QuoteDemoState } from "@/lib/quote-demo/model";
import { loadQuoteDemo, saveDemoAcceptance, saveDemoClaim, saveDemoComment, saveDemoCompletion, saveDemoQuote, subscribeQuoteDemo } from "@/lib/quote-demo/storage";
import styles from "./quote-detail.module.css";

function savedDate(value: string) {
  return new Intl.DateTimeFormat("en-NZ", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Pacific/Auckland" }).format(new Date(value));
}

export function QuoteJobDetail({ userId, job, backHref = "/dashboard?quoteView=feed" }: { userId: string; job: DemoJob; backHref?: string }) {
  const [state, setState] = useState<QuoteDemoState | null>(null);
  const [storageFailure, setStorageFailure] = useState<string>("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [scope, setScope] = useState("");
  const [quoteError, setQuoteError] = useState("");
  const [invalidField, setInvalidField] = useState<"amount" | "scope" | null>(null);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<"quote" | "claim" | "complete" | "accept" | "comment" | null>(null);
  const [focusTarget, setFocusTarget] = useState<"comment" | "scope" | "notice" | "error" | "editor" | null>(null);
  const alive = useRef(false);
  const actionLock = useRef(false);
  const amountInput = useRef<HTMLInputElement>(null);
  const scopeInput = useRef<HTMLTextAreaElement>(null);
  const commentInput = useRef<HTMLTextAreaElement>(null);
  const noticeElement = useRef<HTMLParagraphElement>(null);
  const actionErrorElement = useRef<HTMLParagraphElement>(null);
  const editorOpener = useRef<HTMLButtonElement>(null);
  const handledInitialHash = useRef(false);
  const commentRequest = useRef<{ id: string; body: string } | null>(null);
  const formId = useId();
  const quote = state?.quotes.find((item) => item.jobId === job.id);
  const claim = state?.claims.find((item) => item.jobId === job.id);
  const quoteStatus = state ? getDemoQuoteStatus(state, job.id) : undefined;
  const points = state ? getPointsBalance(state) : 0;
  const ownComments = state?.comments.filter((item) => item.jobId === job.id) ?? [];
  const latestCommentId = ownComments.at(-1)?.id ?? job.comments.at(-1)?.id ?? null;
  const disabled = !state || !!storageFailure || busy !== null;

  const applyState = useCallback((next: QuoteDemoState) => {
    if (!alive.current) return;
    setState((current) => !current || next.revision >= current.revision ? next : current);
  }, []);

  const read = useCallback(async () => {
    try {
      const next = await loadQuoteDemo(userId);
      if (!alive.current) return;
      applyState(next); setStorageFailure("");
    } catch (error) {
      if (alive.current) setStorageFailure(error instanceof Error ? error.message : "Your sample data could not be loaded. Please retry.");
    }
  }, [userId, applyState]);

  useEffect(() => {
    alive.current = true;
    void read();
    const unsubscribe = subscribeQuoteDemo(userId, () => void read());
    return () => { alive.current = false; unsubscribe(); };
  }, [userId, read]);

  useEffect(() => { if (editorOpen) amountInput.current?.focus(); }, [editorOpen]);

  // Effects run after React commits the enabled/remounted control. A single
  // animation frame can run before that commit when a storage write resolves.
  useEffect(() => {
    if (busy !== null || !focusTarget) return;
    const target = { comment: commentInput, scope: scopeInput, notice: noticeElement, error: actionErrorElement, editor: editorOpener }[focusTarget].current;
    if (target) { target.focus(); setFocusTarget(null); }
  }, [busy, editorOpen, focusTarget]);

  useEffect(() => {
    if (!state) return;
    const focusDiscussion = () => {
      if (window.location.hash !== "#comments") return;
      requestAnimationFrame(() => {
        document.getElementById("comments")?.scrollIntoView({ block: "start" });
        document.getElementById("comments-heading")?.focus({ preventScroll: true });
      });
    };
    if (!handledInitialHash.current) { focusDiscussion(); handledInitialHash.current = true; }
    window.addEventListener("hashchange", focusDiscussion);
    return () => window.removeEventListener("hashchange", focusDiscussion);
  }, [state]);

  function showNotice(message: string) {
    setNotice(message);
    setFocusTarget("notice");
  }

  function handleStorageFailure(error: unknown) {
    if (error instanceof QuoteDemoError && ["storage-unavailable", "invalid-storage"].includes(error.code)) setStorageFailure(error.message);
  }

  function openEditor() {
    setAmount(quote ? String(quote.amountCents / 100) : ""); setScope(quote?.note ?? "");
    setQuoteError(""); setInvalidField(null); setNotice(""); setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false); setQuoteError(""); setInvalidField(null);
    setFocusTarget("editor");
  }

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || actionLock.current || quoteStatus === "accepted") return;
    try { validateQuote(amount, scope); }
    catch (error) {
      setQuoteError(error instanceof Error ? error.message : "Check your quote and try again.");
      try { validateQuote(amount, "A complete sample scope."); setInvalidField("scope"); scopeInput.current?.focus(); }
      catch { setInvalidField("amount"); amountInput.current?.focus(); }
      return;
    }
    actionLock.current = true; setBusy("quote"); setQuoteError(""); setInvalidField(null);
    try {
      const saved = await saveDemoQuote(userId, job.id, amount, scope);
      if (!alive.current) return;
      applyState(saved.state); setEditorOpen(false);
      showNotice(saved.result.rewarded ? "Quote saved. +1 point added to your balance." : "Quote updated. You already earned your point for this job.");
    } catch (error) {
      if (!alive.current) return;
      handleStorageFailure(error); setQuoteError(error instanceof Error ? error.message : "Your quote could not be saved. Please retry.");
      if (error instanceof QuoteDemoError && error.code === "quote-accepted") await read();
      else setFocusTarget("scope");
    } finally { actionLock.current = false; if (alive.current) setBusy(null); }
  }

  async function runAction(kind: "claim" | "complete" | "accept") {
    if (disabled || actionLock.current) return;
    actionLock.current = true; setBusy(kind); setActionError(""); setNotice("");
    try {
      if (kind === "accept") {
        const saved = await saveDemoAcceptance(userId, job.id);
        if (!alive.current) return;
        applyState(saved.state); setEditorOpen(false);
        showNotice(saved.result.alreadyAccepted ? "Your quote was already accepted in this preview." : "Preview updated: the customer selected your quote. Your quote is now locked and your points are unchanged.");
      } else if (kind === "claim") {
        const saved = await saveDemoClaim(userId, job.id);
        if (!alive.current) return;
        applyState(saved.state);
        showNotice(saved.result.alreadyClaimed ? "You already claimed this sample job. No extra points were spent." : "Sample job claimed. 5 points spent.");
      } else {
        const saved = await saveDemoCompletion(userId, job.id);
        if (!alive.current) return;
        applyState(saved.state); showNotice("Sample job marked complete. Your points are unchanged.");
      }
    } catch (error) {
      if (!alive.current) return;
      handleStorageFailure(error); setActionError(error instanceof Error ? error.message : "This change could not be saved. Please retry.");
      if (error instanceof QuoteDemoError && error.code === "insufficient-points") await read();
      setFocusTarget("error");
    } finally { actionLock.current = false; if (alive.current) setBusy(null); }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || actionLock.current) return;
    let body: string;
    try { body = validateDemoComment(comment); }
    catch (error) { setCommentError(error instanceof Error ? error.message : "Check your comment and try again."); commentInput.current?.focus(); return; }
    actionLock.current = true; setBusy("comment"); setCommentError("");
    try {
      if (!commentRequest.current || commentRequest.current.body !== body) commentRequest.current = { id: crypto.randomUUID(), body };
      const saved = await saveDemoComment(userId, job.id, body, commentRequest.current.id);
      if (!alive.current) return;
      applyState(saved.state); setComment(""); commentRequest.current = null;
      setNotice("Your comment was saved in this account’s sample discussion.");
    } catch (error) {
      if (!alive.current) return;
      handleStorageFailure(error); setCommentError(error instanceof Error ? error.message : "Your comment could not be saved. Please retry.");
    } finally {
      actionLock.current = false;
      if (alive.current) {
        setBusy(null);
        setFocusTarget("comment");
      }
    }
  }

  return <div className={styles.page} data-mode="trade">
    <header className={styles.header}>
      <Link href={backHref} className={styles.back}><SourceIcon name="back" size={18} />Back to jobs</Link>
      <div className={styles.headerRow}><div><p className={styles.eyebrow}>Sample job details</p><p className={styles.headerTitle}>{job.trade} in {job.suburb}</p></div><div className={styles.balance}><span>Your demo points</span><strong>{state ? points : "—"}</strong></div></div>
    </header>

    <div className={styles.content}>
      <p className={styles.demoNote}><span aria-hidden="true" />Sample workspace · Saved on this device for your account</p>
      {!state && !storageFailure && <p className={styles.loading} role="status">Loading your saved quote and points…</p>}
      {storageFailure && <div className={styles.storageError} role="alert"><div><strong>Your sample data needs attention.</strong><p>{storageFailure}</p></div><button type="button" className={styles.outline} onClick={() => void read()} disabled={busy !== null}>Retry storage</button></div>}
      {notice && <p className={styles.notice} role="status" ref={noticeElement} tabIndex={-1}><SourceIcon name="check" size={18} />{notice}</p>}

      <div className={styles.columns}>
        <article className={styles.main}>
          <section className={styles.overview} aria-labelledby="job-title">
            <JobPhotoCarousel photos={job.photos} title={job.title} quoteStatus={quoteStatus} completed={!!claim?.completedAt} />
            <div className={styles.intro}>
              <div className={styles.topline}><span>{job.trade}</span><span>{job.posted}</span></div>
              <h1 id="job-title">{job.title}</h1>
              <p className={styles.location}>{job.suburb}, Auckland · {job.distance} away</p>
              <p className={styles.description}>{job.description}</p>
              <div className={styles.tags}>{job.details.map((detail) => <span key={detail}>{detail}</span>)}</div>
              <p className={styles.photoNote}>{job.photos.length} illustrative stock photos · All people and job details are synthetic.</p>
            </div>
          </section>

          <section className={styles.panel} aria-labelledby="scope-heading"><p className={styles.eyebrow}>The work</p><h2 id="scope-heading">What needs doing</h2><ul className={styles.scopeList}>{job.scope.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className={styles.panel} aria-labelledby="site-heading"><p className={styles.eyebrow}>Before you arrive</p><h2 id="site-heading">The property &amp; access</h2><p className={styles.property}>{job.customer.property}</p><ul className={styles.scopeList}>{job.siteNotes.map((item) => <li key={item}>{item}</li>)}</ul><div className={styles.availability}><h3>Preferred timing</h3><strong>{job.timing}</strong><p>{job.customer.availability}</p></div></section>
          <section className={styles.panel} aria-labelledby="guidance-heading"><p className={styles.eyebrow}>{job.stage === "quoting" ? "A useful quote" : "Before you claim"}</p><h2 id="guidance-heading">{job.stage === "quoting" ? "What to include" : "What the sample price covers"}</h2><ul className={styles.scopeList}>{job.quoteGuidance.map((item) => <li key={item}>{item}</li>)}</ul></section>

          <section className={styles.panel} id="comments" aria-labelledby="comments-heading">
            <MessageReadReceipt userId={userId} jobId={job.id} latestMessageId={latestCommentId} sectionId="comments" />
            <div className={styles.sectionTop}><div><p className={styles.eyebrow}>Ask &amp; clarify</p><h2 id="comments-heading" tabIndex={-1}>Job discussion</h2></div><div className={styles.discussionPrice}><strong>{quote ? `Your quote ${formatDemoMoney(quote.amountCents)}` : job.priceCents ? `Job price ${formatDemoMoney(job.priceCents)}` : "Price pending"}</strong><span>{quoteStatus === "accepted" ? "Your quote accepted" : quoteStatus === "quoted" ? "You have quoted" : claim ? "You claimed this job" : job.stage === "quoting" ? "Open for quotes" : "Available to claim"}</span></div></div>
            <p className={styles.discussionHelp}>Ask about the scope, access or materials. New comments stay in this account’s sample discussion on this device.</p>
            <ol className={styles.discussion}>{job.comments.map((item) => <li key={item.id}><div className={styles.commentMeta}><strong>{item.author}</strong><span>{item.role} · {item.posted}</span></div><p>{item.body}</p></li>)}{ownComments.map((item) => <li className={styles.ownComment} key={item.id}><div className={styles.commentMeta}><strong>You</strong><time dateTime={item.createdAt}>{savedDate(item.createdAt)} NZ time</time></div><p>{item.body}</p><span className={styles.localLabel}>Saved locally</span></li>)}</ol>
            <form className={styles.commentForm} onSubmit={submitComment} noValidate>
              <label htmlFor={`${formId}-comment`}>Add a comment</label>
              <textarea ref={commentInput} id={`${formId}-comment`} value={comment} onChange={(event) => { setComment(event.target.value); setCommentError(""); }} rows={3} maxLength={2000} placeholder="Anything you need to know before quoting?" required aria-invalid={!!commentError} aria-describedby={`${formId}-comment-help ${formId}-comment-error`} disabled={busy === "comment"} />
              <p id={`${formId}-comment-help`} className={styles.fieldHelp}>2–2,000 characters. No message is sent to a real customer.</p>
              <p id={`${formId}-comment-error`} className={styles.error} role="alert">{commentError}</p>
              <button className={styles.outline} type="submit" disabled={disabled}>{busy === "comment" ? "Saving comment…" : "Add comment"}<SourceIcon name="bubble" size={18} /></button>
            </form>
          </section>
        </article>

        <aside className={styles.sidebar} aria-label="Your quote and next steps">
          <section className={styles.actionPanel}>
            <p className={styles.eyebrow}>{quoteStatus === "accepted" ? "The customer chose you" : quote ? "Your saved quote" : claim ? "Your sample claim" : job.stage === "quoting" ? "Put your know-how to work" : "Ready to claim"}</p>
            <h2>{quoteStatus === "accepted" ? "Quote accepted" : quote ? "You’ve quoted this job" : claim ? claim.completedAt ? "Sample job complete" : "You claimed this job" : job.stage === "quoting" ? "Make it your next job" : "A clear scope. A fixed price."}</h2>
            {job.stage === "quoting" ? <>
              {quote ? <div className={styles.quoteSummary}><span>Your quote · NZD</span><strong>{formatDemoMoney(quote.amountCents)}</strong><p>{quote.note}</p><span>Saved {savedDate(quote.updatedAt)} NZ time</span></div> : <p className={styles.actionCopy}>Read the scope, ask any questions and send your sample quote. Your first valid quote earns 1 point.</p>}
              {quoteStatus === "accepted" ? <div className={styles.acceptedNote}><SourceIcon name="check" size={20} /><div><strong>Accepted in this preview</strong><p>This account’s quote is locked at the saved price and scope. Arrange the next steps in the sample discussion.</p></div></div> : editorOpen ? <form className={styles.quoteForm} onSubmit={submitQuote} noValidate>
                <label htmlFor={`${formId}-amount`}>Your quote <span>NZD, including GST if applicable</span></label><div className={styles.amountField}><span>$</span><input ref={amountInput} id={`${formId}-amount`} value={amount} onChange={(event) => { setAmount(event.target.value); setQuoteError(""); setInvalidField(null); }} inputMode="decimal" autoComplete="off" placeholder="0.00" required aria-invalid={invalidField === "amount"} aria-describedby={`${formId}-quote-error`} disabled={busy === "quote"} /></div>
                <label htmlFor={`${formId}-scope`}>What’s included?</label><textarea ref={scopeInput} id={`${formId}-scope`} value={scope} onChange={(event) => { setScope(event.target.value); setQuoteError(""); setInvalidField(null); }} rows={5} maxLength={1000} placeholder="Labour, materials, timing and any assumptions…" required aria-invalid={invalidField === "scope"} aria-describedby={`${formId}-scope-help ${formId}-quote-error`} disabled={busy === "quote"} /><p id={`${formId}-scope-help`} className={styles.fieldHelp}>A clear scope note, 10–1,000 characters.</p>
                <p id={`${formId}-quote-error`} className={styles.error} role="alert">{quoteError}</p><button className={styles.primary} type="submit" disabled={disabled}>{busy === "quote" ? "Saving quote…" : quote ? "Save quote changes" : "Quote · +1 point"}</button><button className={styles.outline} type="button" onClick={closeEditor} disabled={busy !== null}>Cancel</button>
              </form> : <button ref={editorOpener} className={quote ? styles.outline : styles.primary} type="button" onClick={openEditor} disabled={disabled}>{quote ? "Edit your quote" : "Quote · +1 point"}</button>}
              {quote && <p className={styles.rewardNote}>1 point earned for this quote. Edits and acceptance keep your balance the same.</p>}
            </> : <>
              <div className={styles.price}><span>Sample fixed price</span><strong>{formatDemoMoney(job.priceCents!)}</strong></div>
              {claim ? <><p className={styles.actionCopy}>{claim.completedAt ? "You marked this sample job complete. No real work or payment is recorded." : "You spent 5 points to claim this sample job. Use the discussion to try planning the visit."}</p>{!claim.completedAt && <button className={styles.outline} type="button" onClick={() => void runAction("complete")} disabled={disabled}>{busy === "complete" ? "Saving…" : "Complete sample job"}</button>}</> : <><dl className={styles.claimSummary}><div><dt>Your balance</dt><dd>{state ? points : "—"} points</dd></div><div><dt>Cost to claim</dt><dd>5 points</dd></div><div><dt>{points >= CLAIM_COST ? "Balance after claim" : "More points needed"}</dt><dd>{state ? points >= CLAIM_COST ? points - CLAIM_COST : CLAIM_COST - points : "—"} points</dd></div></dl>{state && points < CLAIM_COST ? <><p className={styles.actionCopy}>Each first quote earns 1 point. Earn {CLAIM_COST - points} more to claim this sample job.</p><Link className={styles.outline} href="/dashboard?quoteView=feed">Quote more jobs</Link></> : <button className={styles.primary} type="button" onClick={() => void runAction("claim")} disabled={disabled}>{busy === "claim" ? "Saving claim…" : "Claim · 5 points"}</button>}</>}
            </>}
            <p className={styles.error} ref={actionErrorElement} tabIndex={-1} role="alert">{actionError}</p>
            <a className={styles.outline} href="#comments"><SourceIcon name="bubble" size={18} />Open job discussion</a>
            <p className={styles.finePrint}>Sample quotes and claims stay on this device. No real booking, payment or customer contact is created.</p>
          </section>

          <section className={styles.customerPanel}><span className={styles.avatar} aria-hidden="true">{job.customer.name.charAt(0)}</span><div><p className={styles.eyebrow}>Posted by</p><h2>{job.customer.name}</h2><p>Sample customer · {job.suburb}</p></div></section>
          {job.stage === "quoting" && <details className={styles.previewControls}><summary>Preview controls</summary><p>Simulate this customer selecting <strong>your account’s saved quote</strong>. This only changes your local sample state. It locks this quote and adds no points.</p><button type="button" className={styles.outline} disabled={disabled || !quote || quoteStatus === "accepted"} onClick={() => void runAction("accept")}>{busy === "accept" ? "Saving preview…" : quoteStatus === "accepted" ? "Your quote is accepted" : "Simulate customer accepting my quote"}</button>{!quote && <p>Save a quote first to try this transition.</p>}</details>}
        </aside>
      </div>
    </div>
  </div>;
}
