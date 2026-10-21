"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { SubmitButton } from "@/components/SubmitButton";
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
  const [state, action] = useActionState(updateProfile, undefined);
  const isTradie = user.role === "TRADIE";
  return (
    <form action={action} className="card mt-6 space-y-4 p-6">
      <div className="flex items-center gap-4">
        <Avatar name={user.name} url={user.avatarUrl} size={64} />
        <div className="min-w-0 flex-1">
          <label className="label" htmlFor="avatar">Profile photo</label>
          <input className="input text-xs" id="avatar" name="avatar" type="file" accept="image/jpeg,image/png,image/webp" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="name">Full name</label>
        <input className="input" id="name" name="name" defaultValue={user.name} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="region">Region</label>
          <select className="input" id="region" name="region" defaultValue={user.region}>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input className="input" id="phone" name="phone" type="tel" defaultValue={user.phone ?? ""} placeholder="Shown once a quote is accepted" />
        </div>
      </div>
      {isTradie && (
        <>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="label mb-0" htmlFor="registrationNo">Registration number</label>
              <LicenceBadge verified={user.licenceVerified} />
            </div>
            <input className="input" id="registrationNo" name="registrationNo" defaultValue={user.registrationNo ?? ""} />
            <p className="mt-1 text-xs text-muted">Changing this resets your verified badge until it&apos;s checked again.</p>
          </div>
          <div>
            <label className="label" htmlFor="bio">About you</label>
            <textarea
              className="input min-h-28"
              id="bio"
              name="bio"
              maxLength={1000}
              defaultValue={user.bio ?? ""}
              placeholder="Years in the trade, what work you like, when you're available (evenings/weekends?)…"
            />
          </div>
        </>
      )}
      <FormMessage state={state} />
      <SubmitButton>Save profile</SubmitButton>
    </form>
  );
}
