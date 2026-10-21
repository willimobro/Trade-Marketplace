import Link from "next/link";

export default function TradieNotFound() {
  return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6"><div className="card p-6 sm:p-8">
    <p className="eyebrow">Profile unavailable</p>
    <h1 className="mt-3 text-2xl font-bold">This tradie profile isn’t available.</h1>
    <p className="mt-3 text-muted">Check the profile link or return to your workspace to find the tradie assigned to your job.</p>
    <div className="mt-6 flex flex-wrap gap-3"><Link href="/dashboard" className="btn-primary">Go to my workspace</Link><Link href="/" className="btn-ghost">Back to home</Link></div>
  </div></div>;
}
