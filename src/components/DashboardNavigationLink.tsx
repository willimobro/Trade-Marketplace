import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

/** App entry and Dashboard view changes perform a real navigation. The intercepted
 * query-only transition can leave an actual tradie's server-rendered workspace
 * unchanged. Native anchors also preserve modifier clicks and browser history. */
export function DashboardNavigationLink({ href, ...props }: ComponentPropsWithoutRef<"a"> & { href: string }) {
  return ["/dashboard", "/", "/website"].includes(href.split(/[?#]/, 1)[0])
    ? <a href={href} {...props} />
    : <Link href={href} {...props} />;
}
