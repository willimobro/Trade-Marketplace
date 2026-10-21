"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import type { FormState } from "@/app/actions/types";
import { Avatar, FormMessage, LicenceBadge } from "@/components/ui";
import { REGIONS } from "@/lib/constants";
import styles from "./profile.module.css";

type ProfileUser = {
  name: string;
  role: string;
  trade: string | null;
  region: string;
  phone: string | null;
  bio: string | null;
  registrationNo: string | null;
  avatarUrl: string | null;
  licenceVerified: boolean;
};

export function ProfileForm({ user }: { user: ProfileUser }) {
  const avatarInput = useRef<HTMLInputElement>(null);
  const resultMessage = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState<{ name: string; url: string } | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [previewUnavailable, setPreviewUnavailable] = useState(false);
  const [state, action, isPending] = useActionState(async (previous: FormState, form: FormData) => {
    const result = await updateProfile(previous, form);
    if (result?.ok) {
      if (avatarInput.current) avatarInput.current.value = "";
      setPhoto(null);
      setPreviewUnavailable(false);
    }
    return result;
  }, undefined);
  const [values, setValues] = useState({ name: user.name, region: user.region, phone: user.phone ?? "", registrationNo: user.registrationNo ?? "", bio: user.bio ?? "" });
  const field = (name: keyof typeof values) => ({ disabled: isPending, value: values[name], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setValues((current) => ({ ...current, [name]: event.target.value })) });
  const isTradie = user.role === "TRADIE";
  const registrationChanged = values.registrationNo.trim() !== (user.registrationNo ?? "");
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.url); }, [photo]);
  useEffect(() => { if (state) resultMessage.current?.focus(); }, [state]);

  function clearSelectedPhoto() {
    if (avatarInput.current) {
      avatarInput.current.value = "";
      avatarInput.current.setCustomValidity("");
      avatarInput.current.focus();
    }
    setPhoto(null);
    setPhotoError("");
    setPreviewUnavailable(false);
  }
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      if (isPending) return;
      if (photoError) { avatarInput.current?.focus(); return; }
      const form = new FormData(event.currentTarget);
      // Dispatch explicitly so React does not reset the native file input after
      // a server validation error. The selected photo stays ready to retry.
      startTransition(() => action(form));
    }} aria-busy={isPending} className="card mt-6 space-y-6 p-5 sm:p-8">
      <section aria-labelledby="profile-photo-title">
        <div className={styles.photoRow}>
          {photo && !photoError && !previewUnavailable ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.url} alt="Selected profile photo preview" width={64} height={64} className={styles.photoPreview} onError={() => setPreviewUnavailable(true)} />
          ) : <Avatar name={user.name} url={user.avatarUrl} size={64} />}
        <div className="min-w-0 flex-1">
          <label className="label" id="profile-photo-title" htmlFor="avatar">Profile photo</label>
          <input ref={avatarInput} className="input text-sm" id="avatar" name="avatar" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby={`avatar-help${photoError ? " avatar-error" : ""}`} aria-invalid={photoError ? true : undefined} disabled={isPending} onChange={event => {
            const file = event.currentTarget.files?.[0];
            // The server checks actual image signatures. Browser MIME types and
            // extensions are hints only, so only its exact size limit is checked here.
            const error = file && file.size > 5 * 1024 * 1024 ? "Choose a photo of 5 MB or less." : "";
            event.currentTarget.setCustomValidity(error);
            setPhotoError(error);
            setPreviewUnavailable(false);
            setPhoto(file ? { name: file.name, url: URL.createObjectURL(file) } : null);
          }} />
          <p id="avatar-help" className="mt-2 text-sm text-muted">JPG, PNG or WebP, up to 5 MB. Save your profile to apply the photo.</p>
        </div>
        </div>
        {photo && <div className={styles.photoSelection}>
          <p className="min-w-0 flex-1 break-words text-sm text-muted" role="status">{photo.name}{!photoError && (previewUnavailable ? " · Preview unavailable; the image is checked when you save." : " · Selected, not saved yet.")}</p>
          <button type="button" className="btn-ghost" disabled={isPending} onClick={clearSelectedPhoto}>Clear selection</button>
        </div>}
        {photoError && <p id="avatar-error" className="mt-3 text-sm text-red-700" role="alert">{photoError}</p>}
        <p className="mt-3 text-sm text-muted">Your entered details and selected photo stay here if saving fails.</p>
      </section>
      <div className={styles.formSection}>
        <h2 className="text-lg font-bold">Contact details</h2>
        <p className="mt-1 text-sm text-muted">Used to coordinate your jobs.</p>
      </div>
      <div>
        <label className="label" htmlFor="name">Full name</label>
        <input className="input" id="name" name="name" {...field("name")} autoComplete="name" minLength={2} maxLength={60} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="region">Region</label>
          <select className="input" id="region" name="region" {...field("region")} required>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone (optional)</label>
          <input className="input" id="phone" name="phone" type="tel" {...field("phone")} autoComplete="tel" maxLength={30} />
        </div>
      </div>
      {isTradie && (
        <>
          <div className={styles.formSection}>
            <h2 className="text-lg font-bold">Your trade profile</h2>
            <p className="mt-1 text-sm text-muted">{user.trade ?? "Trade not set"} · Your name, region, photo and bio appear on your public profile.</p>
          </div>
          <div>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <label className="label mb-0" htmlFor="registrationNo">{user.trade === "Electrical" ? "Electrical registration number" : "Registration number (optional)"}</label>
              <LicenceBadge verified={user.licenceVerified} trade={user.trade} />
            </div>
            <input className="input" id="registrationNo" name="registrationNo" {...field("registrationNo")} maxLength={30} aria-describedby="registration-help" />
            <p id="registration-help" className="mt-2 text-sm text-muted">{user.trade === "Electrical" ? "Saving a different registration number resets your verified badge until it is checked again." : "Requirements for your trade still need to be configured. Adding a number does not verify your account."}</p>
            {registrationChanged && user.licenceVerified && user.trade === "Electrical" && <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900" role="status">Your registration number has changed. Saving will set your licence status to pending check.</p>}
          </div>
          <div>
            <label className="label" htmlFor="bio">About you</label>
            <textarea
              className="input min-h-28"
              id="bio"
              name="bio"
              maxLength={1000}
              aria-describedby="bio-help"
              {...field("bio")}
              placeholder="Years in the trade, what work you like, when you're available (evenings/weekends?)…"
            />
            <p id="bio-help" className="mt-2 text-sm text-muted">{values.bio.length} / 1,000 characters · Only include details you want customers to see.</p>
          </div>
        </>
      )}
      {state && <div ref={resultMessage} tabIndex={-1}><FormMessage state={state} /></div>}
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isPending}>{isPending ? "Saving profile…" : "Save profile"}</button>
    </form>
  );
}
