"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useId, useRef, useState, type ReactNode, type Ref } from "react";

import Link from "next/link";
import { FormMessage } from "@/components/ui";
import { formatNZD } from "@/lib/constants";
import { priceWork, type Rates } from "@/lib/pricing";
import type { FormState } from "@/app/actions/types";

type BoundAction = (prev: FormState, form: FormData) => Promise<FormState>;

// Dispatch explicitly so React does not reset uncontrolled values or uploads on
// a validation error returned by the server action.
const PendingContext = createContext(false);
function RetainedForm({ action, pending, children, className, ref }: {
  action: (data: FormData) => void; pending: boolean; children: ReactNode;
  className?: string; ref?: Ref<HTMLFormElement>;
}) {
  return <form ref={ref} className={className} aria-busy={pending} onSubmit={(event) => {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  }}>
    <PendingContext.Provider value={pending}>
      <fieldset disabled={pending} className="contents">{children}</fieldset>
    </PendingContext.Provider>
    <span className="sr-only" role="status">{pending ? "Saving. Please wait." : ""}</span>
  </form>;
}
function SubmitButton({ children, pending = "Saving…", className = "btn-primary" }: {
  children: ReactNode; pending?: string; className?: string;
}) {
  const busy = useContext(PendingContext);
  return <button type="submit" className={className} disabled={busy}>{busy ? pending : children}</button>;
}

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
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <RetainedForm pending={pending} action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
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
    </RetainedForm>
  );
}

export function ClaimForm({ action, earn }: { action: (prev: FormState) => Promise<FormState>; earn: string }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [reviewing, setReviewing] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const claimTrigger = useRef<HTMLButtonElement>(null);
  const restoreClaimFocus = useRef(false);
  useEffect(() => {
    if (reviewing) heading.current?.focus();
    else if (restoreClaimFocus.current) {
      claimTrigger.current?.focus();
      restoreClaimFocus.current = false;
    }
  }, [reviewing]);
  if (!reviewing) return <button ref={claimTrigger} type="button" className="btn-primary w-full" onClick={() => setReviewing(true)}>Review claim · {earn} gross pay</button>;
  return (
    <RetainedForm pending={pending} action={formAction} className="space-y-3">
      <h3 ref={heading} tabIndex={-1} className="font-semibold">Before you claim</h3>
      <p className="text-sm">Gross pay: <strong>{earn}</strong>, including holiday pay and before payroll deductions. Review the scope and materials budget above. Claiming assigns this job to you; it does not set an appointment.</p>
      <p className="text-sm text-muted">Another electrician may claim it first. A successful claim will reveal the customer’s contact details so you can agree timing.</p>
      <label className="flex min-h-12 items-start gap-3 text-sm"><input className="mt-1" type="checkbox" required name="reviewedScope" />I have reviewed the scope and gross pay and want to claim this job.</label>
      <FormMessage state={state} />
      {state?.error && <p className="text-sm">The claim was not confirmed. <Link className="underline" href="/jobs">Return to available jobs</Link> to check current availability.</p>}
      <div className="flex flex-wrap gap-2">
        <SubmitButton className="btn-primary" pending="Claiming…">Confirm claim</SubmitButton>
        <button type="button" className="btn-ghost" disabled={pending} onClick={() => { restoreClaimFocus.current = true; setReviewing(false); }}>Back to details</button>
      </div>
    </RetainedForm>
  );
}

export function VariationForm({ action }: { action: BoundAction }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state]);
  return (
    <RetainedForm ref={ref} pending={pending} action={formAction} className="space-y-3">
      <div>
        <label className="label" htmlFor="var-desc">What&apos;s extra?</label>
        <textarea className="input min-h-20" id="var-desc" name="description" minLength={10} maxLength={2000} required
          placeholder="e.g. Existing cable to the hob is 4mm and damaged - needs a new 6mm run from the board, ~12 m" />
      </div>
      <HoursInput id="var-hours" label="Extra hours needed" />
      <div>
        <label className="label" htmlFor="var-photos">Photos (1–6 required; JPG, PNG or WebP, up to 5 MiB each)</label>
        <input className={fileInput} id="var-photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple required />
      </div>
      <FormMessage state={state} />
      <SubmitButton className="btn-ghost w-full" pending="Sending…">Send variation for pricing</SubmitButton>
    </RetainedForm>
  );
}

export function CocForm({ action }: { action: BoundAction }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <RetainedForm pending={pending} action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="coc-no">CoC number</label>
          <input className="input" id="coc-no" name="cocNumber" minLength={3} maxLength={40} required />
        </div>
        <DollarInput id="coc-mat" name="materialsSpent" label="Materials spent (ex GST)" />
      </div>
      <div>
        <label className="label" htmlFor="coc-file">CoC (JPG, PNG, WebP or PDF, up to 5 MiB)</label>
        <input className={fileInput} id="coc-file" name="coc" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required />
      </div>
      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full" pending="Uploading…">Upload CoC &amp; finish job</SubmitButton>
    </RetainedForm>
  );
}

// ---------- customer ----------

