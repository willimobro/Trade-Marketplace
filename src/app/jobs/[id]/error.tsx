"use client";

import Link from "next/link";

export default function JobError({ reset }: { reset: () => void }) {
  return <section className="mx-auto max-w-xl px-4 py-12" aria-labelledby="job-error-heading">
    <h1 id="job-error-heading" className="text-2xl font-semibold">We couldn’t confirm the latest job state</h1>
    <p role="alert" className="mt-4 text-muted">If you just submitted a change, it may have been saved. Reload the job and check its status, messages or payment record before submitting again. Unsaved inputs may need to be entered again.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button className="btn-primary" onClick={reset}>Reload job</button><Link className="btn-ghost" href="/dashboard">Go to workspace</Link></div>
  </section>;
}
