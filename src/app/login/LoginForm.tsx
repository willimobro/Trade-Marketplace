"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { login } from "@/app/actions/auth";
import styles from "./login.module.css";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fontsUnavailable, setFontsUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.all([
      document.fonts.load('760 36px "Original SF Expanded"'),
      document.fonts.load('700 14px "Original SF Bold"'),
      document.fonts.load('400 16px "Original SF Regular"'),
    ]).then(faces => {
      if (active && faces.some(loaded => loaded.length === 0 || loaded.some(face => face.status !== "loaded"))) setFontsUnavailable(true);
    }).catch(() => { if (active) setFontsUnavailable(true); });
    return () => { active = false; };
  }, []);
  return <form action={action} className={styles.form} aria-busy={pending}>
    {fontsUnavailable && <p role="status" className={styles.fontNotice}>Original SF Pro fonts unavailable on this device. Fallback text is not an exact match.</p>}
    <input type="hidden" name="next" value={next ?? ""} />
    <label className={styles.srOnly} htmlFor="email">Email</label>
    <svg className={`${styles.icon} ${styles.mail}`} aria-hidden="true"><text x="0" y="15.1875">{"\u{100355}"}</text></svg>
    <input className={`${styles.input} ${styles.email}`} id="email" name="email" type="email" autoComplete="email" placeholder="" value={email} onChange={event => setEmail(event.target.value)} aria-describedby={state?.error ? "login-error" : undefined} required />
    {email === "" && <svg className={`${styles.emptyText} ${styles.emptyEmail}`} width="253" height="19" aria-hidden="true"><text x="30.234375 37.958984375 45.30078125 53.025390625 65.20703125 73.751953125 77.29296875 85.291015625 98.142578125 106.140625 118.322265625 126.046875 129.505859375 133.046875 136.9296875 144.763671875 153.03515625" y="15.1875">example@email.com</text></svg>}
    {/* Source glyph is decorative, not a claim that an account was verified. */}
    <svg className={`${styles.icon} ${styles.emailCheck}`} aria-hidden="true"><text x="0" y="15.1875">{"\u{100185}"}</text></svg>
    <span className={`${styles.rule} ${styles.emailRule}`} aria-hidden="true" />
    <label className={styles.srOnly} htmlFor="password">Password</label>
    <svg className={`${styles.icon} ${styles.lock}`} aria-hidden="true"><text x="0" y="15.1875">{"\u{1003a0}"}</text></svg>
    <input className={`${styles.input} ${styles.password}`} id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="" value={password} onChange={event => setPassword(event.target.value)} aria-describedby={state?.error ? "login-error" : undefined} required />
    {password === "" && <svg className={`${styles.emptyText} ${styles.emptyPassword}`} width="253" height="19" aria-hidden="true"><text x="26.046875 33.796875 41.546875 49.296875 57.046875 64.796875 72.546875 80.296875 88.046875 95.796875 103.546875" y="15.1875">•••••••••••</text></svg>}
    <button type="button" className={styles.showPassword} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}><svg width="25" height="19" aria-hidden="true"><text x="0" y="15.1875">{"\u{1002ef}"}</text></svg></button>
    <span className={`${styles.rule} ${styles.passwordRule}`} aria-hidden="true" />
    <Link href="/recovery" className={styles.forgot} aria-label="Forgot password? Recovery preview"><svg width="167" height="27" aria-hidden="true"><text x="40.97265625 49.33984375 58.021484375 63.955078125 72.9921875 81.673828125 87.45703125 91.06640625 100.130859375 108.388671875 116.181640625 123.90625 135.458984375 144.140625 150.07421875 159.193359375" y="17.4765625">Forgot password?</text></svg></Link>
    {state?.error && <p id="login-error" role="alert" className={styles.error}>{state.error}</p>}
    <button type="submit" className={`${styles.action} ${styles.primary}`} disabled={pending} aria-label={pending ? "Logging in…" : "Log in"}><svg aria-hidden="true"><text x="160.5" y="31.4765625" textAnchor="middle">{pending ? "Logging in…" : "Log in"}</text></svg></button>
    <span className={`${styles.separator} ${styles.separatorLeft}`} aria-hidden="true" /><span className={`${styles.separator} ${styles.separatorRight}`} aria-hidden="true" />
    <svg className={styles.or} aria-hidden="true"><text x="76.1103515625" y="13.4765625">or</text></svg>
    <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className={`${styles.action} ${styles.secondary}`} aria-label="Sign Up"><svg aria-hidden="true"><text x="160.5" y="31.4765625" textAnchor="middle">Sign Up</text></svg></Link>
  </form>;
}
