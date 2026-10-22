"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultWorkspaceMode, parseWorkspaceMode, serializeWorkspaceMode, workspaceLinks, workspaceModeKey, type WorkspaceMode } from "@/lib/workspace-mode/preference";

type ModeContext = { mode: WorkspaceMode; enabled: boolean; ready: boolean; actualRole: string | null; storageError: string; setMode: (mode: WorkspaceMode) => void };
const Context = createContext<ModeContext>({ mode: "customer", enabled: false, ready: true, actualRole: null, storageError: "", setMode: () => {} });

export function WorkspaceModeProvider({ userId, role, enabled, children }: { userId: string | null; role: string | null; enabled: boolean; children: ReactNode }) {
  const fallback = defaultWorkspaceMode(role);
  const [mode, updateMode] = useState<WorkspaceMode>(fallback);
  const [ready, setReady] = useState(!enabled);
  const [storageError, setStorageError] = useState("");
  useEffect(() => {
    updateMode(fallback); setStorageError("");
    if (enabled && userId) {
      try { updateMode(parseWorkspaceMode(localStorage.getItem(workspaceModeKey(userId))) ?? fallback); }
      catch { setStorageError("This browser can’t remember your mode. You can still switch for this visit."); }
    }
    setReady(true);
    // Deliberately no storage-event listener: another tab must not replace an
    // in-progress editor's mode. Each tab changes only through its own control.
  }, [enabled, userId, fallback]);

  function setMode(next: WorkspaceMode) {
    if (!enabled || !userId || !ready) return;
    updateMode(next);
    try { localStorage.setItem(workspaceModeKey(userId), serializeWorkspaceMode(next)); setStorageError(""); }
    catch { setStorageError("This browser can’t remember your mode. Your selection lasts for this visit."); }
  }
  return <Context.Provider value={{ mode: enabled ? mode : fallback, enabled, ready, actualRole: role, storageError, setMode }}>{children}</Context.Provider>;
}

export function useWorkspaceMode() { return useContext(Context); }
export function useWorkspaceLinks(role: string | null) { const { mode, enabled } = useWorkspaceMode(); return workspaceLinks(role, mode, enabled); }

/** Changes presentation only; server-rendered authorized children stay scoped to their actual account. */
export function WorkspaceModeView({ mode, children }: { mode: WorkspaceMode; children: ReactNode }) {
  const current = useWorkspaceMode();
  return !current.enabled || current.mode === mode ? children : null;
}
