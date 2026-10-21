/** Additional account boundary for the browser-only quote simulation. */
const SAMPLE_TRADIES = new Set(["sparky@demo.test", "sparky2@demo.test", "sparky3@demo.test"]);
export function allowsQuoteDemo(runtimeAllowed: boolean, user: { role: string; email: string }): boolean {
  return runtimeAllowed && user.role === "TRADIE" && SAMPLE_TRADIES.has(user.email);
}
