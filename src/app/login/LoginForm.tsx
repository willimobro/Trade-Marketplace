"use client";

import { useActionState, useState } from "react";
import { login } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/ui";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(login, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form action={action} className="card mt-6 space-y-5 p-5 sm:p-8">
      <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </div>
      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full" pending="Logging in…">Log in</SubmitButton>
    </form>
  );
}
