"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReceiptError() {
  // A boundary reset can reuse the failed server payload. A document reload
  // requests fresh saved data and does not repeat any payment action.
  const { jobId } = useParams<{ jobId: string }>();
  return <section className="mx-auto max-w-xl px-4 py-12" aria-labelledby="receipt-error-heading">
    <h1 id="receipt-error-heading" className="text-2xl font-semibold">We couldn’t load the payment record</h1>
    <p role="alert" className="mt-4 text-muted">The saved totals are unavailable right now. Reload this record or return to the job to check its latest status before repeating a test payment.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button type="button" className="btn-primary" onClick={() => window.location.reload()}>Reload payment record</button><Link className="btn-ghost" href={`/jobs/${jobId}`}>Back to job</Link></div>
  </section>;
}
