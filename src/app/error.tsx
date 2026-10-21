"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-2xl px-4 py-12"><div className="card p-6 sm:p-8">
    <p className="eyebrow">Something interrupted this page</p><h1 className="mt-3 text-2xl font-semibold">We couldn’t load this right now.</h1>
    <p className="mt-3 text-muted">Try loading the page again. If you just submitted a payment or claimed a job, check its current status before repeating the action.</p>
    <button onClick={reset} className="btn-primary mt-6">Try again</button>
  </div></div>;
}
