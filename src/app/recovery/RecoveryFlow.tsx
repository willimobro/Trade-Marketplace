"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { DEMO_EMAIL, DEMO_PASSWORD, emailError, passwordRequirements, resetErrors, type RecoveryStage } from "./recovery-state";
import styles from "./recovery.module.css";

type IconName = "mail" | "lock" | "check" | "clock" | "link" | "arrow" | "eye";

function Icon({ name, className }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    link: <path d="m10 7 2-2a5 5 0 0 1 7 7l-2 2M7 10l-2 2a5 5 0 0 0 7 7l2-2m-5-2 6-6M3 3l3 3m12 12 3 3" />,
    arrow: <path d="m10 5-7 7 7 7m-7-7h18" />,
    eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  };
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const screens: Record<RecoveryStage, { title: string; description: string; icon: IconName }> = {
  request: { title: "Forgot your password?", description: "It happens. Let’s get you back to getting things done.", icon: "lock" },
  sent: { title: "Check your inbox", description: "Your example recovery email is ready below. Open the link to choose a new password.", icon: "mail" },
  expired: { title: "This link has expired", description: "Recovery links are time limited. Request a fresh one and you’ll be back on track.", icon: "clock" },
  invalid: { title: "This link isn’t working", description: "The link may be incomplete or already used. Let’s get you a fresh one.", icon: "link" },
  reset: { title: "A fresh start", description: "Choose a new password, then you’re ready to get back to Trade.", icon: "lock" },
  complete: { title: "You’re all set", description: "You’ve completed the recovery flow. Head back to sign in when you’re ready.", icon: "check" },
};

const simulate = () => new Promise<void>(resolve => window.setTimeout(resolve, 850));

