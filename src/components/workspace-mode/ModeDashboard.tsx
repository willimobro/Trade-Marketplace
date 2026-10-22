"use client";

import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { SourceIcon } from "@/components/SourceIcon";
import { DashboardMobileNavigation } from "@/components/DashboardMobileNavigation";
import { TradieQuoteWorkspace } from "@/components/quote-feed/TradieQuoteWorkspace";
import { DemoCustomerWorkspace } from "./DemoCustomerWorkspace";
import { CurrentModeLink } from "./AccountModeSwitch";
import { useWorkspaceLinks, useWorkspaceMode } from "./WorkspaceMode";
import styles from "@/app/dashboard/dashboard.module.css";

export function ModeDashboard({ user, customerJobs, tradieActivity, initialCustomerView }: {
  user: { id: string; name: string; role: string; trade: string | null; region: string | null };
  customerJobs?: ReactNode; tradieActivity?: ReactNode; initialCustomerView: "jobs" | "post";
}) {
  const { mode, ready } = useWorkspaceMode();
  const destinations = useWorkspaceLinks(user.role);
  const customer = mode === "customer";
  return <div className={`${styles.page} ${customer ? styles.customerPage : ""}`}>
    <header className={`${styles.header} ${customer ? styles.customerHeader : styles.quoteHeader}`}>
      <nav className={styles.nav} aria-label="Dashboard navigation"><Link href={destinations.home}>Home</Link><CurrentModeLink /><Link href="/profile">Account</Link></nav>
      <div><h1 className={styles.heading}>{customer ? "Your jobs" : `Kia ora, ${user.name.split(" ")[0]}`}</h1>{!customer && <p className={styles.subtitle}>{user.trade ?? "All trades"}{user.region ? ` · ${user.region}` : ""}</p>}</div>
      {customer && <Link href={destinations.post} className={`${styles.secondary} ${styles.actions}`}><SourceIcon name="plus-square" size={20} />Post a job</Link>}
    </header>
    {!ready ? <p className={styles.section} role="status">Opening your workspace…</p> : customer ? user.role === "CUSTOMER" ? customerJobs : <Suspense fallback={<p role="status">Opening customer jobs…</p>}><DemoCustomerWorkspace userId={user.id} initialView={initialCustomerView} /></Suspense> : <>
      <Suspense fallback={<p role="status">Opening quote feed…</p>}><TradieQuoteWorkspace key={user.id} userId={user.id} trade={user.trade} /></Suspense>
      {tradieActivity && <details className={styles.existingWorkspace}><summary>Existing job activity</summary>{tradieActivity}</details>}
    </>}
    <DashboardMobileNavigation customer={customer} />
  </div>;
}
