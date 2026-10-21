import Link from "next/link";

export default function JobNotFound() {
  return <section className="mx-auto max-w-xl px-4 py-12">
    <h1 className="text-2xl font-semibold">This job isn’t available to view</h1>
    <p className="mt-4 text-muted">The job may have changed stage, been claimed, or be unavailable to your account. Check your workspace for jobs you can access.</p>
    <div className="mt-6 flex flex-wrap gap-3"><Link className="btn-primary" href="/dashboard">Go to workspace</Link><Link className="btn-ghost" href="/jobs">Check available jobs</Link></div>
  </section>;
}
