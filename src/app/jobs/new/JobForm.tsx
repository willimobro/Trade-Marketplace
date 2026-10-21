"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { createJob } from "@/app/actions/jobs";
import { FormMessage } from "@/components/ui";
import styles from "./post-job.module.css";
import { REGIONS } from "@/lib/constants";

export function JobForm({ defaultRegion }: { defaultRegion: string }) {
  const [state, action, pending] = useActionState(createJob, undefined);
  const [fontsUnavailable, setFontsUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.all([
      document.fonts.load('760 18px "Post SF Expanded"'),
      document.fonts.load('400 16px "Post SF Regular"'),
    ]).then((faces) => {
      if (active && faces.some((loaded) => loaded.length === 0 || loaded.some((face) => face.status !== "loaded"))) setFontsUnavailable(true);
    }).catch(() => { if (active) setFontsUnavailable(true); });
    return () => { active = false; };
  }, []);
  const [previews, setPreviews] = useState<string[]>([]);

  const [review, setReview] = useState<Record<string, string> | null>(null);
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

  return (
    <form className={styles.form} aria-busy={pending} onSubmit={(event) => {
      event.preventDefault();
      if (pending || fileError) return;
      const data = new FormData(event.currentTarget);
      if (!review) {
        setReview(Object.fromEntries(["title", "description", "region", "suburb", "address"].map((key) => [key, String(data.get(key) ?? "")])));
        return;
      }
      startTransition(() => action(data));
    }}>
      {fontsUnavailable && <p role="status" className={styles.fontNotice}>Original SF Pro fonts are unavailable on this device. The fallback text is not an exact design match.</p>}
      <p className="text-sm font-medium text-muted" role="status">{review ? "Step 2 of 2 · Review your job" : "Step 1 of 2 · Tell us what needs doing"}</p>
      <fieldset disabled={pending} className={review ? "hidden" : "contents"}>
      <div>
        <label className="label" htmlFor="title">Job title</label>
        <input ref={titleInput} className={styles.input} id="title" name="title" minLength={5} maxLength={80} placeholder="e.g. Move 2 kitchen plugs and add a dishwasher plug" required />
      </div>

      {/* Electrical only for now - other trades are "coming soon". */}
      <input type="hidden" name="category" value="Electrical" />

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
        <p className="mt-1 text-xs text-muted">Visible to you, Trade Marketplace administrators and the assigned electrician. Other electricians see only your suburb and region.</p>
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
        <p className="text-sm text-muted">{previews.length} photo{previews.length === 1 ? "" : "s"} attached · Electrical</p>
        <div className="rounded-xl bg-paper p-4 text-sm">Electricians provide private estimates. Trade Marketplace reviews these and sets your fixed price. Posting does not book an electrician or take a payment.</div>
        <button type="button" className={styles.edit} disabled={pending} onClick={() => { returnToDetails.current = true; setReview(null); }}>Edit details</button>
      </section>}
      <FormMessage state={state} />
      <button type="submit" className={styles.publish} disabled={pending || !!fileError}>{pending ? "Submitting job…" : review ? "Submit job for pricing" : "Review job"}</button>
      <p role="status" className="sr-only">{pending ? "Submitting your job. Please wait." : ""}</p>
    </form>
  );
}
