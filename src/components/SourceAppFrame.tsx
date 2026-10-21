"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import styles from "./SourceAppFrame.module.css";

/** Generic adaptation for routes with no original screen, not an original admin design.
 * Header: 115:110 (61px white / forest text, black 5% shadow).
 * Navigation: 31:348–354 (64px white, five original SF glyphs at y14).
 */
export function SourceAppFrame({ children, role }: { children: ReactNode; role: string | null }) {
  const path = usePathname();
  const [fontsUnavailable, setFontsUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.all([document.fonts.load('400 26px "Shell SF Regular"'), document.fonts.load('760 20px "Shell SF Expanded"')])
      .then((faces) => { if (active && faces.some((loaded) => loaded.length === 0 || loaded.some((face) => face.status !== "loaded"))) setFontsUnavailable(true); })
      .catch(() => { if (active) setFontsUnavailable(true); });
    return () => { active = false; };
  }, []);
  const title = path.startsWith("/admin") ? "Administration" : path.startsWith("/pay/") ? "Test payment" : path.startsWith("/receipts/") ? "Payment record" : path.startsWith("/profile") ? "Account" : path.startsWith("/messages") ? "Messages" : path.startsWith("/notifications") ? "Notifications" : path.startsWith("/support") ? "Help & support" : path.startsWith("/tradies/") ? "Electrician profile" : "Trade Marketplace";
  const items = [
    { href: "/", label: "Home", glyph: "\u{10039f}" },
    { href: role === "CUSTOMER" ? "/?view=search" : "/jobs", label: "Search", glyph: "\u{1002ab}" },
    { href: role === "ADMIN" ? "/admin" : "/dashboard", label: "Jobs", glyph: "\u{10035d}" },
    { href: "/messages", label: "Messages", glyph: "\u{100324}" },
    { href: role ? "/profile" : "/login", label: "Account", glyph: "\u{100269}" },
  ];
  return <div className={styles.frame}>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <header className={styles.header}><Link href={role === "ADMIN" ? "/admin" : role ? "/dashboard" : "/"} aria-label="Back to workspace" className={styles.back}>←</Link><p className={styles.title}>{title}</p></header>
    <p className={styles.disclosure}>Development preview · Payments are simulated. No money is charged.</p>
    {fontsUnavailable && <p role="status" className={styles.notice}>Original SF Pro fonts unavailable. Text and navigation labels use a fallback and are not an exact source match.</p>}
    <main id="main-content" tabIndex={-1} className={styles.content}>{children}</main>
    <nav aria-label="Workspace utilities" className={styles.utilities}>
      <Link href="/support">Help &amp; support</Link>
      <Link href="/notifications">Notifications</Link>
      {role === "ADMIN" && <Link href="/admin">Administration</Link>}
      {role ? <form action={logout}><button>Log out</button></form> : <Link href="/login">Log in</Link>}
    </nav>
    <nav aria-label="Main navigation" className={styles.navigation}>
      {items.map((item) => <Link key={item.label} href={item.href} aria-label={item.label} aria-current={path === item.href || (item.href !== "/" && path.startsWith(`${item.href}/`)) ? "page" : undefined} title={item.label}>
        {fontsUnavailable ? <span className={styles.fallback}>{item.label}</span> : <span aria-hidden="true" className={styles.glyph}>{item.glyph}</span>}
      </Link>)}
    </nav>
  </div>;
}
