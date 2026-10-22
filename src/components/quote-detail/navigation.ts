import { demoTrade, findDemoJob } from "@/lib/quote-demo/jobs";

export type QuoteDetailOrigin = { quoteView?: string | string[]; trade?: string | string[]; quoteJob?: string | string[] };

/** Carry only recognized workspace context back from a sample detail page. */
export function quoteDetailBackHref(origin: QuoteDetailOrigin): string {
  const quoteView = typeof origin.quoteView === "string" && ["feed", "available", "quoted", "claimed"].includes(origin.quoteView) ? origin.quoteView : "feed";
  const params = new URLSearchParams({ quoteView });
  const trade = demoTrade(typeof origin.trade === "string" ? origin.trade : null);
  if (trade) params.set("trade", trade);
  if (typeof origin.quoteJob === "string" && findDemoJob(origin.quoteJob)?.stage === "quoting") params.set("quoteJob", origin.quoteJob);
  return `/dashboard?${params}`;
}
