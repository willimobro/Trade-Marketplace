"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/ui";
import { formatNZD } from "@/lib/constants";
import { priceWork, type Rates } from "@/lib/pricing";
import type { FormState } from "@/app/actions/types";

type BoundAction = (prev: FormState, form: FormData) => Promise<FormState>;

const fileInput =
  "input file:mr-3 file:rounded-lg file:border-0 file:bg-leaf/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-leaf-dark";

function DollarInput({ id, name, label, defaultValue, onChange }: {
  id: string; name: string; label: string; defaultValue?: number; onChange?: (v: number) => void;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
        <input
          className="input pl-7" id={id} name={name} type="number" min="0" step="0.01" inputMode="decimal" required
          defaultValue={defaultValue} onChange={(e) => onChange?.(Number(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}

function HoursInput({ id, label = "Hours", defaultValue, onChange }: {
  id: string; label?: string; defaultValue?: number; onChange?: (v: number) => void;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input
        className="input" id={id} name="hours" type="number" min="0.25" step="0.25" inputMode="decimal" required
        defaultValue={defaultValue} onChange={(e) => onChange?.(Number(e.target.value) || 0)}
      />
    </div>
  );
}

// ---------- tradie ----------

export function EstimateForm({ action, existing }: { action: BoundAction; existing?: { hours: number; materials: number; note: string } }) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <HoursInput id="est-hours" label="Hours on site" defaultValue={existing?.hours} />
        <DollarInput id="est-mat" name="materials" label="Materials (cost, ex GST)" defaultValue={existing?.materials} />
      </div>
      <div>
        <label className="label" htmlFor="est-note">Notes <span className="font-normal text-muted">(optional)</span></label>
        <textarea className="input min-h-20" id="est-note" name="note" maxLength={1000} defaultValue={existing?.note}
          placeholder="Assumptions, risks, what you'd want to check on site…" />
      </div>
      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full" pending="Saving…">{existing ? "Update estimate" : "Send estimate"}</SubmitButton>
    </form>
  );
}

export function ClaimForm({ action, earn }: { action: (prev: FormState) => Promise<FormState>; earn: string }) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-3">
      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full py-3 text-base" pending="Claiming…">Take this job · earn {earn}</SubmitButton>
    </form>
  );
}

export function VariationForm({ action }: { action: BoundAction }) {
  const [state, formAction] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state]);
  return (
    <form ref={ref} action={formAction} className="space-y-3">
      <div>
        <label className="label" htmlFor="var-desc">What&apos;s extra?</label>
        <textarea className="input min-h-20" id="var-desc" name="description" maxLength={2000} required
          placeholder="e.g. Existing cable to the hob is 4mm and damaged - needs a new 6mm run from the board, ~12 m" />
      </div>
      <HoursInput id="var-hours" label="Extra hours needed" />
      <div>
        <label className="label" htmlFor="var-photos">Photos (required)</label>
        <input className={fileInput} id="var-photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple required />
      </div>
      <FormMessage state={state} />
      <SubmitButton className="btn-ghost w-full" pending="Sending…">Send variation for pricing</SubmitButton>
    </form>
  );
}

export function CocForm({ action }: { action: BoundAction }) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="coc-no">CoC number</label>
          <input className="input" id="coc-no" name="cocNumber" maxLength={40} required />
        </div>
        <DollarInput id="coc-mat" name="materialsSpent" label="Materials spent (ex GST)" />
      </div>
      <div>
        <label className="label" htmlFor="coc-file">CoC (photo or PDF)</label>
        <input className={fileInput} id="coc-file" name="coc" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required />
      </div>
      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full" pending="Uploading…">Upload CoC &amp; finish job</SubmitButton>
    </form>
  );
}

// ---------- customer ----------

export function CancelForm({ action, paid }: { action: BoundAction; paid: boolean }) {
  const [state, formAction] = useActionState(action, undefined);
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-muted underline hover:text-ink">
        Cancel this job
      </button>
    );
  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-red-200 bg-red-50/50 p-4">
      <p className="text-sm">
        {paid
          ? "You've already paid, so Trade Marketplace will look into the cancellation before any refund."
          : "You haven't paid yet, so you can cancel straight away."}
      </p>
      <textarea className="input min-h-16" name="reason" maxLength={1000} placeholder="Why are you cancelling?" required />
      <FormMessage state={state} />
      <div className="flex gap-2">
        <SubmitButton className="btn bg-red-600 text-white hover:bg-red-700" pending="Sending…">
          {paid ? "Request cancellation" : "Cancel job"}
        </SubmitButton>
        <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Keep job</button>
      </div>
    </form>
  );
}