export function RecoveryFlow({ initialStage = "request" }: { initialStage?: RecoveryStage }) {
  const [stage, setStage] = useState<RecoveryStage>(initialStage);
  const [email, setEmail] = useState(initialStage === "request" ? "" : DEMO_EMAIL);
  const [emailIssue, setEmailIssue] = useState<string>();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [issues, setIssues] = useState<{ password?: string; confirmation?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [working, setWorking] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resent, setResent] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const confirmationInput = useRef<HTMLInputElement>(null);
  const mounted = useRef(false);
  const screen = screens[stage];
  const progress = stage === "complete" ? 3 : stage === "reset" ? 2 : 1;
  const requirements = passwordRequirements(password);

  useEffect(() => {
    if (mounted.current) heading.current?.focus();
    mounted.current = true;
  }, [stage]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  function goTo(next: RecoveryStage) {
    setEmailIssue(undefined);
    setIssues({});
    setPassword("");
    setConfirmation("");
    setShowPassword(false);
    setShowConfirmation(false);
    setStage(next);
  }

  async function requestLink() {
    const issue = emailError(email);
    setEmailIssue(issue);
    if (issue) { emailInput.current?.focus(); return; }
    setWorking(true);
    try {
      await simulate();
      setEmail(email.trim());
      setResent(false);
      setCooldown(0);
      goTo("sent");
    } finally { setWorking(false); }
  }

  async function resendLink() {
    if (cooldown > 0) return;
    setWorking(true);
    try {
      await simulate();
      setResent(true);
      setCooldown(30);
    } finally { setWorking(false); }
  }

  async function resetPassword() {
    const errors = resetErrors(password, confirmation);
    setIssues(errors);
    if (errors.password || errors.confirmation) {
      (errors.password ? passwordInput : confirmationInput).current?.focus();
      return;
    }
    setWorking(true);
    try {
      await simulate();
      goTo("complete");
    } finally { setWorking(false); }
  }

  return <div className={styles.shell}><div className={styles.screen}>
    <aside className={styles.hero} aria-label="Trade account recovery">
      <Image src="/original/login-bolt.svg" alt="" width={419} height={694} className={styles.bolt} unoptimized />
      <Link href="/login" className={styles.back}><Icon name="arrow" /><span>Back to sign in</span></Link>
      <Image src="/original/login-mark.svg" alt="Trade" width={26} height={43} className={styles.mark} unoptimized />
      <div className={styles.heroWords}><span className={styles.heroEyebrow}>A little help. A fresh start.</span><p>Let’s get you<br />back to Trade.</p></div>
      <Image src="/original/login-illustration.png" alt="" width={282} height={281} className={styles.illustration} priority unoptimized />
      <p className={styles.heroFooter}>Good people. Great work.</p>
    </aside>

    <section className={styles.content} aria-labelledby="recovery-title">
      <ol className={styles.progress} aria-label="Recovery progress">
        {["Email", "Reset", "Done"].map((label, index) => <li key={label} className={index + 1 <= progress ? styles.progressActive : undefined} aria-current={index + 1 === progress ? "step" : undefined}><span>{index + 1 < progress ? <Icon name="check" /> : index + 1}</span>{label}</li>)}
      </ol>
      <div className={`${styles.stateIcon} ${stage === "complete" ? styles.successIcon : ""}`}><Icon name={screen.icon} /></div>
      <p className={styles.eyebrow}>Account recovery</p>
      <h1 id="recovery-title" ref={heading} tabIndex={-1} className={styles.title}>{screen.title}</h1>
      <p className={styles.description}>{screen.description}</p>

      {stage === "request" && <form action={requestLink} noValidate aria-busy={working} className={styles.form}>
        <label className={styles.label} htmlFor="recovery-email">Email address</label>
        <div className={`${styles.field} ${emailIssue ? styles.invalidField : ""}`}><Icon name="mail" /><input ref={emailInput} id="recovery-email" type="email" autoComplete="off" inputMode="email" maxLength={254} placeholder={DEMO_EMAIL} value={email} disabled={working} onChange={event => { setEmail(event.target.value); setEmailIssue(undefined); }} aria-invalid={Boolean(emailIssue)} aria-describedby={`email-demo${emailIssue ? " email-error" : ""}`} /></div>
        {emailIssue && <p id="email-error" role="alert" className={styles.error}>{emailIssue}</p>}
        <p id="email-demo" className={styles.demoHint}>Demo only. Use an example address; no email is sent.</p>
        <SubmitButton className={styles.primary} pending="Creating demo link…">Send recovery link <span aria-hidden="true">→</span></SubmitButton>
        <button type="button" className={styles.exampleButton} disabled={working} onClick={() => { setEmail(DEMO_EMAIL); setEmailIssue(undefined); emailInput.current?.focus(); }}>Use an example email</button>
      </form>}

      {stage === "sent" && <div className={styles.stageBody}>
        <div className={styles.inboxCard}>
          <div className={styles.inboxHeader}><span className={styles.mailAvatar}><Icon name="mail" /></span><div><strong>Trade Marketplace</strong><span>To: {email || DEMO_EMAIL}</span></div><span className={styles.demoBadge}>Demo</span></div>
          <p className={styles.inboxSubject}>Let’s get you back in</p>
          <p className={styles.inboxText}>Use this link to reset your password. You can safely try it here.</p>
          <button type="button" className={styles.primary} disabled={working} onClick={() => goTo("reset")}>Open recovery link <span aria-hidden="true">→</span></button>
          <p className={styles.inboxFootnote}>Example email · No message was sent</p>
        </div>
        <div className={styles.resendRow}><p>Can’t find the email?</p><form action={resendLink} aria-busy={working}>{cooldown > 0 ? <button type="button" className={styles.textButton} disabled aria-describedby="resend-status">Resend in {cooldown}s</button> : <SubmitButton className={styles.textButton} pending="Preparing link…">Resend link</SubmitButton>}</form></div>
        <p id="resend-status" role="status" className={styles.status}>{resent ? "A fresh demo link is ready. No email was sent." : "Check your spam folder, or try another email address."}</p>
        <button type="button" className={styles.secondary} disabled={working} onClick={() => goTo("request")}>Change email address</button>
        <details className={styles.linkStates}><summary>Link not working?</summary><p>Explore what happens when a recovery link can’t be used.</p><div><button type="button" disabled={working} onClick={() => goTo("expired")}>Try an expired link</button><button type="button" disabled={working} onClick={() => goTo("invalid")}>Try an invalid link</button></div></details>
      </div>}

      {(stage === "expired" || stage === "invalid") && <div className={styles.stageBody}>
        <div className={styles.linkNotice}><Icon name={stage === "expired" ? "clock" : "link"} /><p>{stage === "expired" ? "For your security, a recovery link can only be used for a short time." : "Make sure you’ve copied the complete link from your latest recovery email."}</p></div>
        <p className={styles.demoHint}>This is an example link. Your account hasn’t been checked.</p>
        <button type="button" className={styles.primary} onClick={() => goTo("request")}>Request a new link <span aria-hidden="true">→</span></button>
        <button type="button" className={styles.exampleButton} onClick={() => goTo("sent")}>Back to the demo inbox</button>
      </div>}

      {stage === "reset" && <form action={resetPassword} noValidate aria-busy={working} className={styles.form}>
        <div className={styles.resetDemo}><strong>Try it with a made-up password.</strong><p>This demo won’t save your password or change your account.</p><button type="button" disabled={working} onClick={() => { setPassword(DEMO_PASSWORD); setConfirmation(DEMO_PASSWORD); setIssues({}); passwordInput.current?.focus(); }}>Use example passwords</button></div>
        <label className={styles.label} htmlFor="recovery-password">New password</label>
        <div className={`${styles.field} ${issues.password ? styles.invalidField : ""}`}><Icon name="lock" /><input ref={passwordInput} id="recovery-password" type={showPassword ? "text" : "password"} autoComplete="off" data-lpignore="true" data-1p-ignore="true" placeholder="Enter a made-up password" value={password} disabled={working} onChange={event => { setPassword(event.target.value); setIssues(current => ({ ...current, password: undefined })); }} aria-invalid={Boolean(issues.password)} aria-describedby={`password-requirements${issues.password ? " password-error" : ""}`} /><button type="button" className={styles.eyeButton} aria-label={showPassword ? "Hide new password" : "Show new password"} aria-pressed={showPassword} disabled={working} onClick={() => setShowPassword(value => !value)}><Icon name="eye" /></button></div>
        {issues.password && <p id="password-error" className={styles.error} role="alert">{issues.password}</p>}
        <ul id="password-requirements" className={styles.requirements} aria-label="Password requirements">
          {([["length", "At least 8 characters"]] as const).map(([key, label]) => <li key={key} className={requirements[key] ? styles.requirementMet : undefined}><span aria-hidden="true">{requirements[key] ? "✓" : "○"}</span><span className={styles.srOnly}>{requirements[key] ? "Met: " : "Required: "}</span>{label}</li>)}
        </ul>
        <label className={styles.label} htmlFor="recovery-confirmation">Confirm new password</label>
        <div className={`${styles.field} ${issues.confirmation ? styles.invalidField : ""}`}><Icon name="lock" /><input ref={confirmationInput} id="recovery-confirmation" type={showConfirmation ? "text" : "password"} autoComplete="off" data-lpignore="true" data-1p-ignore="true" placeholder="Enter it again" value={confirmation} disabled={working} onChange={event => { setConfirmation(event.target.value); setIssues(current => ({ ...current, confirmation: undefined })); }} aria-invalid={Boolean(issues.confirmation)} aria-describedby={issues.confirmation ? "confirmation-error" : undefined} /><button type="button" className={styles.eyeButton} aria-label={showConfirmation ? "Hide confirmed password" : "Show confirmed password"} aria-pressed={showConfirmation} disabled={working} onClick={() => setShowConfirmation(value => !value)}><Icon name="eye" /></button></div>
        {issues.confirmation && <p id="confirmation-error" className={styles.error} role="alert">{issues.confirmation}</p>}
        <SubmitButton className={styles.primary} pending="Finishing demo reset…">Reset example password <span aria-hidden="true">→</span></SubmitButton>
        <button type="button" className={styles.exampleButton} disabled={working} onClick={() => goTo("sent")}>Back to the demo inbox</button>
      </form>}

      {stage === "complete" && <div className={styles.stageBody}>
        <div className={styles.completeNotice}><Icon name="check" /><div><strong>Demo reset complete</strong><p>No password was saved or changed. Your existing sign-in details still apply.</p></div></div>
        <Link className={styles.primary} href="/login">Back to sign in <span aria-hidden="true">→</span></Link>
        <button type="button" className={styles.exampleButton} onClick={() => goTo("request")}>Try recovery again</button>
      </div>}

      <footer className={styles.footer}><span>Need a hand?</span><Link href="/support?topic=sign-in">Get help signing in <span aria-hidden="true">↗</span></Link></footer>
    </section>
  </div></div>;
}
