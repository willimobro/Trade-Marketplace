import Link from "next/link";
import { JOB_STATUS, categoryStyle, formatNZD } from "@/lib/constants";

export function Logo({ className = "", href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} aria-label="Trade Marketplace home" className={`flex min-h-12 items-center gap-3 rounded-lg ${className}`}>
      {/* Exact original Figma vector lockup, including the original wordmark. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/wordmark.svg" width={188} height={46} alt="" className="shrink-0" />
    </Link>
  );
}

export function CategoryChip({ name }: { name: string }) {
  const c = categoryStyle(name);
  return (
    <span className={`chip ${c.color}`}>
      <span aria-hidden>{c.icon}</span>
      {name}
    </span>
  );
}

const OTHER_STATUS: Record<string, string> = {
  REQUESTED: "bg-amber-400/20 text-amber-900",
  PENDING: "bg-amber-400/20 text-amber-900",
  APPROVED: "bg-leaf/15 text-leaf-dark",
  PAID: "bg-leaf/15 text-leaf-dark",
  DECLINED: "bg-black/5 text-muted",
};

export function StatusChip({ status, audience = "staff" }: { status: string; audience?: "staff" | "customer" }) {
  const job = JOB_STATUS[status];
  if (job) return <span className={`chip ${job.style}`}>{audience === "customer" ? job.customer : job.label}</span>;
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return <span className={`chip ${OTHER_STATUS[status] ?? "bg-black/5"}`}>{label}</span>;
}

export function Money({ cents, className = "" }: { cents: number; className?: string }) {
  return <span className={`trade-money tabular-nums ${className}`}>{formatNZD(cents)}</span>;
}

export function Avatar({ name, url, size = 40 }: { name: string; url?: string | null; size?: number }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  if (url)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={name} width={size} height={size} className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />;
  return (
    <span
      className="grid place-items-center rounded-full bg-forest-2 text-lime font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function LicenceBadge({ verified, trade = "Electrical" }: { verified: boolean; trade?: string | null }) {
  if (trade !== "Electrical") return <span className="chip bg-amber-400/20 text-amber-900">Trade verification requirements pending</span>;
  return verified ? (
    <span className="chip bg-[#e8f4e3] text-[#326c20]" title="Licence marked verified by Trade Marketplace">
      ✓ Licence verified
    </span>
  ) : (
    <span className="chip bg-amber-400/20 text-amber-900" title="Registration number not yet checked">
      Licence pending check
    </span>
  );
}

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  const full = Math.round(rating);
  return (
    <span className={`text-amber-500 ${className}`} aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {"★".repeat(full)}
      <span className="text-black/15">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export function FormMessage({ state }: { state: { error?: string; ok?: string } | undefined }) {
  if (state?.error) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.error}</p>;
  if (state?.ok) return <p className="rounded-lg bg-leaf/10 px-3 py-2 text-sm text-leaf-dark" role="status">{state.ok}</p>;
  return null;
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="card p-8 text-center">
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
    </div>
  );
}
