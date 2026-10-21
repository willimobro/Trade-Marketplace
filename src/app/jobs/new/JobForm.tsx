"use client";

import { useActionState, useEffect, useState } from "react";
import { createJob } from "@/app/actions/jobs";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/ui";
import { REGIONS } from "@/lib/constants";

export function JobForm({ defaultRegion }: { defaultRegion: string }) {
  const [state, action] = useActionState(createJob, undefined);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  return (
    <form action={action} className="card mt-6 space-y-5 p-6">
      <div>
        <label className="label" htmlFor="title">Job title</label>
        <input className="input" id="title" name="title" maxLength={80} placeholder="e.g. Move 2 kitchen plugs and add a dishwasher plug" required />
      </div>

      {/* Electrical only for now - other trades are "coming soon". */}
      <input type="hidden" name="category" value="Electrical" />

      <div>
        <label className="label" htmlFor="description">Describe the job</label>
        <textarea
          className="input min-h-36"
          id="description"
          name="description"
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
          <input className="input" id="suburb" name="suburb" maxLength={60} placeholder="e.g. Waverley" required />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="address">Street address</label>
        <input className="input" id="address" name="address" maxLength={120} autoComplete="street-address" placeholder="e.g. 3 Maltby Street" required />
        <p className="mt-1 text-xs text-muted">Only shown to the electrician who takes the job.</p>
      </div>

      <div>
        <label className="label" htmlFor="photos">Photos <span className="font-normal text-muted">(at least 1, up to 6 - switchboard, the area, anything relevant)</span></label>
        <input
          className="input file:mr-3 file:rounded-lg file:border-0 file:bg-leaf/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-leaf-dark"
          id="photos"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => setPreviews(Array.from(e.target.files ?? []).slice(0, 6).map((f) => URL.createObjectURL(f)))}
        />
        {previews.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {previews.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
            ))}
          </div>
        )}
      </div>

      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full sm:w-auto" pending="Sending…">Get my price</SubmitButton>
    </form>
  );
}
