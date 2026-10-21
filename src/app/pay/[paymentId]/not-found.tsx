import Link from "next/link";

export default function PaymentNotFound() {
  return <section className="mx-auto max-w-xl px-4 py-12" aria-labelledby="payment-not-found-heading">
    <h1 id="payment-not-found-heading" className="text-2xl font-semibold">Test checkout unavailable</h1>
    <p className="mt-4 text-muted">This payment could not be found for your account. Open the job from your workspace to review its current status and any available test checkout.</p>
    <Link href="/dashboard" className="btn-primary mt-6">Go to workspace</Link>
  </section>;
}
