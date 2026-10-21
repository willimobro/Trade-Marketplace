/** Shared account/configuration surfaces keep the customer brand in every role. */
const sharedRoutes = ["/login", "/signup", "/recovery", "/profile", "/settings", "/admin", "/preview", "/demo", "/support", "/notifications", "/jobs/new"];
export function brandMode(role: string | null, pathname: string | null): "customer" | "trade" {
  if (role !== "TRADIE" || !pathname) return "customer";
  return sharedRoutes.some(route => pathname === route || pathname.startsWith(route + "/")) ? "customer" : "trade";
}