export function CancelForm({ action, paid }: { action: BoundAction; paid: boolean }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [open, setOpen] = useState(false);
  const cancelTrigger = useRef<HTMLButtonElement>(null);
  const reasonInput = useRef<HTMLTextAreaElement>(null);
  const restoreCancelFocus = useRef(false);
  useEffect(() => {
    if (open) reasonInput.current?.focus();
    else if (restoreCancelFocus.current) {
      cancelTrigger.current?.focus();
      restoreCancelFocus.current = false;
    }
  }, [open]);
  if (!open)
    return (
      <button ref={cancelTrigger} type="button" onClick={() => setOpen(true)} className="text-sm text-muted underline hover:text-ink">
        Cancel this job
      </button>
    );
  return (
    <RetainedForm pending={pending} action={formAction} className="space-y-3 rounded-xl border border-red-200 bg-red-50/50 p-4">
      <p className="text-sm">
        {paid
          ? "You've already paid, so Trade Marketplace will look into the cancellation before any refund."
          : "You haven't paid yet, so you can cancel straight away."}
      </p>
      <label className="label" htmlFor="cancel-reason">Reason for cancellation</label>
      <textarea ref={reasonInput} id="cancel-reason" className="input min-h-16" name="reason" minLength={5} maxLength={1000} placeholder="Why are you cancelling?" required />
      <FormMessage state={state} />
      <div className="flex gap-2">
        <SubmitButton className="btn bg-red-600 text-white hover:bg-red-700" pending="Sending…">
          {paid ? "Request cancellation" : "Cancel job"}
        </SubmitButton>
        <button type="button" onClick={() => { restoreCancelFocus.current = true; setOpen(false); }} className="btn-ghost">Keep job</button>
      </div>
    </RetainedForm>
  );
}

export function ReviewForm({ action, tradieName }: { action: BoundAction; tradieName: string }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [rating, setRating] = useState(0);
  if (state?.ok) return <FormMessage state={state} />;
  return (
    <RetainedForm pending={pending} action={formAction} className="space-y-3">
      <fieldset>
        <legend className="label">How did {tradieName} do?</legend>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="flex min-h-12 cursor-pointer items-center gap-1 rounded-xl border border-black/15 px-3">
              <input type="radio" name="rating" value={n} required checked={rating === n} onChange={() => setRating(n)} />
              <span>{n} <span aria-hidden="true">★</span><span className="sr-only">stars</span></span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="label" htmlFor="review-comment">Your review <span className="font-normal text-muted">(optional)</span></label>
      <textarea id="review-comment" className="input min-h-20" name="comment" maxLength={1000} aria-describedby="review-comment-help" placeholder="On time? Tidy? Explained things well?" />
      <p id="review-comment-help" className="text-sm text-muted">Choose a star rating. You can add a comment of up to 1,000 characters, or leave it blank.</p>
      <FormMessage state={state} />
      <SubmitButton pending="Posting…">Post review</SubmitButton>
    </RetainedForm>
  );
}

// ---------- shared ----------

export function MessageForm({ action }: { action: BoundAction }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state]);
  return (
    <RetainedForm ref={ref} pending={pending} action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <input className="input" name="body" maxLength={2000} placeholder="Write a message…" aria-label="Message" autoComplete="off" required />
        <SubmitButton className="btn-primary shrink-0" pending="…">Send</SubmitButton>
      </div>
      {state?.error && <FormMessage state={state} />}
      <p role="status" aria-live="polite" className="text-sm text-leaf-dark">{pending ? "Sending message…" : state?.ok ? "Message sent to this job’s conversation." : ""}</p>
    </RetainedForm>
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
  const [state, formAction, pending] = useActionState(action, undefined);
  const priceId = useId();
  const [hours, setHours] = useState(initial?.hours ?? 0);
  const [materials, setMaterials] = useState(initial?.materials ?? 0);
  return (
    <RetainedForm pending={pending} action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <HoursInput id={`${priceId}-hours`} defaultValue={initial?.hours || undefined} onChange={setHours} />
        <DollarInput id={`${priceId}-mat`} name="materials" label="Materials (ex GST)" defaultValue={initial?.materials} onChange={setMaterials} />
      </div>
      {applyMinimum && (
        <div>
          <label className="label" htmlFor={`${priceId}-note`}>Note to customer <span className="font-normal text-muted">(optional)</span></label>
          <textarea className="input min-h-16" id={`${priceId}-note`} name="note" maxLength={1000} placeholder="What's included, assumptions…" />
        </div>
      )}
      <PricePreview hours={hours} materials={materials} rates={rates} applyMinimum={applyMinimum} />
      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full" pending="Saving…">{submitLabel}</SubmitButton>
    </RetainedForm>
  );
}

export function ResolveCancelForm({ action }: { action: BoundAction }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <RetainedForm pending={pending} action={formAction} className="space-y-3">
      <fieldset className="space-y-1 text-sm">
        <legend className="label">Cancellation outcome</legend>
        <label className="flex items-center gap-2"><input type="radio" name="outcome" value="REFUND" required /> Refund customer &amp; cancel</label>
        <label className="flex items-center gap-2"><input type="radio" name="outcome" value="REINSTATE" /> Reinstate the job</label>
      </fieldset>
      <label className="label" htmlFor="resolution-note">Investigation outcome</label>
      <textarea id="resolution-note" className="input min-h-16" name="note" maxLength={1000} placeholder="Investigation outcome (kept on record)" required />
      <FormMessage state={state} />
      <SubmitButton pending="Saving…">Resolve</SubmitButton>
    </RetainedForm>
  );
}
