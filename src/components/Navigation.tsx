"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "CUSTOMER" | "TRADIE" | "ADMIN" | string;
const paths = {
  CUSTOMER: [["/dashboard", "My jobs"], ["/jobs/new", "Post a job"], ["/messages", "Messages"], ["/profile", "Account"]],
  TRADIE: [["/dashboard", "My work"], ["/jobs", "Find work"], ["/messages", "Messages"], ["/profile", "Account"]],
  ADMIN: [["/admin", "Operations"], ["/admin/tradies", "Electricians"], ["/admin/payouts", "Payouts"], ["/admin/settings", "Settings"], ["/messages", "Messages"], ["/profile", "Account"]],
};
export function Navigation({ role, mobile = false }: { role: Role; mobile?: boolean }) {
  const pathname = usePathname();
  const entries = paths[role as keyof typeof paths] ?? paths.CUSTOMER;
  return (
    <nav aria-label={mobile ? "Mobile navigation" : "Workspace navigation"} className={mobile ? `grid gap-1 p-2 lg:hidden ${entries.length > 4 ? "grid-cols-3" : "grid-cols-4"}` : "flex flex-col gap-2"}>
      {entries.map(([href, label]) => {
        const active = pathname === href || (href !== "/admin" && href !== "/jobs" && pathname.startsWith(href + "/"));
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-12 shrink-0 items-center gap-2 rounded-xl py-3 text-sm font-medium transition ${mobile ? "justify-center px-1 text-xs sm:text-sm" : "px-4"} ${active ? "bg-lime text-forest" : "text-white/85 hover:bg-white/10 hover:text-white"}`}>
          <span aria-hidden className={`hidden h-1.5 w-1.5 rounded-full lg:block ${active ? "bg-forest" : "bg-lime/60"}`} />{label}
        </Link>;
      })}
    </nav>
  );
}
