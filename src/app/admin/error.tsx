"use client";

import Link from "next/link";

export default function AdminError({ reset }: { reset: () => void }) {
  return <section className="card p-6 sm:p-8" role="alert">
    <p className="text-sm font-semibold text-muted">Operations workspace</p>
    <h1 className="mt-2 text-2xl font-bold text-forest">We couldn’t complete that request</h1>
    <p className="mt-3 max-w-xl text-muted">Check the latest record before repeating an update. Your request may have reached the server even if this screen did not finish loading.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button className="btn-primary" onClick={reset}>Reload latest records</button><Link href="/admin" className="btn-ghost">Back to operations</Link></div>
  </section>;
}
