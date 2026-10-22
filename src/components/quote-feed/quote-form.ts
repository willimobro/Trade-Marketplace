import { validateQuote } from "@/lib/quote-demo/model";

export type QuoteFormError = { field: "amount" | "scope"; message: string };

/** Adapt the existing quote rules to an associated field before disabling it. */
export function quoteFormError(amount: string, scope: string): QuoteFormError | null {
  try { validateQuote(amount, "A complete scope for amount validation."); }
  catch (error) { return { field: "amount", message: error instanceof Error ? error.message : "Check your quote amount." }; }
  try { validateQuote(amount, scope); }
  catch (error) { return { field: "scope", message: error instanceof Error ? error.message : "Check what is included in your quote." }; }
  return null;
}
