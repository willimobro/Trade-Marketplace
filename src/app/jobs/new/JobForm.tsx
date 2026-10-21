"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { createJob } from "@/app/actions/jobs";
import { FormMessage } from "@/components/ui";
import { REGIONS } from "@/lib/constants";

export function JobForm({ defaultRegion }: { defaultRegion: string }) {
  const [state, action, pending] = useActionState(createJob, undefined);
  const [previews, setPreviews] = useState<string[]>([]);

  const [review, setReview] = useState<Record<string, string> | null>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (review) reviewHeading.current?.focus(); }, [review]);
  const [fileError, setFileError] = useState("");
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  return (
    <form className="card mt-6 space-y-5 p-4 sm:p-6" aria-busy={pending} onSubmit={(event) => {
      event.preventDefault();
      if (pending || fileError) return;
      const data = new FormData(event.currentTarget);
      if (!review) {
        setReview(Object.fromEntries(["title", "description", "region", "suburb", "address"].map((key) => [key, String(data.get(key) ?? "")])));
        return;
      }
      startTransition(() => action(data));
    }}>
      <p className="text-sm font-medium text-muted" role="status">{review ? "Step 2 of 2 · Review your job" : "Step 1 of 2 · Tell us what needs doing"}</p>
      <fieldset disabled={pending} className={review ? "hidden" : "contents"}>
      <div>
        <label className="label" htmlFor="title">Job title</label>
        <input className="input" id="title" name="title" minLength={5} maxLength={80} placeholder="e.g. Move 2 kitchen plugs and add a dishwasher plug" required />
      </div>

      {/* Electrical only for now - other trades are "coming soon". */}
      <input type="hidden" name="category" value="Electrical" />

      <div>
        <label className="label" htmlFor="description">Describe the job</label>
        <textarea
          className="input min-h-36"
          id="description"
          name="description"
          minLength={20}
          maxLength={4000}
          placeholder="What needs doing, where in the house, is the gib up, any access issues, when you'd like it done…"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="region">Region</label>
          <select className="input" id="region" name="region" defaultValue={defaultRegion} required>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="suburb">Suburb / town</label>
          <input className="input" id="suburb" name="suburb" minLength={2} maxLength={60} placeholder="e.g. Waverley" required />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="address">Street address</label>
        <input className="input" id="address" name="address" minLength={5} maxLength={120} autoComplete="street-address" placeholder="e.g. 3 Maltby Street" required />
        <p className="mt-1 text-xs text-muted">Visible to you, Trade Marketplace administrators and the assigned electrician. Other electricians see only your suburb and region.</p>
      </div>

      <div>
        <label className="label" htmlFor="photos">Photos <span className="font-normal text-muted">(at least 1, up to 6 - switchboard, the area, anything relevant)</span></label>
        <input
          className="input file:mr-3 file:rounded-lg file:border-0 file:bg-leaf/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-leaf-dark"
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
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
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
        <button type="button" className="btn-ghost" disabled={pending} onClick={() => setReview(null)}>Edit details</button>
      </section>}
      <FormMessage state={state} />
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending || !!fileError}>{pending ? "Submitting job…" : review ? "Submit job for pricing" : "Review job"}</button>
      <p role="status" className="sr-only">{pending ? "Submitting your job. Please wait." : ""}</p>
    </form>
  );
}
