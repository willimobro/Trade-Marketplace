"use client";

import Link from "next/link";
import { defaultWorkspaceMode, workspaceLinks } from "@/lib/workspace-mode/preference";
import { useWorkspaceMode } from "@/components/workspace-mode/WorkspaceMode";

/** Returning from public marketing reads the chosen mode without changing it. */
export function LandingWorkspaceReturn({ role, compact = false, className }: { role: string; compact?: boolean; className: string }) {
  const workspace = useWorkspaceMode();
  const mode = workspace.enabled ? workspace.mode : defaultWorkspaceMode(role);
  const destination = role === "ADMIN" ? "/admin" : workspaceLinks(role, mode, workspace.enabled).home;
  const modeName = role === "ADMIN" ? "admin" : mode === "trade" ? "Trade" : "Customer";
  const label = workspace.ready ? `Return to ${modeName} home` : "Return to your Home";
  return <Link href={destination} className={className} aria-label={label}>
    {compact ? "Open app" : <>{label}<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg></>}
  </Link>;
}
