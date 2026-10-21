import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl" aria-hidden>🔌</p>
      <h1 className="mt-4 text-2xl font-bold">Nothing on this circuit</h1>
      <p className="mt-2 text-sm text-muted">That page doesn&apos;t exist or the job has been removed.</p>
      <Link href="/jobs" className="btn-primary mt-6">Browse jobs</Link>
    </div>
  );
}
