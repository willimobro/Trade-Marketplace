"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Logo } from "./ui";
import { SourceIcon, type SourceIconName } from "./SourceIcon";
import { hasDesktopNavigation } from "@/lib/desktop-routes";
import styles from "./DesktopNavigation.module.css";
import { useWorkspaceLinks, useWorkspaceMode } from "./workspace-mode/WorkspaceMode";
import { CurrentModeLink } from "./workspace-mode/AccountModeSwitch";
import { DashboardNavigationLink } from "./DashboardNavigationLink";

/** Desktop adaptation of the approved mobile brand; mobile navigation stays intact. */
export function DesktopNavigation({ role }: { role: string | null }) {
  const path = usePathname();
  const search = useSearchParams();
  const workspace = useWorkspaceMode();
  const destinations = useWorkspaceLinks(role);
  const viewRole = workspace.enabled ? workspace.mode === "trade" ? "TRADIE" : "CUSTOMER" : role;
  const findWork = workspace.enabled && workspace.mode === "trade" && path === "/dashboard" && search.get("quoteView") === "feed";
  if (!hasDesktopNavigation(path)) return null;
  const items: { href: string; label: string; icon: SourceIconName }[] = [
    { href: destinations.home, label: "Home", icon: "home" },
    ...(viewRole !== "CUSTOMER" && viewRole !== "ADMIN" ? [{ href: destinations.search, label: "Find work", icon: "magnifier" as const }] : []),
    { href: role === "ADMIN" ? "/admin" : "/dashboard", label: role === "ADMIN" ? "Operations" : "Your jobs", icon: "jobs" },
    { href: "/messages", label: "Messages", icon: "bubble" },
    { href: role ? "/profile" : "/login", label: role ? "Account" : "Log in", icon: "person" },
  ];
  return <header className={styles.header}>
    <div className={styles.inner}><Logo href={destinations.home} />
      <nav aria-label="Desktop navigation" className={styles.links}>{items.map(item => <DashboardNavigationLink key={item.label} href={item.href} aria-current={findWork ? item.label === "Find work" ? "page" : undefined : path === item.href && (item.label !== "Home" || !search.get("view")) ? "page" : item.href !== "/" && path.startsWith(item.href + "/") ? "location" : undefined}><SourceIcon name={item.icon} size={21} navigation /><span>{item.label}</span></DashboardNavigationLink>)}</nav>
      <CurrentModeLink compact />
      {role && <a href="/website" className={styles.website}>Website ↗</a>}
      {path !== "/" && (!viewRole || viewRole === "CUSTOMER") && <Link href={destinations.post} className={styles.post}>Post a job</Link>}
    </div>
  </header>;
}
