"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { workspaceHomeRedirect } from "@/lib/workspace-mode/preference";
import { useWorkspaceMode } from "./WorkspaceMode";

/** Prevent a direct legacy home/search entry from changing presentation mode.
 * Authorization and the ordinary server-owned browse data stay unchanged. */
export function WorkspaceHome({ search, children }: { search: boolean; children: ReactNode }) {
  const { mode, actualRole, enabled, ready } = useWorkspaceMode();
  const router = useRouter();
  const destination = ready ? workspaceHomeRedirect(actualRole, mode, enabled, search) : null;
  useEffect(() => { if (destination) router.replace(destination); }, [destination, router]);
  if (enabled && (!ready || destination)) return <p className="px-4 py-8" role="status">Opening your {mode === "trade" ? "trade" : "customer"} workspace…</p>;
  return children;
}
