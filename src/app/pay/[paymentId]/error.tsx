"use client";

import Link from "next/link";

export default function PaymentError({ reset }: { reset: () => void }) {
  return <section className="mx-auto max-w-xl px-4 py-12" aria-labelledby="payment-error-heading">
    <h1 id="payment-error-heading" className="text-2xl font-semibold">We couldn’t confirm this test payment</h1>
    <p role="alert" className="mt-4 text-muted">No live payment provider is connected. A test payment record may have been saved before this error. Reload to check its persisted status, or open the job’s payment record from your workspace before retrying.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button className="btn-primary" onClick={reset}>Reload payment status</button><Link className="btn-ghost" href="/dashboard">Go to workspace</Link></div>
  </section>;
}
