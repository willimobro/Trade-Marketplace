"use client";

import Image from "next/image";
import Link from "next/link";
import { SourceIcon } from "@/components/SourceIcon";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { signup } from "@/app/actions/auth";
import { CATEGORY_NAMES, EWRB_REGISTER_URL, REGIONS } from "@/lib/constants";
import styles from "./signup.module.css";

export function SignupForm({ initialRole, next }: { initialRole: "CUSTOMER" | "TRADIE"; next?: string }) {
  const [state, action, pending] = useActionState(signup, undefined);
  const [role, setRole] = useState(initialRole);
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState({ name: "", email: "", password: "", region: "", trade: "Electrical", registrationNo: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [fontsUnavailable, setFontsUnavailable] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const moveFocus = useRef(false);
  const field = (name: keyof typeof values) => ({ value: values[name], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setValues(current => ({ ...current, [name]: event.target.value })) });
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    if (step === 2) heading.current?.focus(); else nameInput.current?.focus();
  }, [step]);
  useEffect(() => {
    if (state?.error) errorMessage.current?.focus();
  }, [state]);
  useEffect(() => {
    let active = true;
    Promise.all([document.fonts.load('760 36px "Trade Display"'), document.fonts.load('700 14px "Trade UI"'), document.fonts.load('400 16px "Trade UI"')]).then(faces => {
      if (active && faces.some(loaded => loaded.length === 0 || loaded.some(face => face.status !== "loaded"))) setFontsUnavailable(true);
    }).catch(() => { if (active) setFontsUnavailable(true); });
    return () => { active = false; };
  }, []);
  const loginUrl = `/login${next ? `?next=${encodeURIComponent(next)}` : ""}`;
  const fontNotice = "The web font could not load. Fallback text is displayed.";

  if (step === 2) return <section className={styles.details}>
    <button type="button" className={styles.backDetails} disabled={pending} onClick={() => { moveFocus.current = true; setStep(1); }}>← Back to your details</button>
    <ol className={styles.progress} aria-label="Create account progress"><li><span aria-hidden="true">✓</span> Your details</li><li aria-current="step"><span aria-hidden="true">2</span> Account details</li></ol>
    <h1 ref={heading} tabIndex={-1}>How will you use Trade Marketplace?</h1>
    <p className={styles.intro}>Choose your account type and region to finish setting up.</p>
    <div className={styles.accountSummary}><p>Creating an account for</p><strong>{values.name}</strong><span>{values.email}</span><p>Your account is created when you select Create account below.</p></div>
    {fontsUnavailable && <p className={styles.detailsNotice} role="status">{fontNotice}</p>}
    <form onSubmit={event => {
      event.preventDefault();
      if (pending) return;
      const form = new FormData(event.currentTarget);
      for (const key of ["name", "email", "password"] as const) form.set(key, values[key]);
      form.set("next", next ?? "");
      startTransition(() => action(form));
    }} aria-busy={pending}>
      <fieldset disabled={pending}><legend>Account type</legend><div className={styles.roles}>{(["CUSTOMER", "TRADIE"] as const).map(option => <label key={option} className={`${styles.role} ${role === option ? styles.selectedRole : ""}`}><input type="radio" name="role" value={option} checked={role === option} onChange={() => setRole(option)} /><span><strong>{option === "CUSTOMER" ? "I need a job done" : "I’m a tradie"}</strong><span>{option === "CUSTOMER" ? "Post jobs and follow their progress." : "Set up your trade profile."}</span></span></label>)}</div></fieldset>
      <div className={styles.field}><label htmlFor="region">Region (required)</label><select id="region" name="region" required {...field("region")} disabled={pending}><option value="" disabled>Choose your region</option>{REGIONS.map(region => <option key={region}>{region}</option>)}</select></div>
      {role === "TRADIE" && <>
        <div className={styles.field}>
          <label htmlFor="trade">Trade (required)</label>
          <select id="trade" name="trade" required {...field("trade")} disabled={pending} aria-describedby="trade-help">{CATEGORY_NAMES.map(trade => <option key={trade} value={trade}>{trade}</option>)}</select>
          <p id="trade-help">Choose the trade for your account. Signing up does not verify your qualifications or approve you to take jobs.</p>
        </div>
        <div className={styles.field}>
          <label htmlFor="registrationNo">Registration number ({values.trade === "Electrical" ? "required" : "optional"})</label>
          <input id="registrationNo" name="registrationNo" required={values.trade === "Electrical"} {...field("registrationNo")} disabled={pending} aria-describedby="registration-help" />
          <p id="registration-help">{values.trade === "Electrical" ? <>Electrical registration is required. We check your details against the <a href={EWRB_REGISTER_URL} target="_blank" rel="noreferrer">EWRB public register</a> before your profile is verified.</> : "Verification requirements for this trade are pending. You may add a relevant registration number, but this does not verify your account or qualify you to accept jobs."}</p>
        </div>
      </>}
      {state?.error && <p ref={errorMessage} tabIndex={-1} className={styles.detailsError} role="alert">{state.error} Your entered details are retained; use Back if you need to change your name, email or password.</p>}
      <button type="submit" disabled={pending}>{pending ? "Creating account…" : "Create account"}</button>
      <Link href={loginUrl}>Already registered? Log in</Link>
    </form>
  </section>;

  return <div className={styles.screen}>
    <Image src="/original/signup-panel.svg" alt="" width={390} height={601} className={`${styles.art} ${styles.panel}`} unoptimized />
    <Image src="/original/signup-bolt.svg" alt="" width={419} height={694} className={`${styles.art} ${styles.bolt}`} unoptimized />
    <Image src="/original/signup-illustration.png" alt="" width={224} height={213} className={`${styles.art} ${styles.illustration}`} priority unoptimized />
    <Image src="/original/signup-mark.svg" alt="" width={26} height={43} className={`${styles.art} ${styles.mark}`} unoptimized />
    <Link href={loginUrl} aria-label="Back to login" className={styles.back}><SourceIcon name="back" size={39} style={{ padding: 6.5, color: "white" }} /></Link>
    <h1 className={styles.title} aria-label="Create Account"><svg width="302" height="155" aria-hidden="true"><text x="0 32.9765625 48.69140625 74.390625 99.5625 116.75390625" y="34.296875">Create</text><text x="0 31.921875 57.3046875 82.6875 109.125 135.17578125 161.296875" y="77.296875">Account</text></svg></h1>
    <form className={styles.form} onSubmit={event => { event.preventDefault(); moveFocus.current = true; setStep(2); }} aria-label="Create account, step 1 of 2">
      <label className={styles.srOnly} htmlFor="name">Full name</label><SourceIcon name="person" size={19} className={`${styles.icon} ${styles.nameIcon}`} style={{ color: "#52645b", fill: "none" }} /><input ref={nameInput} className={`${styles.input} ${styles.name}`} id="name" name="name" autoComplete="name" placeholder="Name" minLength={2} maxLength={60} required {...field("name")} /><span className={`${styles.rule} ${styles.nameRule}`} aria-hidden="true" />
      <label className={styles.srOnly} htmlFor="email">Email</label><SourceIcon name="envelope" size={19} className={`${styles.icon} ${styles.mail}`} style={{ color: "#52645b", fill: "none" }} /><input className={`${styles.input} ${styles.email}`} id="email" name="email" type="email" autoComplete="email" placeholder="Email" required {...field("email")} /><SourceIcon name="check" size={19} className={`${styles.icon} ${styles.emailCheck}`} style={{ color: "#326c20", fill: "none" }} /><span className={`${styles.rule} ${styles.emailRule}`} aria-hidden="true" />
      <label className={styles.srOnly} htmlFor="password">Password, at least 8 characters</label><SourceIcon name="lock" size={19} className={`${styles.icon} ${styles.lock}`} style={{ color: "#52645b", fill: "none" }} /><input className={`${styles.input} ${styles.password}`} id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Password" minLength={8} required {...field("password")} /><button type="button" className={styles.showPassword} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}><SourceIcon name="eye-slash" size={19} style={{ width: 25, height: 19, color: "#326c20" }} /></button><span className={`${styles.rule} ${styles.passwordRule}`} aria-hidden="true" />
      <Link href="/recovery" className={styles.forgot} aria-label="Forgot password? Recovery preview"><svg width="167" height="27" aria-hidden="true"><text x="40.97265625" y="17.4765625">Forgot password?</text></svg></Link>
      <button type="submit" className={`${styles.action} ${styles.primary}`} aria-label="Create Account: continue to account details"><svg aria-hidden="true"><text x="160.5" y="31.4765625" textAnchor="middle">Create Account</text></svg></button>
      <span className={`${styles.separator} ${styles.separatorLeft}`} aria-hidden="true" /><span className={`${styles.separator} ${styles.separatorRight}`} aria-hidden="true" /><svg className={styles.or} aria-hidden="true"><text x="76.1103515625" y="13.4765625">or</text></svg>
      <Link href={loginUrl} className={`${styles.action} ${styles.secondary}`} aria-label="Log In"><svg aria-hidden="true"><text x="160.5" y="31.4765625" textAnchor="middle">Log In</text></svg></Link>
    </form>
    {fontsUnavailable && <p role="status" className={styles.fontNotice}>{fontNotice}</p>}
  </div>;
}
