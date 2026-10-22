"use client";

import { useActionState } from "react";
export type PreviewRoleState = { error?: string; destination?: string } | undefined;

export function PreviewRoles({ action }: { action: (previous: PreviewRoleState, form: FormData) => Promise<PreviewRoleState> }) {
  async function selectRole(previous: PreviewRoleState, form: FormData): Promise<PreviewRoleState> {
    const result = await action(previous, form);
    if (!result?.destination) return result;
    if (result.destination !== "/dashboard" && result.destination !== "/admin") return { error: "We couldn’t open that preview. Choose a role again." };
    window.location.assign(result.destination);
    // Do not retain a success destination: Back must reopen the picker without
    // replaying navigation, and successive roles can share /dashboard.
    return undefined;
  }
  const [state, submit, pending] = useActionState(selectRole, undefined);
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
