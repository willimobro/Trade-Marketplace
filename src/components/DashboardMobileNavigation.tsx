import Link from "next/link";
import { SourceIcon, type SourceIconName } from "./SourceIcon";
import styles from "./DashboardMobileNavigation.module.css";

export function DashboardMobileNavigation({ customer }: { customer: boolean }) {
  const items: { href: string; label: string; icon: SourceIconName }[] = [
    { href: "/", label: "Home", icon: "home" },
    { href: customer ? "/?view=search" : "/jobs", label: "Search", icon: "magnifier" },
    { href: "/dashboard", label: "Jobs", icon: "jobs" },
    { href: "/messages", label: "Messages", icon: "bubble" },
    { href: "/profile", label: "Account", icon: "person" },
  ];
  return <nav className={styles.navigation} aria-label="Main navigation">{items.map(item => <Link key={item.label} href={item.href} aria-label={item.label} title={item.label} aria-current={item.href === "/dashboard" ? "page" : undefined}><SourceIcon name={item.icon} size={26} navigation /></Link>)}</nav>;
}
