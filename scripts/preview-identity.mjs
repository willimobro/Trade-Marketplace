import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const PREVIEW_ASSERTION_HEADER = "x-trade-preview-gate";
const bootIdentity = Symbol.for("trade-marketplace.hosted-preview.boot-identity");

// Called only by the custom server after isolated storage initialization.
// Ordinary next start has no identity, even if an environment flag is supplied.
export function initializePreviewIdentity() {
  if (globalThis[bootIdentity]) throw new Error("Preview identity already initialized");
  const token = randomBytes(32).toString("hex");
  Object.defineProperty(globalThis, bootIdentity, { value: token, writable: false, configurable: false });
  return token;
}

export function hasPreviewIdentity(mode, assertion) {
  const expected = globalThis[bootIdentity];
  if (mode !== "1" || typeof expected !== "string" || typeof assertion !== "string") return false;
  const digest = value => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(assertion), digest(expected));
}

export function previewAccount(role) {
  const accounts = {
    customer: { email: "customer@demo.test", next: "/dashboard" },
    tradie: { email: "sparky@demo.test", next: "/dashboard" },
    admin: { email: "admin@demo.test", next: "/admin" },
  };
  return typeof role === "string" && Object.hasOwn(accounts, role) ? accounts[role] : null;
}
