import Link from "next/link";
import { requireUser } from "@/lib/session";
import styles from "./post-job.module.css";
import { JobForm } from "./JobForm";

export default async function NewJobPage() {
  const user = await requireUser("/jobs/new");
  if (user.role !== "CUSTOMER")
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="card p-6">
          <p className="font-semibold">Tradie accounts can&apos;t post jobs</p>
          <p className="mt-1 text-sm text-muted">
            Need work done yourself? Make a separate customer account. Otherwise, <Link href="/jobs" className="underline">find jobs to estimate</Link>.
          </p>
        </div>
      </div>
    );
  return (
    <div className={styles.screen}>
      <header className={styles.header}><Link href="/dashboard" className={styles.back} aria-label="Back to your jobs">←</Link><h1 className={styles.heading}>List a job</h1></header>
      <p className={styles.intro}>
        Describe your electrical work and add photos. Electricians provide private estimates, then Trade Marketplace reviews them and sets one fixed price for you.
      </p>
      <JobForm key={user.id} userId={user.id} defaultRegion={user.region} />
    </div>
  );
}
