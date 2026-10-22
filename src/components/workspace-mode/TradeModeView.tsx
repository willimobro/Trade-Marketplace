"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useWorkspaceMode } from "./WorkspaceMode";
import styles from "./account-mode.module.css";

/** A direct work-detail link never silently switches the user's chosen mode. */
export function TradeModeView({ children }: { children: ReactNode }) {
  const { enabled, ready, mode, setMode } = useWorkspaceMode();
  const [focusDetail, setFocusDetail] = useState(false);
  useEffect(() => {
    if (focusDetail && ready && mode === "trade") {
      document.getElementById("job-title")?.focus();
      setFocusDetail(false);
    }
  }, [focusDetail, mode, ready]);
  if (!ready) return <p role="status" className={styles.section}>Opening your workspace…</p>;
  if (!enabled || mode === "trade") return children;
  return <section className={styles.section}>
    <h1>This is a job to quote</h1>
    <p>Open it in Trade mode. Your customer jobs stay saved.</p>
    <button type="button" className={styles.open} onClick={() => { setFocusDetail(true); setMode("trade"); }}>Open in Trade mode →</button>
    <p><Link href="/dashboard" className={styles.open}>Back to customer jobs</Link></p>
  </section>;
}
