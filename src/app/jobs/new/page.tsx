import Link from "next/link";
import { requireUser } from "@/lib/session";
import { JobForm } from "./JobForm";

export default async function NewJobPage() {
  const user = await requireUser("/jobs/new");
  if (user.role !== "CUSTOMER")
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="card p-6">
          <p className="font-semibold">Tradie accounts can&apos;t post jobs</p>
          <p className="mt-1 text-sm text-muted">
            Need work done yourself? Make a separate customer account. Otherwise, <Link href="/jobs" className="underline">find jobs to quote</Link>.
          </p>
        </div>
      </div>
    );
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Post a job</h1>
      <p className="mt-1 text-sm text-muted">Free to post. The more detail and photos, the better the quotes.</p>
      <JobForm defaultRegion={user.region} />
    </div>
  );
}
