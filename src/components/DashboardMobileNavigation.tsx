"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SourceIcon, type SourceIconName } from "./SourceIcon";
import styles from "./DashboardMobileNavigation.module.css";
import { useWorkspaceLinks, useWorkspaceMode } from "./workspace-mode/WorkspaceMode";

export function DashboardMobileNavigation({ customer }: { customer: boolean }) {
  const workspace = useWorkspaceMode();
  const destinations = useWorkspaceLinks(workspace.actualRole ?? (customer ? "CUSTOMER" : "TRADIE"));
  const path = usePathname();
  const search = useSearchParams();
  const findWork = workspace.enabled && workspace.mode === "trade" && path === "/dashboard" && search.get("quoteView") === "feed";
  const items: { href: string; label: string; icon: SourceIconName }[] = [
    { href: destinations.home, label: "Home", icon: "home" },
    { href: destinations.search, label: "Search", icon: "magnifier" },
    { href: "/dashboard", label: "Jobs", icon: "jobs" },
    { href: "/messages", label: "Messages", icon: "bubble" },
    { href: "/profile", label: "Account", icon: "person" },
  ];
  return <nav className={styles.navigation} aria-label="Main navigation">{items.map(item => <Link key={item.label} href={item.href} aria-label={item.label} title={item.label} aria-current={findWork ? item.label === "Search" ? "page" : undefined : item.label === "Jobs" && (path === "/dashboard" || path.startsWith("/quote-jobs/")) ? "page" : undefined}><SourceIcon name={item.icon} size={26} navigation /></Link>)}</nav>;
}
