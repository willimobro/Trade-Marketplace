"use client";

import styles from "./admin.module.css";


import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [["/admin", "Operations"], ["/admin/tradies", "Trade verification"], ["/admin/payouts", "Payroll"], ["/admin/settings", "Rates & settings"]] as const;

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Administration" className={styles.nav}>
      {links.map(([href, label]) => {
        const active = pathname === href;
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-12 items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition ${active ? "border-forest bg-forest text-white" : "border-black/10 bg-white text-ink hover:bg-lime/15"}`}>{label}</Link>;
      })}
    </nav>
  );
}
