import { DEMO_JOBS, DEMO_TRADES, findDemoJob } from "@/lib/quote-demo/jobs";

export type WorkspaceTab = "feed" | "available" | "quoted" | "claimed";
export type WorkspaceNavigation = { tab: WorkspaceTab; trade: string; quoteJob?: string };
export type WorkspaceSession = { skipped: string[]; quoteJob?: string };

function validTrade(value: string | null): string {
  return DEMO_TRADES.some((trade) => trade === value) ? value! : "all";
}

function validFeedJob(value: unknown): string | undefined {
  return typeof value === "string" && findDemoJob(value)?.stage === "quoting" ? value : undefined;
}

export function readWorkspaceNavigation(search: string): WorkspaceNavigation {
  const params = new URLSearchParams(search);
  const tab = params.get("quoteView");
  return {
    tab: tab && ["feed", "available", "quoted", "claimed"].includes(tab) ? tab as WorkspaceTab : "claimed",
    trade: validTrade(params.get("trade")),
    quoteJob: validFeedJob(params.get("quoteJob")),
  };
}

export function workspaceSearch({ tab, trade, quoteJob }: WorkspaceNavigation): string {
  const params = new URLSearchParams({ quoteView: tab });
  if (validTrade(trade) !== "all") params.set("trade", trade);
  const job = validFeedJob(quoteJob);
  if (job) params.set("quoteJob", job);
  return params.toString();
}

export function workspaceSessionKey(userId: string): string {
  return `tm-quote-workspace-v1:${userId}`;
}

/** Session history is bounded to known feed jobs and contains no quote data. */
export function readWorkspaceSession(raw: string | null): WorkspaceSession {
  if (!raw || raw.length > 4096) return { skipped: [] };
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return { skipped: [] };
    const record = value as Record<string, unknown>;
    const skipped = Array.isArray(record.skipped) ? record.skipped.map(validFeedJob).filter((id): id is string => !!id) : [];
    return { skipped: [...new Set(skipped)].slice(0, DEMO_JOBS.length), quoteJob: validFeedJob(record.quoteJob) };
  } catch { return { skipped: [] }; }
}
