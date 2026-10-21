"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/ui";
import type { FormState } from "@/app/actions/types";

type BoundAction = (prev: FormState, form: FormData) => Promise<FormState>;

export function QuoteForm({ action }: { action: BoundAction }) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label className="label" htmlFor="price">Your price (NZD, incl. GST if registered)</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
          <input className="input pl-7" id="price" name="price" type="number" min="1" step="0.01" inputMode="decimal" required />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">What&apos;s included</label>
        <textarea
          className="input min-h-28"
          id="message"
          name="message"
          maxLength={2000}
          placeholder="Materials, hours, CoC, when you can start, anything you need to confirm on site…"
          required
        />
      </div>
      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full" pending="Sending…">Send quote</SubmitButton>
    </form>
  );
}

export function MessageForm({ action }: { action: BoundAction }) {
  const [state, formAction] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
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
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => setRating(n)}
            className={n <= rating ? "text-amber-500" : "text-black/15 hover:text-amber-300"}
          >
            ★
          </button>
        ))}
      </div>
      <textarea className="input min-h-20" name="comment" maxLength={1000} placeholder="On time? Tidy? Good price?" required />
      <FormMessage state={state} />
      <SubmitButton pending="Posting…">Post review</SubmitButton>
    </form>
  );
}
