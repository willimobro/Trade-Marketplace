export default function TradieLoading() {
  return <div role="status" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <p className="text-sm text-muted">Loading tradie profile…</p>
    <div aria-hidden="true" className="mt-6 space-y-5 motion-safe:animate-pulse"><div className="card h-80" /><div className="card h-36" /></div>
  </div>;
}
