"use client";

import Link from "next/link";
import { useRef } from "react";
import { useWorkspaceMode } from "./WorkspaceMode";
import styles from "./account-mode.module.css";

/** Brand guide p15: Profile → Account mode. Labels follow p24 Forest contrast. */
export function AccountModeSwitch() {
  const { enabled, ready, mode, setMode, storageError } = useWorkspaceMode();
  const customer = useRef<HTMLButtonElement>(null);
  const trade = useRef<HTMLButtonElement>(null);
  if (!enabled) return null;
  return <section className={styles.section} id="account-mode" aria-labelledby="account-mode-heading">
    <h2 id="account-mode-heading">Account mode</h2>
    <p>Get work done, or find work. One account.</p>
    <div className={styles.switch} role="radiogroup" aria-labelledby="account-mode-heading" onKeyDown={event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || !ready) return;
      event.preventDefault();
      const next = event.key === "Home" ? "customer" : event.key === "End" ? "trade" : mode === "customer" ? "trade" : "customer";
      setMode(next); (next === "customer" ? customer : trade).current?.focus();
    }}>
      <button ref={customer} type="button" role="radio" aria-checked={mode === "customer"} tabIndex={mode === "customer" ? 0 : -1} disabled={!ready} className={mode === "customer" ? styles.customer : ""} onClick={() => setMode("customer")}>Customer</button>
      <button ref={trade} type="button" role="radio" aria-checked={mode === "trade"} tabIndex={mode === "trade" ? 0 : -1} disabled={!ready} className={mode === "trade" ? styles.trade : ""} onClick={() => setMode("trade")}>Trade</button>
    </div>
    <p className={styles.state} role="status">{ready ? mode === "customer" ? "Customer mode · Get work done" : "Trade mode · Find and quote work" : "Loading your mode…"}</p>
    {storageError && <p role="status">{storageError}</p>}
    <Link href="/dashboard" className={styles.open}>Open {mode === "customer" ? "customer" : "trade"} workspace <span aria-hidden="true">→</span></Link>
  </section>;
}

export function CurrentModeLink({ compact = false }: { compact?: boolean }) {
  const { enabled, mode } = useWorkspaceMode();
  if (!enabled) return null;
  return <Link href="/profile#account-mode" className={`${styles.modeLink} ${compact ? styles.compact : ""}`}><span className={mode === "trade" ? styles.orangeDot : styles.greenDot} aria-hidden="true" />{mode === "trade" ? "Trade" : "Customer"} mode <span aria-hidden="true">⇄</span></Link>;
}
