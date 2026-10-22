"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { JobCardFrame } from "@/components/job-cards/JobCardFrame";
import { JobPhotoCarousel } from "@/components/job-cards/JobPhotoCarousel";
import cardStyles from "@/components/job-cards/job-card.module.css";
import {
  CUSTOMER_TRADES, CustomerPreviewError, acceptCustomerSamplePrice, customerPreviewJobs, customerPreviewKey,
  emptyCustomerDraft, initialCustomerPreview, mergeCustomerDraft, postCustomerSampleJob, readCustomerPreview, updateCustomerDraft, validateCustomerDraft,
  type CustomerDraft, type CustomerPreviewState, type CustomerSampleJob,
} from "@/lib/workspace-mode/customer-model";
import styles from "./customer-workspace.module.css";

type View = "jobs" | "post";
type Filter = "all" | "action" | "active" | "complete";
type Attachment = { name: string; url: string };
type Detail = { jobId: string; review: boolean } | null;
const money = (cents: number) => new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD", maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
const stageLabels = { waiting: "Waiting for a quote", priced: "Price ready", underway: "Getting underway", complete: "Completed" };

function Arrow() { return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>; }

/** This hiring preview never reads backend jobs or changes the signed-in role. */
export function DemoCustomerWorkspace({ userId }: { userId: string; initialView?: View }) {
  const searchParams = useSearchParams();
  const view: View = searchParams.get("customerView") === "post" ? "post" : "jobs";
  const [state, setState] = useState<CustomerPreviewState | null>(null);
  const [draft, setDraft] = useState<CustomerDraft>(emptyCustomerDraft);
  const [filter, setFilter] = useState<Filter>("all");
  const [detail, setDetail] = useState<Detail>(null);
  const [reviewDraft, setReviewDraft] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [jobPhotos, setJobPhotos] = useState<Record<string, Attachment[]>>({});
  const [storageError, setStorageError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [acceptedNotice, setAcceptedNotice] = useState("");
  const [reattach, setReattach] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const lastDetailJob = useRef<string | null>(null);
  const actionButtons = useRef(new Map<string, HTMLButtonElement>());
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const composerHeading = useRef<HTMLHeadingElement>(null);
  const jobsHeading = useRef<HTMLHeadingElement>(null);
  const liveUrls = useRef(new Set<string>());
  const retainedUrls = useRef(new Set<string>());
  const focusViewAfterChange = useRef(false);
  const focusReviewAfterChange = useRef(false);
  const id = useId();
  const activeState = state?.userId === userId ? state : null;
  const jobs = useMemo(() => activeState ? customerPreviewJobs(activeState) : [], [activeState]);
  const visible = jobs.filter((job) => filter === "all" || (filter === "action" ? job.stage === "priced" : filter === "active" ? job.stage !== "complete" : job.stage === "complete"));
  const currentJob = detail ? jobs.find((job) => job.id === detail.jobId) : undefined;

  function load() {
    try {
      const loaded = readCustomerPreview(localStorage.getItem(customerPreviewKey(userId)), userId);
      setState(loaded); setDraft(loaded.draft); setReattach(loaded.draft.photoNames.length > 0); setStorageError("");
    } catch (error) { setState(null); setStorageError(error instanceof Error ? error.message : "This browser could not open your customer sample."); }
  }

  useEffect(() => {
    setDetail(null); setNotice(""); setAcceptedNotice(""); setAttachments([]); setJobPhotos({}); setReviewDraft(false);
    try {
      const loaded = readCustomerPreview(localStorage.getItem(customerPreviewKey(userId)), userId);
      setState(loaded); setDraft(loaded.draft); setReattach(loaded.draft.photoNames.length > 0); setStorageError("");
    } catch (error) { setState(null); setDraft(emptyCustomerDraft()); setStorageError(error instanceof Error ? error.message : "This browser could not open your customer sample."); }
    const urls = liveUrls.current;
    const retained = retainedUrls.current;
    return () => { urls.forEach((url) => URL.revokeObjectURL(url)); urls.clear(); retained.clear(); };
  }, [userId]);

  useEffect(() => {
    setReviewDraft(false);
    if (focusViewAfterChange.current) {
      focusViewAfterChange.current = false;
      (view === "post" ? composerHeading.current : jobsHeading.current)?.focus();
    }
  }, [view]);

  const openJob = useCallback((job: CustomerSampleJob, review: boolean, trigger?: HTMLElement) => {
    opener.current = trigger ?? null; lastDetailJob.current = job.id; setAcceptedNotice(""); setFormError(""); setDetail({ jobId: job.id, review });
  }, []);

  useEffect(() => {
    if (focusReviewAfterChange.current && view === "post") {
      composerHeading.current?.focus();
      focusReviewAfterChange.current = false;
    }
  }, [reviewDraft, view]);

  useEffect(() => {
    const node = dialog.current;
    if (detail && node && !node.open) node.showModal();
    if (detail) detailHeading.current?.focus();
    if (!detail && node?.open) {
      node.close();
      const target = opener.current?.isConnected ? opener.current : actionButtons.current.get(lastDetailJob.current ?? "");
      target?.focus();
    }
  }, [detail]);

  function write(next: CustomerPreviewState) {
    localStorage.setItem(customerPreviewKey(userId), JSON.stringify(next));
    setState(next); setStorageError("");
  }

  function changeView(next: View) {
    focusViewAfterChange.current = true;
    setReviewDraft(false); setFormError("");
    const url = new URL(window.location.href);
    if (next === "post") url.searchParams.set("customerView", "post"); else url.searchParams.delete("customerView");
    // Let Next synchronize useSearchParams instead of bypassing its history
    // integration by forwarding the framework's internal state object.
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function saveDraft(next: CustomerDraft) {
    setDraft(next); setFormError("");
    if (!activeState) return;
    try { write(mergeCustomerDraft(localStorage.getItem(customerPreviewKey(userId)), userId, next)); }
    catch { setStorageError("Your latest text could not be saved in this browser. Keep a copy before leaving or changing mode."); }
  }

  function acceptPrice() {
    if (!activeState || !currentJob || currentJob.stage !== "priced") return;
    try {
      const latest = readCustomerPreview(localStorage.getItem(customerPreviewKey(userId)), userId);
      const saved = acceptCustomerSamplePrice(latest, currentJob.id);
      write(saved.state); setAcceptedNotice("Sample price accepted. No booking or payment was made.");
      setDetail({ jobId: currentJob.id, review: false });
    } catch (error) { setFormError(error instanceof Error ? error.message : "Your sample acceptance could not be saved. Please retry."); }
  }

  function selectPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const error = files.length > 6 ? "Choose up to 6 photos." : files.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024 || file.name.length > 160) ? "Choose JPG, PNG or WebP photos up to 5 MiB each, with file names under 160 characters." : "";
    if (error) { event.target.value = ""; setFormError(error); return; }
    attachments.forEach(({ url }) => { if (!retainedUrls.current.has(url)) { URL.revokeObjectURL(url); liveUrls.current.delete(url); } });
    const next = files.map((file) => { const url = URL.createObjectURL(file); liveUrls.current.add(url); return { name: file.name, url }; });
    setAttachments(next); setReattach(false); saveDraft({ ...draft, photoNames: files.map((file) => file.name) });
  }

  function reviewPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormError("");
    try {
      validateCustomerDraft(draft);
      if (draft.photoNames.length && attachments.length !== draft.photoNames.length) throw new CustomerPreviewError("invalid-draft", "Reattach your photos, or continue without them, before reviewing.");
      focusReviewAfterChange.current = true; setReviewDraft(true);
    } catch (error) { setFormError(error instanceof Error ? error.message : "Check your job details."); }
  }

  function postSample() {
    if (!activeState) return;
    try {
      const latest = readCustomerPreview(localStorage.getItem(customerPreviewKey(userId)), userId);
      const next = postCustomerSampleJob(updateCustomerDraft(latest, draft), `customer-local-${crypto.randomUUID()}`);
      write(next);
      const posted = next.posted[next.posted.length - 1];
      attachments.forEach(({ url }) => retainedUrls.current.add(url));
      setJobPhotos((photos) => ({ ...photos, [posted.id]: attachments }));
      setAttachments([]); setDraft(next.draft); setReattach(false); setFilter("all"); changeView("jobs");
      setNotice("Sample job added. Nothing has been sent to a tradie.");
    } catch (error) { setFormError(error instanceof Error ? error.message : "Your sample job could not be saved. Your draft is still here."); }
  }

  function resetSample() {
    try { const next = initialCustomerPreview(userId); write(next); setDraft(next.draft); setNotice("This account’s customer sample has been reset."); }
    catch { setStorageError("This browser cannot save the customer sample. Retry when storage is available."); }
  }

  return <section className={styles.workspace} data-mode="customer" aria-label="Customer sample workspace">
    <p className={styles.sampleLine}>SAMPLE WORKSPACE <span>{storageError ? "Not saved" : activeState ? "Saved in this browser" : "Opening…"}</span></p>
    {storageError && <div className={styles.error} role="alert"><p>{storageError}</p>{!activeState && <div className={styles.buttons}><button className={cardStyles.secondaryAction} onClick={load}>Retry storage</button><button className={cardStyles.secondaryAction} onClick={resetSample}>Reset customer sample</button></div>}</div>}
    {notice && <p className={styles.notice} role="status">{notice}</p>}
    {!activeState ? !storageError && <p role="status" className={styles.loading}>Opening your customer workspace…</p> : view === "jobs" ? <>
      <div className={styles.toolbar}><h2 ref={jobsHeading} tabIndex={-1}>Your jobs</h2><button className={cardStyles.secondaryAction} onClick={() => changeView("post")}><span aria-hidden="true">＋</span>Post a job</button></div>
      <div className={styles.filters}><label htmlFor={`${id}-filter`}>Show jobs<select id={`${id}-filter`} value={filter} onChange={(event) => setFilter(event.target.value as Filter)}><option value="all">All jobs</option><option value="action">Needs your action</option><option value="active">In progress</option><option value="complete">Completed</option></select></label><span role="status">{visible.length} of {jobs.length} jobs</span></div>
      <div className={cardStyles.grid}>{visible.map((job) => <JobCardFrame key={job.id} title={job.title} href={`#${job.id}`} photos={jobPhotos[job.id]?.map((photo) => ({ url: photo.url, alt: photo.name })) ?? job.photos} onOpen={(trigger) => openJob(job, false, trigger)}
        headingLevel={3} completed={job.stage === "complete"} quoteStatus={job.stage === "underway" ? "accepted" : undefined}
        meta={<span>{job.trade} · {job.suburb}</span>} status={<><span className={cardStyles.statusDot} /><span>{stageLabels[job.stage]}</span></>}
        valueLabel="Sample fixed price" value={job.priceCents === undefined ? "Pending" : money(job.priceCents)}
        actions={<button ref={(node) => { if (node) actionButtons.current.set(job.id, node); else actionButtons.current.delete(job.id); }} className={cardStyles.secondaryAction} onClick={(event) => openJob(job, job.stage === "priced", event.currentTarget)}>{job.stage === "priced" ? "Accept price" : "View job"}<Arrow /></button>} />)}</div>
      {!visible.length && <div className={styles.empty}><h3>No jobs in this view.</h3><button className={cardStyles.secondaryAction} onClick={() => setFilter("all")}>Show all jobs</button></div>}
    </> : <section className={styles.composer} aria-label="Post a sample job">
      <button className={cardStyles.secondaryAction} onClick={() => changeView("jobs")}>Back to your jobs</button>
      <h2 ref={composerHeading} tabIndex={-1}>{reviewDraft ? "Review your sample job" : "Post a job"}</h2><p className={styles.helper}>{reviewDraft ? "This saves a sample job in your browser. No request is sent and no payment is made." : "Text saves as you type. Photos are previewed for this visit and need reattaching after you leave or change mode."}</p>
      <form onSubmit={reviewPost}>
        {!reviewDraft ? <>
          <label htmlFor={`${id}-title`}>Job title<input id={`${id}-title`} value={draft.title} onChange={(event) => saveDraft({ ...draft, title: event.target.value })} minLength={5} maxLength={80} required placeholder="e.g. Replace our kitchen pendant lights" /></label>
          <label htmlFor={`${id}-trade`}>Trade<select id={`${id}-trade`} value={draft.trade} onChange={(event) => saveDraft({ ...draft, trade: event.target.value as CustomerDraft["trade"] })}>{CUSTOMER_TRADES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label htmlFor={`${id}-description`}>What needs doing?<textarea id={`${id}-description`} value={draft.description} onChange={(event) => saveDraft({ ...draft, description: event.target.value })} minLength={20} maxLength={4000} rows={5} required placeholder="Include the work, materials and anything useful about access." /></label>
          <div className={styles.fields}><label htmlFor={`${id}-suburb`}>Suburb / town<input id={`${id}-suburb`} value={draft.suburb} onChange={(event) => saveDraft({ ...draft, suburb: event.target.value })} minLength={2} maxLength={60} required /></label><label htmlFor={`${id}-timing`}>When would you like it done?<select id={`${id}-timing`} value={draft.timing} onChange={(event) => saveDraft({ ...draft, timing: event.target.value })}><option>Flexible</option><option>This week</option><option>Next week</option><option>Next 2 weeks</option></select></label></div>
          <label htmlFor={`${id}-photos`}>Photos <span className={styles.optional}>(optional)</span><input id={`${id}-photos`} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectPhotos} aria-describedby={`${id}-photo-help`} /></label><p className={styles.helper} id={`${id}-photo-help`}>Up to 6 photos · JPG, PNG or WebP · 5 MiB each. Files are never uploaded.</p>
          {reattach && draft.photoNames.length > 0 && <div className={styles.reattach}><p>Draft restored. Reattach {draft.photoNames.length} photo{draft.photoNames.length === 1 ? "" : "s"}: {draft.photoNames.join(", ")}</p><button type="button" className={cardStyles.secondaryAction} onClick={() => { setReattach(false); saveDraft({ ...draft, photoNames: [] }); }}>Continue without photos</button></div>}
        </> : <div className={styles.review}><h3>{draft.title}</h3><p>{draft.description}</p><dl><div><dt>Trade</dt><dd>{draft.trade}</dd></div><div><dt>Location</dt><dd>{draft.suburb}</dd></div><div><dt>Timing</dt><dd>{draft.timing}</dd></div><div><dt>Photos this visit</dt><dd>{attachments.length}</dd></div></dl></div>}
        {attachments.length > 0 && <div className={styles.previews}>{attachments.map((photo) => <figure key={photo.url}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt={`Preview: ${photo.name}`} /><figcaption>{photo.name}</figcaption>
        </figure>)}</div>}
        {formError && <p className={styles.formError} role="alert">{formError}</p>}
        <div className={styles.buttons}>{reviewDraft ? <><button type="button" className={cardStyles.secondaryAction} onClick={() => { focusReviewAfterChange.current = true; setReviewDraft(false); }}>Edit details</button><button type="button" className={cardStyles.primaryAction} onClick={postSample}>Add sample job<Arrow /></button></> : <button type="submit" className={cardStyles.secondaryAction}>Review job<Arrow /></button>}</div>
      </form>
    </section>}

    <dialog ref={dialog} className={styles.dialog} aria-labelledby={`${id}-detail-title`} onCancel={(event) => { event.preventDefault(); setDetail(null); }} onClick={(event) => { if (event.target === event.currentTarget) setDetail(null); }}>
      {currentJob && <div className={styles.dialogInner}>
        <div className={styles.dialogTop}><span className={styles.sampleTag}>Sample job</span><button className={styles.close} aria-label="Close job details" onClick={() => setDetail(null)}>×</button></div>
        <h2 ref={detailHeading} tabIndex={-1} id={`${id}-detail-title`}>{detail?.review ? "Review this price" : currentJob.title}</h2>
        <JobPhotoCarousel key={currentJob.id} title={currentJob.title} photos={jobPhotos[currentJob.id]?.map((photo) => ({ url: photo.url, alt: photo.name })) ?? currentJob.photos} completed={currentJob.stage === "complete"} quoteStatus={currentJob.stage === "underway" ? "accepted" : undefined} />
        {detail?.review && <h3 className={styles.reviewTitle}>{currentJob.title}</h3>}
        <p className={styles.description}>{currentJob.description}</p>
        <dl className={styles.details}><div><dt>Status</dt><dd>{stageLabels[currentJob.stage]}</dd></div><div><dt>Trade</dt><dd>{currentJob.trade}</dd></div><div><dt>Location</dt><dd>{currentJob.suburb}</dd></div><div><dt>Timing</dt><dd>{currentJob.timing}</dd></div><div><dt>Sample fixed price</dt><dd>{currentJob.priceCents === undefined ? "Pending" : money(currentJob.priceCents)}</dd></div></dl>
        {!!currentJob.photoNames?.length && !jobPhotos[currentJob.id]?.length && <p className={styles.helper}>Photo files are not kept between visits. The text of your sample job is saved.</p>}
        {acceptedNotice && <p className={styles.notice} role="status">{acceptedNotice}</p>}
        {formError && <p className={styles.formError} role="alert">{formError}</p>}
        {currentJob.stage === "priced" ? detail?.review ? <><p className={styles.helper}>Accepting changes this sample to price accepted. It does not book a tradie or make a payment.</p><div className={styles.buttons}><button className={cardStyles.secondaryAction} onClick={() => { setFormError(""); setDetail({ jobId: currentJob.id, review: false }); }}>Back to job</button><button className={cardStyles.primaryAction} onClick={acceptPrice}>Accept sample price<Arrow /></button></div></> : <button className={cardStyles.secondaryAction} onClick={() => setDetail({ jobId: currentJob.id, review: true })}>Accept price<Arrow /></button> : <button className={cardStyles.secondaryAction} onClick={() => setDetail(null)}>Back to your jobs</button>}
      </div>}
    </dialog>
  </section>;
}

export default DemoCustomerWorkspace;
