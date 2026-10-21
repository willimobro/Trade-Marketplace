export const CATEGORIES = [
  { name: "Electrical", color: "bg-cyan-400/25 text-cyan-900", icon: "⚡" },
  { name: "Plumbing", color: "bg-orange-400/25 text-orange-900", icon: "🔧" },
  { name: "Gas Fitting", color: "bg-red-400/25 text-red-900", icon: "🔥" },
  { name: "Construction", color: "bg-amber-400/30 text-amber-900", icon: "🔨" },
] as const;

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export function categoryStyle(name: string) {
  return CATEGORIES.find((c) => c.name === name) ?? CATEGORIES[0];
}

export const REGIONS = [
  "Northland",
  "Auckland",
  "Waikato",
  "Bay of Plenty",
  "Gisborne",
  "Hawke's Bay",
  "Taranaki",
  "Manawatū-Whanganui",
  "Wellington",
  "Tasman",
  "Nelson",
  "Marlborough",
  "West Coast",
  "Canterbury",
  "Otago",
  "Southland",
] as const;

export const EWRB_REGISTER_URL = "https://www.ewrb.govt.nz/";

export function formatNZD(cents: number) {
  return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(cents / 100);
}

export function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return date.toLocaleDateString("en-NZ");
}

/** Telfer order number for a job. */
export function jobRef(jobNumber: number) {
  return `TM-${jobNumber}`;
}

export const JOB_STATUS: Record<string, { label: string; customer: string; style: string }> = {
  REVIEW: { label: "Under review", customer: "We're getting your job priced", style: "bg-amber-400/20 text-amber-900" },
  PRICED: { label: "Priced", customer: "Your fixed price is ready", style: "bg-sky-500/15 text-sky-800" },
  BOOKABLE: { label: "Available to claim", customer: "Paid — finding your tradie", style: "bg-leaf/15 text-leaf-dark" },
  ASSIGNED: { label: "Assigned", customer: "Your tradie is assigned", style: "bg-sky-500/15 text-sky-800" },
  SUBMITTED: { label: "Awaiting sign-off", customer: "CoC submitted — please review", style: "bg-violet-500/15 text-violet-800" },
  COMPLETED: { label: "Completed", customer: "Done", style: "bg-black/10 text-ink" },
  CANCEL_REVIEW: { label: "Cancellation under investigation", customer: "Cancellation under investigation", style: "bg-red-500/15 text-red-800" },
  CANCELLED: { label: "Cancelled", customer: "Cancelled", style: "bg-black/5 text-muted" },
};
