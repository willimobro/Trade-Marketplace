"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { brandMode } from "@/lib/brand-mode";
import { useWorkspaceMode } from "./workspace-mode/WorkspaceMode";

/** Route-aware app root avoids a stale theme after client-side navigation. */
export function BrandMode({ role, children }: { role: string | null; children: ReactNode }) {
  const pathname = usePathname();
  const workspace = useWorkspaceMode();
  const presentationRole = workspace.enabled ? workspace.mode === "trade" ? "TRADIE" : "CUSTOMER" : role;
  return <div id="application" data-mode={brandMode(presentationRole, pathname)} className="contents">{children}</div>;
}
