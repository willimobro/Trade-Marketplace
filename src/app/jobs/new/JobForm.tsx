"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { createJob } from "@/app/actions/jobs";
import { FormMessage } from "@/components/ui";
import styles from "./post-job.module.css";
import { clearJobDraft, DRAFT_FIELDS, readJobDraft, saveJobDraft } from "./job-draft";
import { CATEGORY_NAMES, REGIONS } from "@/lib/constants";

export function JobForm({ defaultRegion, userId }: { defaultRegion: string; userId: string }) {
  const submissionInFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [draftNotice, setDraftNotice] = useState("");
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const persist = (reviewed: boolean, submitted = false) => {
    if (!formRef.current) return;
    try { saveJobDraft(userId, formRef.current, reviewed, submitted); }
    catch { setStorageUnavailable(true); }
  };
  const [state, action, pending] = useActionState(createJob, undefined);
  useEffect(() => { if (!pending && !state?.jobId) submissionInFlight.current = false; }, [pending, state]);
  useEffect(() => {
    if (!state?.jobId) return;
    // The server has confirmed persistence. Never clear on a login redirect.
    try { clearJobDraft(userId); } catch { /* Storage failure must not hide a saved job. */ }
    window.location.assign(`/jobs/${encodeURIComponent(state.jobId)}`);
  }, [state?.jobId, userId]);
  const [fontsUnavailable, setFontsUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.all([
      document.fonts.load('760 18px "Trade Display"'),
      document.fonts.load('400 16px "Trade UI"'),
    ]).then((faces) => {
      if (active && faces.some((loaded) => loaded.length === 0 || loaded.some((face) => face.status !== "loaded"))) setFontsUnavailable(true);
    }).catch(() => { if (active) setFontsUnavailable(true); });
    return () => { active = false; };
  }, []);
  const [previews, setPreviews] = useState<string[]>([]);

  const [review, setReview] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    try {
      const draft = readJobDraft(userId);
      if (!draft || !formRef.current) return;
      for (const name of DRAFT_FIELDS) {
        const input = formRef.current.elements.namedItem(name);
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) input.value = draft.fields[name];
      }
      if (draft.reviewed) setReview(draft.fields);
      setDraftNotice(`Your text draft was restored for this account. Photos cannot survive sign-in navigation: ${draft.reviewed ? "use Edit details to reattach them" : "reattach them below"} before submitting.`);
    } catch { setStorageUnavailable(true); }
  }, [userId]);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const returnToDetails = useRef(false);
  useEffect(() => {
    if (review) reviewHeading.current?.focus();
    else if (returnToDetails.current) {
      titleInput.current?.focus();
      returnToDetails.current = false;
    }
  }, [review]);
  const [fileError, setFileError] = useState("");
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  if (state?.jobId) return <section className="space-y-4" aria-label="Job submitted">
    <h2 className="text-xl font-bold">Your job has been saved</h2>
    <p role="status">Opening your job. If this page does not change, use the link below. You do not need to submit it again.</p>
    <a className={styles.publish} href={`/jobs/${encodeURIComponent(state.jobId)}`}>View saved job</a>
  </section>;

  return (
    <form ref={formRef} onChange={() => persist(!!review)} className={styles.form} aria-busy={pending} onSubmit={(event) => {
      event.preventDefault();
      if (pending || submissionInFlight.current || fileError) return;
      const data = new FormData(event.currentTarget);
      if (!review) {
        persist(true);
        setReview(Object.fromEntries(DRAFT_FIELDS.map((key) => [key, String(data.get(key) ?? "")])));
        return;
      }
      submissionInFlight.current = true;
      persist(true, true);
      startTransition(() => action(data));
    }}>
      <p className="text-sm text-muted">Text details, including your address, are saved only in this browser tab for this account for up to 24 hours. Photos are not saved. The draft is cleared after successful posting.</p>
      {draftNotice && <p role="status" className={styles.fontNotice}>{draftNotice}</p>}
      {storageUnavailable && <p role="alert" className={styles.fontNotice}>This browser cannot save your draft. Keep a copy of your text before leaving or signing in again.</p>}
      <button type="button" className={styles.edit} disabled={pending} onClick={() => {
        try { clearJobDraft(userId); } catch { setStorageUnavailable(true); }
        formRef.current?.reset();
        const photos = formRef.current?.elements.namedItem("photos");
        if (photos instanceof HTMLInputElement) photos.setCustomValidity("");
        setFileError(""); setPreviews([]); returnToDetails.current = true; setReview(null);
        setDraftNotice("Draft discarded. Start a new job below.");
        titleInput.current?.focus();
      }}>Discard saved draft</button>
      {fontsUnavailable && <p role="status" className={styles.fontNotice}>The web font could not load. Fallback text is displayed.</p>}
      <p className="text-sm font-medium text-muted" role="status">{review ? "Step 2 of 2 · Review your job" : "Step 1 of 2 · Tell us what needs doing"}</p>
      <fieldset disabled={pending} className={review ? "hidden" : "contents"}>
      <div>
        <label className="label" htmlFor="title">Job title</label>
        <input ref={titleInput} className={styles.input} id="title" name="title" minLength={5} maxLength={80} placeholder="e.g. Move 2 kitchen plugs and add a dishwasher plug" required />
      </div>

      <div>
        <label className="label" htmlFor="category">Trade (required)</label>
        <select className={styles.input} id="category" name="category" defaultValue="Electrical" required>
          {CATEGORY_NAMES.map(category => <option key={category} value={category}>{category}</option>)}
        </select>
        <p className="mt-1 text-xs text-muted">Choose the trade needed for this job. Plumbing, Gas Fitting and Construction verification and completion requirements are still being configured; those jobs can be posted for review but cannot yet be estimated, claimed or completed here.</p>
      </div>

      <div>
        <label className="label" htmlFor="description">Describe the job</label>
        <textarea
          className={styles.input}
          id="description"
          name="description"
          minLength={20}
          maxLength={4000}
          placeholder="What needs doing, where in the house, is the gib up, any access issues, when you'd like it done…"
          required
        />
      </div>

      <div className={styles.location}>
        <div>
          <label className="label" htmlFor="region">Region</label>
          <select className={styles.input} id="region" name="region" defaultValue={defaultRegion} required>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="suburb">Suburb / town</label>
          <input className={styles.input} id="suburb" name="suburb" minLength={2} maxLength={60} placeholder="e.g. Waverley" required />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="address">Street address</label>
        <input className={styles.input} id="address" name="address" minLength={5} maxLength={120} autoComplete="street-address" placeholder="e.g. 3 Maltby Street" required />
        <p className="mt-1 text-xs text-muted">Visible to you, Trade Marketplace administrators and the assigned tradie. Other tradies see only your suburb and region.</p>
      </div>

      <div>
        <label className="label" htmlFor="photos">Photos <span className="font-normal text-muted">(at least 1, up to 6 - switchboard, the area, anything relevant)</span></label>
        <input
          className={styles.input}
          id="photos"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple required aria-describedby="photo-rules photo-error"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            const error = files.length > 6 ? "Choose no more than 6 photos." : files.some((f) => f.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(f.type)) ? "Each photo must be JPG, PNG or WebP and no larger than 5 MiB." : "";
            setFileError(error);
            e.target.setCustomValidity(error);
            setPreviews(files.slice(0, 6).map((f) => URL.createObjectURL(f)));
          }}
        />
        <p id="photo-rules" className="mt-2 text-sm text-muted">JPG, PNG or WebP, up to 5 MiB per photo.</p>
        <p id="photo-error" role="alert" className="text-sm text-red-700">{fileError}</p>
        {previews.length > 0 && (
          <div className={styles.previews}>
            {previews.map((src, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt={`Selected photo ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" />
            ))}
          </div>
        )}
      </div>

      </fieldset>
      {review && <section aria-label="Review job details" className="space-y-4">
        <h2 ref={reviewHeading} tabIndex={-1} className="text-xl font-bold">{review.title}</h2>
        <p className="whitespace-pre-wrap break-words">{review.description}</p>
        <p>{review.address}, {review.suburb}, {review.region}</p>
        <p className="text-sm text-muted">{previews.length} photo{previews.length === 1 ? "" : "s"} attached · {review.category}</p>
        <div className="rounded-xl bg-paper p-4 text-sm">{review.category !== "Electrical" && <p className="mb-2 font-semibold">{review.category} requirements are pending. This job can be saved for review; estimating, claiming and completion are not yet available for this trade.</p>}Tradies provide private estimates. Trade Marketplace reviews these and sets your fixed price. Posting does not book a tradie or take a payment.</div>
        <button type="button" className={styles.edit} disabled={pending} onClick={() => { persist(false); returnToDetails.current = true; setReview(null); }}>Edit details</button>
      </section>}
      <FormMessage state={state} />
      <button type="submit" className={styles.publish} disabled={pending || !!fileError || (!!review && previews.length === 0)}>{pending ? "Submitting job…" : review ? "Submit job for pricing" : "Review job"}</button>
      <p role="status" className="sr-only">{pending ? "Submitting your job. Please wait." : ""}</p>
    </form>
  );
}
