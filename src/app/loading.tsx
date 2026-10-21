export default function Loading() {
  return <div role="status" aria-live="polite" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <p className="text-sm font-medium text-muted">Loading your workspace…</p>
    <div aria-hidden="true" className="mt-6 space-y-4 motion-safe:animate-pulse"><div className="h-10 w-2/3 rounded-xl bg-border/60" /><div className="card h-40" /><div className="card h-40" /></div>
  </div>;
}
