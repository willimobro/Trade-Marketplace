"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Original mobile references render without the rejected draft application chrome. */
export function RouteFrame({ children, reference }: { children: ReactNode; reference: ReactNode }) {
  const pathname = usePathname();
  const sourceRoute = ["/", "/login", "/signup", "/jobs/new", "/jobs", "/dashboard"].includes(pathname) || /^\/(jobs|quote-jobs)\/[^/]+$/.test(pathname);
  return sourceRoute ? <main id="main-content" tabIndex={-1}>{reference}</main> : children;
}
