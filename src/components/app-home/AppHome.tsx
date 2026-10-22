"use client";

import Image from "next/image";
import { DashboardNavigationLink } from "@/components/DashboardNavigationLink";
import { DashboardMobileNavigation } from "@/components/DashboardMobileNavigation";
import { CurrentModeLink } from "@/components/workspace-mode/AccountModeSwitch";
import { useWorkspaceMode } from "@/components/workspace-mode/WorkspaceMode";
import { CustomerHome } from "./CustomerHome";
import { TradeHome } from "./TradeHome";
import styles from "./app-home.module.css";

export function AppHome({ user, activeJobs, pendingPayCents }: {
  user: { id: string; name: string; role: string; region: string };
  activeJobs: { id: string; title: string; cover: string | null; status: string }[];
  pendingPayCents: number;
}) {
  const workspace = useWorkspaceMode();
  const customer = workspace.mode === "customer";
  return <div className={styles.page}>
    <header className={styles.mobileHeader}>
      <DashboardNavigationLink href="/" aria-label="Trade Marketplace home"><Image src="/brand/wordmark.svg" width={156} height={40} alt="Trade Marketplace" priority /></DashboardNavigationLink>
      <div><CurrentModeLink compact /><a href="/website" className={styles.website}>Website <span aria-hidden="true">↗</span></a></div>
    </header>
    {!workspace.ready ? <p className={styles.loading} role="status">Opening Home…</p> : customer ? <CustomerHome userId={user.id} role={user.role} region={user.region} /> : <TradeHome userId={user.id} name={user.name} prototype={workspace.enabled} activeJobs={activeJobs} pendingPayCents={pendingPayCents} />}
    <DashboardMobileNavigation customer={customer} />
  </div>;
}