export function ReviewForm({ action, tradieName }: { action: BoundAction; tradieName: string }) {
  const [state, formAction] = useActionState(action, undefined);
  const [rating, setRating] = useState(0);
  if (state?.ok) return <FormMessage state={state} />;
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="rating" value={rating} />
      <p className="text-sm">How did {tradieName} do?</p>
      <div className="flex gap-1 text-3xl" role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => setRating(n)} className={n <= rating ? "text-amber-500" : "text-black/15 hover:text-amber-300"}
          >
            ★
          </button>
        ))}
      </div>
      <textarea className="input min-h-20" name="comment" maxLength={1000} placeholder="On time? Tidy? Explained things well?" required />
      <FormMessage state={state} />
      <SubmitButton pending="Posting…">Post review</SubmitButton>
    </form>
  );
}

// ---------- shared ----------

export function MessageForm({ action }: { action: BoundAction }) {
  const [state, formAction] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state]);
  return (
    <form ref={ref} action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <input className="input" name="body" maxLength={2000} placeholder="Write a message…" aria-label="Message" autoComplete="off" required />
        <SubmitButton className="btn-primary shrink-0" pending="…">Send</SubmitButton>
      </div>
      {state?.error && <FormMessage state={state} />}
    </form>
  );
}

// ---------- admin ----------

function PricePreview({ hours, materials, rates, applyMinimum }: { hours: number; materials: number; rates: Rates; applyMinimum: boolean }) {
  const p = priceWork(hours, Math.round(materials * 100), rates, { applyMinimum });
  const rows: [string, number, string?][] = [
    [`Tradie ${p.hours} h × ${formatNZD(rates.tradieRateCents)}`, p.tradieGrossCents],
    [`On-costs ${rates.onCostPct}%`, p.onCostCents],
    ["Materials (cost)", p.materialsCents],
    [`TM margin ${rates.marginPct}%`, p.marginCents, "text-leaf-dark"],
    [`GST ${rates.gstPct}%`, p.gstCents],
  ];
  return (
    <div className="rounded-xl bg-paper p-3 text-sm">
      {rows.map(([l, c, cls]) => (
        <div key={l} className={`flex justify-between ${cls ?? ""}`}><span>{l}</span><span className="tabular-nums">{formatNZD(c)}</span></div>
      ))}
      <div className="mt-2 flex justify-between border-t border-black/10 pt-2 font-bold">
        <span>Customer pays</span><span className="tabular-nums">{formatNZD(p.totalCents)}</span>
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>Tradie earns (incl. holiday pay)</span><span className="tabular-nums">{formatNZD(p.tradieTotalCents)}</span>
      </div>
    </div>
  );
}

export function PriceForm({ action, rates, applyMinimum, initial, submitLabel }: {
  action: BoundAction; rates: Rates; applyMinimum: boolean; initial?: { hours: number; materials: number }; submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [hours, setHours] = useState(initial?.hours ?? 0);
  const [materials, setMaterials] = useState(initial?.materials ?? 0);
  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <HoursInput id="price-hours" defaultValue={initial?.hours || undefined} onChange={setHours} />
        <DollarInput id="price-mat" name="materials" label="Materials (ex GST)" defaultValue={initial?.materials} onChange={setMaterials} />
      </div>
      {applyMinimum && (
        <div>
          <label className="label" htmlFor="price-note">Note to customer <span className="font-normal text-muted">(optional)</span></label>
          <textarea className="input min-h-16" id="price-note" name="note" maxLength={1000} placeholder="What's included, assumptions…" />
        </div>
      )}
      <PricePreview hours={hours} materials={materials} rates={rates} applyMinimum={applyMinimum} />
      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full" pending="Saving…">{submitLabel}</SubmitButton>
    </form>
  );
}

export function ResolveCancelForm({ action }: { action: BoundAction }) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-3">
      <fieldset className="space-y-1 text-sm">
        <label className="flex items-center gap-2"><input type="radio" name="outcome" value="REFUND" required /> Refund customer &amp; cancel</label>
        <label className="flex items-center gap-2"><input type="radio" name="outcome" value="REINSTATE" /> Reinstate the job</label>
      </fieldset>
      <textarea className="input min-h-16" name="note" maxLength={1000} placeholder="Investigation outcome (kept on record)" required />
      <FormMessage state={state} />
      <SubmitButton pending="Saving…">Resolve</SubmitButton>
    </form>
  );
}
