"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./ui";
import { SourceIcon, type SourceIconName } from "./SourceIcon";
import { hasDesktopNavigation } from "@/lib/desktop-routes";
import styles from "./DesktopNavigation.module.css";

/** Desktop adaptation of the approved mobile brand; mobile navigation stays intact. */
export function DesktopNavigation({ role }: { role: string | null }) {
  const path = usePathname();
  if (!hasDesktopNavigation(path)) return null;
  const items: { href: string; label: string; icon: SourceIconName }[] = [
    { href: "/", label: "Browse", icon: "home" },
    ...(role !== "CUSTOMER" && role !== "ADMIN" ? [{ href: "/jobs", label: "Find work", icon: "magnifier" as const }] : []),
    { href: role === "ADMIN" ? "/admin" : "/dashboard", label: role === "ADMIN" ? "Operations" : "Your jobs", icon: "jobs" },
    { href: "/messages", label: "Messages", icon: "bubble" },
    { href: role ? "/profile" : "/login", label: role ? "Account" : "Log in", icon: "person" },
  ];
  return <header className={styles.header}>
    <div className={styles.inner}><Logo />
      <nav aria-label="Desktop navigation" className={styles.links}>{items.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : item.href !== "/" && path.startsWith(item.href + "/") ? "location" : undefined}><SourceIcon name={item.icon} size={21} navigation /><span>{item.label}</span></Link>)}</nav>
      {(!role || role === "CUSTOMER") && <Link href="/jobs/new" className={styles.post}>Post a job</Link>}
    </div>
  </header>;
}
