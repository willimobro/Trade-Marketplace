"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { brandMode } from "@/lib/brand-mode";

/** Route-aware app root avoids a stale theme after client-side navigation. */
export function BrandMode({ role, children }: { role: string | null; children: ReactNode }) {
  const pathname = usePathname();
  return <div id="application" data-mode={brandMode(role, pathname)} className="contents">{children}</div>;
}
