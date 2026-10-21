import Link from "next/link";
export default function NotFound() {
  return <div className="mx-auto max-w-2xl px-4 py-12"><div className="card p-6 sm:p-8"><p className="eyebrow">Page unavailable</p><h1 className="mt-3 text-2xl font-semibold">This page isn’t available.</h1><p className="mt-3 text-muted">It may have moved, or you may not have access to this job. Your own jobs are in your workspace.</p><Link href="/dashboard" className="btn-primary mt-6">Go to my workspace</Link></div></div>;
}
