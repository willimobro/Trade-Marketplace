/** Explicit desktop adaptations; each page retains a readable content width. */
export function hasDesktopNavigation(path: string) {
  return ["/", "/jobs", "/dashboard", "/jobs/new", "/messages", "/profile", "/support", "/recovery", "/notifications", "/preview/journey", "/for-tradies"].includes(path)
    || /^\/jobs\/[^/]+$/.test(path)
    || /^\/(pay|receipts|tradies)\/[^/]+$/.test(path)
    || path === "/admin" || path.startsWith("/admin/");
}

export function hasDesktopWorkspace(path: string) {
  return ["/messages", "/profile", "/support", "/recovery", "/notifications", "/preview/journey", "/for-tradies"].includes(path)
    || /^\/(pay|receipts|tradies)\/[^/]+$/.test(path)
    || path === "/admin" || path.startsWith("/admin/");
}
