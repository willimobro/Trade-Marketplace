"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pending: pendingText = "Saving…",
  className = "btn-primary",
}: {
  children: React.ReactNode;
  pending?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-disabled={pending} aria-busy={pending}>
      {pending ? pendingText : children}
    </button>
  );
}
