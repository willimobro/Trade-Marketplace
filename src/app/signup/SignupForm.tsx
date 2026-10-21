"use client";

import { useActionState, useState } from "react";
import { signup } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/ui";
import { CATEGORY_NAMES, EWRB_REGISTER_URL, REGIONS } from "@/lib/constants";

export function SignupForm({ initialRole, next }: { initialRole: "CUSTOMER" | "TRADIE"; next?: string }) {
  const [state, action] = useActionState(signup, undefined);
  const [role, setRole] = useState(initialRole);

  return (
    <form action={action} className="card mt-6 space-y-4 p-6">
      <input type="hidden" name="next" value={next ?? ""} />
      <input type="hidden" name="role" value={role} />

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/5 p-1" role="radiogroup" aria-label="Account type">
        {(["CUSTOMER", "TRADIE"] as const).map((r) => (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={role === r}
            onClick={() => setRole(r)}
            className={`rounded-lg py-2 text-sm font-semibold transition ${role === r ? "bg-white shadow text-ink" : "text-muted"}`}
          >
            {r === "CUSTOMER" ? "I need a job done" : "I'm a tradie"}
          </button>
        ))}
      </div>

      <div>
        <label className="label" htmlFor="name">Full name</label>
        <input className="input" id="name" name="name" autoComplete="name" required />
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <div>
        <label className="label" htmlFor="region">Region</label>
        <select className="input" id="region" name="region" required defaultValue="">
          <option value="" disabled>Choose…</option>
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {role === "TRADIE" && (
        <div className="space-y-4 rounded-xl border border-leaf/30 bg-leaf/5 p-4">
          <div>
            <label className="label" htmlFor="trade">Trade</label>
            <select className="input" id="trade" name="trade" required defaultValue="Electrical">
              {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="registrationNo">Registration number</label>
            <input className="input" id="registrationNo" name="registrationNo" placeholder="e.g. E012345" required />
            <p className="mt-1 text-xs text-muted">
              We check this against the{" "}
              <a href={EWRB_REGISTER_URL} target="_blank" rel="noreferrer" className="underline">public register</a>{" "}
              before your profile shows as verified.
            </p>
          </div>
        </div>
      )}

      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full" pending="Creating account…">Create account</SubmitButton>
    </form>
  );
}
