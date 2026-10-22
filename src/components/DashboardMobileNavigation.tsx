"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SourceIcon, type SourceIconName } from "./SourceIcon";
import styles from "./DashboardMobileNavigation.module.css";
import { useWorkspaceLinks, useWorkspaceMode } from "./workspace-mode/WorkspaceMode";

export function DashboardMobileNavigation({ customer }: { customer: boolean }) {
  const workspace = useWorkspaceMode();
  const destinations = useWorkspaceLinks(workspace.actualRole ?? (customer ? "CUSTOMER" : "TRADIE"));
  const path = usePathname();
  const items: { href: string; label: string; icon: SourceIconName }[] = [
    { href: destinations.home, label: "Home", icon: "home" },
    { href: destinations.search, label: "Search", icon: "magnifier" },
    { href: "/dashboard", label: "Jobs", icon: "jobs" },
    { href: "/messages", label: "Messages", icon: "bubble" },
    { href: "/profile", label: "Account", icon: "person" },
  ];
  return <nav className={styles.navigation} aria-label="Main navigation">{items.map(item => <Link key={item.label} href={item.href} aria-label={item.label} title={item.label} aria-current={item.label === "Jobs" && (path === "/dashboard" || path.startsWith("/quote-jobs/")) ? "page" : undefined}><SourceIcon name={item.icon} size={26} navigation /></Link>)}</nav>;
}
