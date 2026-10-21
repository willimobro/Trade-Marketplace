// Editable presentation fixtures only. These are illustrative quote turnaround
// estimates for reserved seed IDs, never promises calculated for real jobs.
export const DEMO_QUOTE_ETAS: Readonly<Record<string, string>> = Object.freeze({
  "demo-job-1001": "Today by 4pm",
  "demo-job-1002": "Tomorrow by noon",
  "demo-job-1101": "Tomorrow",
  "demo-job-1116": "Within 2 days",
  "demo-job-1120": "Today",
});

export function demoQuoteEta(
  jobId: string,
  env: { TRADE_LOCAL_DEMO?: string; TRADE_HOSTED_PREVIEW?: string } = {
    TRADE_LOCAL_DEMO: process.env.TRADE_LOCAL_DEMO,
    TRADE_HOSTED_PREVIEW: process.env.TRADE_HOSTED_PREVIEW,
  },
): string | undefined {
  if (env.TRADE_LOCAL_DEMO !== "1" && env.TRADE_HOSTED_PREVIEW !== "1") return undefined;
  return Object.hasOwn(DEMO_QUOTE_ETAS, jobId) ? DEMO_QUOTE_ETAS[jobId] : undefined;
}
