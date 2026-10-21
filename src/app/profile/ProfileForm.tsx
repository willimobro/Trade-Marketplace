"use client";

import { startTransition, useActionState, useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { Avatar, FormMessage, LicenceBadge } from "@/components/ui";
import { REGIONS } from "@/lib/constants";

type ProfileUser = {
  name: string;
  role: string;
  region: string;
  phone: string | null;
  bio: string | null;
  registrationNo: string | null;
  avatarUrl: string | null;
  licenceVerified: boolean;
};

export function ProfileForm({ user }: { user: ProfileUser }) {
  const [state, action, isPending] = useActionState(updateProfile, undefined);
  const [values, setValues] = useState({ name: user.name, region: user.region, phone: user.phone ?? "", registrationNo: user.registrationNo ?? "", bio: user.bio ?? "" });
  const field = (name: keyof typeof values) => ({ disabled: isPending, value: values[name], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setValues((current) => ({ ...current, [name]: event.target.value })) });
  const isTradie = user.role === "TRADIE";
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      if (isPending) return;
      const form = new FormData(event.currentTarget);
      // Dispatch explicitly so React does not reset the native file input after
      // a server validation error. The selected photo stays ready to retry.
      startTransition(() => action(form));
    }} aria-busy={isPending} className="card mt-6 space-y-6 p-5 sm:p-8">
      <div className="flex items-center gap-4">
        <Avatar name={user.name} url={user.avatarUrl} size={64} />
        <div className="min-w-0 flex-1">
          <label className="label" htmlFor="avatar">Profile photo</label>
          <input className="input text-sm" id="avatar" name="avatar" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="avatar-help" disabled={isPending} />
          <p id="avatar-help" className="mt-2 text-sm text-muted">JPG, PNG or WebP, up to 5 MB. Your selected photo stays here if saving fails.</p>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="name">Full name</label>
        <input className="input" id="name" name="name" {...field("name")} autoComplete="name" minLength={2} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="region">Region</label>
          <select className="input" id="region" name="region" {...field("region")} required>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input className="input" id="phone" name="phone" type="tel" {...field("phone")} autoComplete="tel" />
        </div>
      </div>
      {isTradie && (
        <>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="label mb-0" htmlFor="registrationNo">Registration number</label>
              <LicenceBadge verified={user.licenceVerified} />
            </div>
            <input className="input" id="registrationNo" name="registrationNo" {...field("registrationNo")} />
            <p className="mt-1 text-sm text-muted">Changing this resets your verified badge until it&apos;s checked again.</p>
          </div>
          <div>
            <label className="label" htmlFor="bio">About you</label>
            <textarea
              className="input min-h-28"
              id="bio"
              name="bio"
              maxLength={1000}
              {...field("bio")}
              placeholder="Years in the trade, what work you like, when you're available (evenings/weekends?)…"
            />
          </div>
        </>
      )}
      <FormMessage state={state} />
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isPending}>{isPending ? "Saving profile…" : "Save profile"}</button>
    </form>
  );
}
