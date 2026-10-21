/** Explicit desktop adaptations. Focused auth/payment/support routes stay bounded. */
export function hasDesktopNavigation(path: string) {
  return ["/", "/jobs", "/dashboard", "/jobs/new", "/messages", "/profile"].includes(path)
    || /^\/jobs\/[^/]+$/.test(path)
    || path === "/admin" || path.startsWith("/admin/");
}

export function hasDesktopWorkspace(path: string) {
  return path === "/messages" || path === "/profile"
    || path === "/admin" || path.startsWith("/admin/");
}
