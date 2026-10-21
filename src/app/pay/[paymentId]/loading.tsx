export default function PaymentLoading() {
  return <section role="status" aria-live="polite" className="mx-auto max-w-xl px-4 py-8 sm:py-12">
    <p className="text-sm font-medium text-muted">Loading test payment status…</p>
    <div aria-hidden="true" className="card mt-5 space-y-5 p-6 motion-safe:animate-pulse"><div className="h-8 w-2/3 rounded-lg bg-border/60" /><div className="h-24 rounded-xl bg-paper" /><div className="h-12 rounded-xl bg-paper" /></div>
  </section>;
}
