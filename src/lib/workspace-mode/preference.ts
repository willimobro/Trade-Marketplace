export type WorkspaceMode = "customer" | "trade";

const sampleCustomers = new Set(["customer@demo.test", "customer2@demo.test"]);
const sampleTradies = new Set(["sparky@demo.test", "sparky2@demo.test", "sparky3@demo.test"]);

/** Presentation-only eligibility. Never use this as authorization for job actions. */
export function allowsWorkspaceDemo(runtimeAllowed: boolean, user: { role: string; email: string } | null): boolean {
  return !!user && runtimeAllowed && (user.role === "CUSTOMER" && sampleCustomers.has(user.email) || user.role === "TRADIE" && sampleTradies.has(user.email));
}

export function defaultWorkspaceMode(role: string | null): WorkspaceMode { return role === "TRADIE" ? "trade" : "customer"; }
export function workspaceModeKey(userId: string): string { return `tm-workspace-mode-v1:${encodeURIComponent(userId)}`; }
export function parseWorkspaceMode(raw: string | null): WorkspaceMode | null {
  if (!raw || raw.length > 200) return null;
  try { const value = JSON.parse(raw); return value?.version === 1 && (value.mode === "customer" || value.mode === "trade") ? value.mode : null; }
  catch { return null; }
}
export function serializeWorkspaceMode(mode: WorkspaceMode): string { return JSON.stringify({ version: 1, mode }); }

/** UI destinations remain inside the synthetic workspace for a simulated role. */
export function workspaceLinks(role: string | null, mode: WorkspaceMode, enabled: boolean) {
  const syntheticCustomer = enabled && mode === "customer" && role === "TRADIE";
  const syntheticTrade = enabled && mode === "trade" && role === "CUSTOMER";
  return {
    home: syntheticCustomer || syntheticTrade ? "/dashboard" : "/",
    search: enabled && mode === "trade" ? "/dashboard?quoteView=feed" : syntheticCustomer ? "/dashboard" : role === "CUSTOMER" ? "/?view=search" : "/jobs",
    jobs: role === "ADMIN" ? "/admin" : "/dashboard",
    post: syntheticCustomer ? "/dashboard?customerView=post" : "/jobs/new",
  };
}
