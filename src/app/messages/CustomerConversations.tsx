"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { formatNZD } from "@/lib/constants";
import { activeJobsFirst } from "@/lib/job-presentation";
import { CustomerPreviewError, customerConversationHref, customerJobFilter, customerJobSelection, customerPreviewJobs, customerPreviewKey, customerStageLabel, customerWorkspaceHref, readCustomerPreview, type CustomerPreviewState, type CustomerSampleJob } from "@/lib/workspace-mode/customer-model";
import {
  CUSTOMER_MESSAGE_LENGTH, CustomerMessagesError, addCustomerMessage, customerConversationMessages, customerConversationUnread, customerMessagesKey,
  markCustomerConversation, readCustomerMessages, updateCustomerMessageDraft, type CustomerMessagesState,
} from "@/lib/workspace-mode/customer-messages";
import shared from "./messages.module.css";
import styles from "./customer-conversations.module.css";

type Snapshot = { workspace: CustomerPreviewState; messages: CustomerMessagesState };
const priceLabel = (job: CustomerSampleJob) => job.priceCents === undefined ? "Price pending" : `Fixed price ${formatNZD(job.priceCents)}`;

/** Mounted only for an eligible tradie viewing the synthetic Customer workspace. */
export function CustomerConversations({ userId }: { userId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedJobId = searchParams.get("customerJob");
  const filter = customerJobFilter(searchParams.get("customerFilter"));
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [storageError, setStorageError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [failedPhotos, setFailedPhotos] = useState<string[]>([]);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const inboxHeading = useRef<HTMLHeadingElement>(null);
  const unavailableMessage = useRef<HTMLParagraphElement>(null);
  const restoreRowFocus = useRef<string | null>(null);
  const previousSelection = useRef<string | null>(null);
  const rowButtons = useRef(new Map<string, HTMLButtonElement>());
  const pendingMessage = useRef<{ jobId: string; body: string; id: string } | null>(null);
  const id = useId();
  const active = snapshot?.messages.userId === userId ? snapshot : null;
  const jobs = useMemo(() => active ? customerPreviewJobs(active.workspace) : [], [active]);
  const selected = customerJobSelection(jobs, requestedJobId);
  const selectedId = selected?.id ?? null;
  const loaded = !!active;
  const messages = active && selected ? customerConversationMessages(active.messages, selected) : [];
  const orderedJobs = activeJobsFirst([...jobs].sort((a, b) => {
    const latest = (job: CustomerSampleJob) => Date.parse(active?.messages.messages.filter((message) => message.jobId === job.id).at(-1)?.createdAt ?? "") || 0;
    return latest(b) - latest(a);
  }), (job) => job.stage === "complete");

  const load = useCallback(() => {
    try {
      const workspace = readCustomerPreview(localStorage.getItem(customerPreviewKey(userId)), userId);
      const messages = readCustomerMessages(localStorage.getItem(customerMessagesKey(userId)), userId, customerPreviewJobs(workspace));
      setSnapshot({ workspace, messages }); setDrafts(messages.drafts); setStorageError("");
    } catch (error) { setSnapshot(null); setStorageError(error instanceof CustomerMessagesError || error instanceof CustomerPreviewError ? error.message : "This browser could not open your conversations. Retry when browser storage is available."); }
  }, [userId]);

  useEffect(() => { setDrafts({}); setFormError(""); setNotice(""); pendingMessage.current = null; load(); }, [load]);

  const persist = useCallback((transition: (current: CustomerMessagesState, jobs: CustomerSampleJob[]) => CustomerMessagesState) => {
    // Re-read before each edit so a draft/read action cannot overwrite messages
    // saved since this component mounted, or reintroduce a removed sample job.
    const workspace = readCustomerPreview(localStorage.getItem(customerPreviewKey(userId)), userId);
    const latestJobs = customerPreviewJobs(workspace);
    const current = readCustomerMessages(localStorage.getItem(customerMessagesKey(userId)), userId, latestJobs);
    const next = transition(current, latestJobs);
    localStorage.setItem(customerMessagesKey(userId), JSON.stringify(next));
    setSnapshot({ workspace, messages: next }); setStorageError("");
  }, [userId]);

  useEffect(() => {
    const previousId = previousSelection.current;
    previousSelection.current = selectedId;
    setFormError(""); setNotice("");
    if (selectedId) {
      detailHeading.current?.focus();
      try { persist((current, latestJobs) => markCustomerConversation(current, latestJobs, selectedId, false)); }
      catch { setStorageError("This browser could not save read status. Your messages are still available below."); }
    } else if (requestedJobId === null) {
      const returnId = restoreRowFocus.current ?? previousId;
      restoreRowFocus.current = null;
      if (returnId) {
        // Browser Back does not call close(). Wait until the selected-view
        // class has been removed so the mobile inbox row is visible again.
        const frame = requestAnimationFrame(() => { (rowButtons.current.get(returnId) ?? inboxHeading.current)?.focus(); });
        return () => cancelAnimationFrame(frame);
      }
    }
  }, [persist, requestedJobId, selectedId]);

  useEffect(() => {
    if (loaded && requestedJobId !== null && !selectedId) unavailableMessage.current?.focus();
  }, [loaded, requestedJobId, selectedId]);

  function mark(job: CustomerSampleJob, unread: boolean) {
    try {
      persist((current, latestJobs) => markCustomerConversation(current, latestJobs, job.id, unread));
      setNotice(`${job.title} marked as ${unread ? "unread" : "read"} on this device.`);
    } catch { setStorageError("This browser could not save read status. Your messages are still available below."); }
  }

  function open(job: CustomerSampleJob) {
    setFormError(""); setNotice("");
    if (selectedId === job.id) { mark(job, false); detailHeading.current?.focus(); }
    else router.push(customerConversationHref(job.id, filter), { scroll: false });
  }

  function close() {
    restoreRowFocus.current = selectedId;
    setFormError(""); setNotice("");
    router.push(customerConversationHref(null, filter), { scroll: false });
  }

  function changeDraft(jobId: string, body: string) {
    setDrafts((current) => ({ ...current, [jobId]: body })); setFormError(""); setNotice("");
    try { persist((current, latestJobs) => updateCustomerMessageDraft(current, latestJobs, jobId, body)); }
    catch { setStorageError("Your latest draft could not be saved. Keep a copy before leaving or changing mode."); }
  }

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const body = drafts[selected.id] ?? "";
    try {
      if (pendingMessage.current?.jobId !== selected.id || pendingMessage.current.body !== body) pendingMessage.current = { jobId: selected.id, body, id: `customer-message-${crypto.randomUUID()}` };
      const messageId = pendingMessage.current.id;
      persist((current, latestJobs) => addCustomerMessage(current, latestJobs, selected.id, messageId, body));
      setDrafts((current) => ({ ...current, [selected.id]: "" })); setFormError("");
      setNotice("Message saved on this device. Nothing was sent to a recipient."); pendingMessage.current = null;
    } catch (error) { setFormError(error instanceof CustomerMessagesError || error instanceof CustomerPreviewError ? error.message : "This browser could not save the message. Your draft is still here."); }
  }

  return <section className={styles.workspace} data-mode="customer" aria-labelledby={`${id}-heading`}>
    <div className={styles.sectionHeader}><h2 ref={inboxHeading} tabIndex={-1} id={`${id}-heading`}>Your conversations</h2><Link href="/dashboard">Your jobs <span aria-hidden="true">↗</span></Link></div>
    {storageError && <div className={styles.error} role="alert"><p>{storageError}</p>{!active && <button type="button" className={styles.secondary} onClick={load}>Retry storage</button>}</div>}
    {active && requestedJobId !== null && !selected && <div className={styles.error} role="status"><p ref={unavailableMessage} tabIndex={-1}>This conversation is unavailable in this account’s customer workspace. Choose another conversation or return to your jobs.</p><Link href={customerConversationHref(null, filter)} className={styles.secondary} onClick={() => { restoreRowFocus.current = requestedJobId; }}>Show all conversations</Link></div>}
    {!active ? !storageError && <p role="status" className={styles.helper}>Opening saved conversations…</p> : <div className={`${styles.layout} ${selected ? styles.hasDetail : ""}`}>
      <ul className={`${shared.list} ${styles.list}`} aria-label="Customer conversations">
        {orderedJobs.map((job) => {
          const latest = customerConversationMessages(active.messages, job).at(-1);
          const unread = customerConversationUnread(active.messages, job);
          const readState = !latest ? "No messages" : unread ? "Unread" : "Read";
          const photo = job.photos[0]?.url;
          return <li key={job.id} className={`${shared.conversation} ${unread ? shared.unread : shared.read} ${selectedId === job.id ? styles.selected : ""}`}>
            <button ref={(node) => { if (node) rowButtons.current.set(job.id, node); else rowButtons.current.delete(job.id); }} type="button" className={`${shared.open} ${styles.open}`} aria-expanded={selectedId === job.id} aria-controls={`${id}-detail`} aria-label={`${job.title}. ${readState}. ${customerStageLabel(job)}. ${priceLabel(job)}. Open conversation.`} onClick={() => open(job)}>
              <span className={`${shared.photo} ${styles.thumbnail} ${job.stage === "complete" ? shared.completedPhoto : job.stage === "underway" ? shared.acceptedPhoto : ""}`} aria-hidden="true">
                {photo && !failedPhotos.includes(photo) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt="" onError={() => setFailedPhotos((current) => [...current, photo])} />
                ) : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 3-3 6 6" /></svg>}
              </span>
              <span className={shared.content}><span className={`${shared.title} ${styles.jobTitle}`}>{job.title}</span><span className={shared.preview}>{latest ? `${latest.senderName}: ${latest.body}` : "No messages yet. Add a note about your job."}</span>
                <span className={shared.metadata}><span className={`${shared.readState} ${unread ? shared.unreadState : ""}`}>{unread && <span className={shared.dot} aria-hidden="true" />}{readState}</span>{job.stage === "complete" && <span className={`${shared.quoteState} ${shared.completedState}`}>COMPLETE</span>}{!!drafts[job.id] && <span className={styles.draftBadge}>Draft</span>}<span className={shared.reference}>{job.trade} · {job.suburb}</span><span className={shared.price}>{priceLabel(job)}</span></span>
              </span><span className={shared.chevron} aria-hidden="true">›</span>
            </button>
            <div className={shared.conversationActions}><button type="button" className={shared.markRead} disabled={!latest} onClick={() => mark(job, !unread)} aria-label={`Mark ${job.title} as ${unread ? "read" : "unread"}`}>Mark as {unread ? "read" : "unread"}</button></div>
          </li>;
        })}
      </ul>
      <div id={`${id}-detail`} className={styles.detailSlot}>
        {selected ? <section className={styles.detail} aria-labelledby={`${id}-detail-heading`}>
          <div className={styles.returnLinks}><button type="button" className={styles.back} onClick={close}><span aria-hidden="true">←</span> Back to conversations</button><Link href={customerWorkspaceHref(selected.id, filter)} className={`${styles.secondary} ${styles.jobLink}`}>Back to this job <span aria-hidden="true">↗</span></Link></div>
          <h3 id={`${id}-detail-heading`} ref={detailHeading} tabIndex={-1}>{selected.title}</h3>
          <p className={styles.price}>{priceLabel(selected)}</p>
          <details className={styles.jobDetails}><summary>Job details <span>{customerStageLabel(selected)}</span></summary><p>{selected.description}</p><dl><div><dt>Trade</dt><dd>{selected.trade}</dd></div><div><dt>Location</dt><dd>{selected.suburb}</dd></div><div><dt>Timing</dt><dd>{selected.timing}</dd></div></dl></details>
          <ol className={styles.messages} aria-label={`Messages about ${selected.title}`}>
            {messages.map((message) => <li key={message.id} className={message.sender === "you" ? styles.mine : styles.sample}><p className={styles.sender}>{message.senderName}</p><p className={styles.body}>{message.body}</p>{message.sender === "you" && <p className={styles.saved}><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString("en-NZ", { dateStyle: "medium", timeStyle: "short" })}</time></p>}</li>)}
          </ol>
          {!messages.length && <p className={styles.helper}>No messages yet.</p>}
          <form className={styles.composer} onSubmit={send}>
            <label htmlFor={`${id}-message`}>Your message</label><textarea id={`${id}-message`} value={drafts[selected.id] ?? ""} onChange={(event) => changeDraft(selected.id, event.target.value)} maxLength={CUSTOMER_MESSAGE_LENGTH} rows={4} required aria-describedby={`${id}-message-help${formError ? ` ${id}-message-error` : ""}`} />
            <p id={`${id}-message-help`} className={styles.helper}>Messages stay on this device.</p>
            {formError && <p id={`${id}-message-error`} className={styles.error} role="alert">{formError}</p>}
            <button type="submit" className={styles.primary}>Save message <span aria-hidden="true">↗</span></button>
          </form>
        </section> : <p className={styles.placeholder}>Open a conversation to view the job and add a message.</p>}
      </div>
    </div>}
    <p className={styles.notice} role="status" aria-live="polite">{notice}</p>
  </section>;
}
