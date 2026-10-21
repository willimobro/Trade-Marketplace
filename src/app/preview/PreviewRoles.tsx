"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions/types";

export function PreviewRoles({ action }: { action: (previous: FormState, form: FormData) => Promise<FormState> }) {
  const [state, submit, pending] = useActionState(action, undefined);
  return <form action={submit} aria-busy={pending}>
    <fieldset disabled={pending} className="grid gap-4">
      <legend className="mb-4 font-semibold">Preview as</legend>
      <button type="submit" name="role" value="customer" className="btn-primary">Customer</button>
      <button type="submit" name="role" value="tradie" className="btn-primary">Tradie</button>
      <button type="submit" name="role" value="admin" className="btn-primary">Administrator</button>
    </fieldset>
    <p role="status" className="mt-4 text-sm">{pending ? "Opening your preview…" : ""}</p>
    {state?.error && <p role="alert" className="mt-3 text-sm text-red-700">{state.error}</p>}
  </form>;
}
