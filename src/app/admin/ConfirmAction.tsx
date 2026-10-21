"use client";

import { useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";

export function ConfirmAction({ action, label, description, confirmLabel, destructive = false }: {
  action: (form: FormData) => Promise<void>;
  label: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
}) {
  const [review, setReview] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const explanation = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (review) explanation.current?.focus(); }, [review]);
  if (!review) return <button ref={trigger} type="button" className="btn-ghost" onClick={() => setReview(true)}>{label}</button>;
  return (
    <form action={async (form) => { await action(form); setReview(false); requestAnimationFrame(() => trigger.current?.focus()); }} className="w-full rounded-xl border border-black/15 bg-paper p-4">
      <p ref={explanation} tabIndex={-1} className="mb-3 max-w-lg text-sm leading-6 text-ink">{description}</p>
      <div className="flex flex-wrap gap-2">
        <SubmitButton className={destructive ? "btn-ghost text-red-800" : "btn-primary"} pending="Updating record…">{confirmLabel}</SubmitButton>
        <button type="button" className="btn-ghost" onClick={() => { setReview(false); requestAnimationFrame(() => trigger.current?.focus()); }}>Keep unchanged</button>
      </div>
    </form>
  );
}
