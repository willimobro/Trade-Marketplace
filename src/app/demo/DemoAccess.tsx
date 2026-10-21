"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions/types";

export function DemoAccess({ action }: { action: (previous: FormState, form: FormData) => Promise<FormState> }) {
  const [state, submit, pending] = useActionState(action, undefined);
  return <form action={submit} aria-busy={pending}>
    <fieldset disabled={pending} className="grid gap-4">
      <legend className="mb-4 font-semibold">Choose a demo role</legend>
      <button type="submit" name="role" value="customer" className="btn-primary">Open customer demo</button>
      <button type="submit" name="role" value="tradie" className="btn-primary">Open tradie demo</button>
      <button type="submit" name="role" value="admin" className="btn-primary">Open administrator demo</button>
    </fieldset>
    <p role="status" className="mt-4 text-sm">{pending ? "Signing in with the existing demo account…" : ""}</p>
    {state?.error && <p role="alert" className="mt-3 text-sm text-red-700">{state.error} The demo accounts must already exist in this runtime’s local database.</p>}
  </form>;
}
