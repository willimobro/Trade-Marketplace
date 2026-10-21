import Link from "next/link";

export default function ReceiptNotFound() {
  return <section className="mx-auto max-w-xl px-4 py-12" aria-labelledby="receipt-not-found-heading">
    <h1 id="receipt-not-found-heading" className="text-2xl font-semibold">Payment record unavailable</h1>
    <p className="mt-4 text-muted">This record could not be found for your account. Open the job from your workspace to find its current payment record.</p>
    <Link href="/dashboard" className="btn-primary mt-6">Go to workspace</Link>
  </section>;
}
