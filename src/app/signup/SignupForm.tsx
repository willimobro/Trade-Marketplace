"use client";

import { useActionState, useState } from "react";
import { signup } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/ui";
import { EWRB_REGISTER_URL, REGIONS } from "@/lib/constants";

export function SignupForm({ initialRole, next }: { initialRole: "CUSTOMER" | "TRADIE"; next?: string }) {
  const [state, action] = useActionState(signup, undefined);
  const [role, setRole] = useState(initialRole);

  const [values, setValues] = useState({ name: "", email: "", password: "", region: "", trade: "Electrical", registrationNo: "" });
  const field = (name: keyof typeof values) => ({ value: values[name], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setValues((current) => ({ ...current, [name]: event.target.value })) });

  return (
    <form action={action} className="card mt-6 space-y-5 p-5 sm:p-8">
      <input type="hidden" name="next" value={next ?? ""} />
      <fieldset>
        <legend className="label">What brings you here?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["CUSTOMER", "TRADIE"] as const).map((option) => (
            <label key={option} className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-semibold ${role === option ? "border-forest bg-lime/20" : "border-line"}`}>
              <input type="radio" name="role" value={option} checked={role === option} onChange={() => setRole(option)} className="h-5 w-5 accent-forest" />
              {option === "CUSTOMER" ? "I need a job done" : "I'm a tradie"}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="text-sm text-muted">All fields below are required.</p>

      <div>
        <label className="label" htmlFor="name">Full name</label>
        <input className="input" id="name" name="name" autoComplete="name" minLength={2} {...field("name")} required />
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" {...field("email")} required />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={8} aria-describedby="password-help" {...field("password")} required />
        <p id="password-help" className="mt-2 text-sm text-muted">Use at least 8 characters.</p>
      </div>
      <div>
        <label className="label" htmlFor="region">Region</label>
        <select className="input" id="region" name="region" required {...field("region")}>
          <option value="" disabled>Choose…</option>
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {role === "TRADIE" && (
        <div className="space-y-4 rounded-xl border border-leaf/30 bg-leaf/5 p-4">
          <div>
            <label className="label" htmlFor="trade">Trade</label>
            <select className="input" id="trade" name="trade" aria-describedby="trade-help" required {...field("trade")}>
              <option value="Electrical">Electrical</option>
            </select>
            <p id="trade-help" className="mt-2 text-sm text-muted">We currently support electrical work only. Other trades are not available yet.</p>
          </div>
          <div>
            <label className="label" htmlFor="registrationNo">Registration number</label>
            <input className="input" id="registrationNo" name="registrationNo" placeholder="e.g. E012345" {...field("registrationNo")} required />
            <p className="mt-1 text-sm text-muted">
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
