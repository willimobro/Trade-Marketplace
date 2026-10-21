import Link from "next/link";
import styles from "./messages.module.css";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { jobRef } from "@/lib/constants";
import { EmptyState, StatusChip } from "@/components/ui";

export const metadata = { title: "Messages" };
export default async function MessagesPage() {
  const user = await requireUser("/messages");
  const jobs = await db.job.findMany({
    where: user.role === "ADMIN" ? { messages: { some: {} } } : { OR: [{ customerId: user.id }, { tradieId: user.id }] },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  jobs.sort((a, b) => (b.messages[0]?.createdAt ?? b.createdAt).getTime() - (a.messages[0]?.createdAt ?? a.createdAt).getTime());
  return <div className={`${styles.screen} mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8`}>
    <p className="eyebrow">Keep the job moving</p><h1 className="page-title mt-2">Messages</h1>
    <p className="mt-3 max-w-2xl text-muted">Each conversation stays with its job. Only the customer, the assigned tradie and Trade Marketplace can take part.</p>
    <div className={`${styles.list} mt-8 space-y-3`}>
      {jobs.map(job => <Link key={job.id} href={`/jobs/${job.id}#messages`} className={`${styles.conversation} card block p-5 transition hover:border-forest/40 sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-medium text-muted">{jobRef(job.jobNumber)}</span><StatusChip status={job.status} audience={user.role === "CUSTOMER" ? "customer" : "staff"} /></div>
        <h2 className="mt-3 font-semibold">{job.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{job.messages[0] ? <><span className="font-medium text-ink">{job.messages[0].sender.name}: </span>{job.messages[0].body}</> : "No messages yet. Open the job to start a conversation."}</p>
        <span className="mt-4 inline-block text-sm font-semibold text-forest">Open conversation <span aria-hidden>→</span></span>
      </Link>)}
      {!jobs.length && <EmptyState title="No conversations yet">Messages will appear here when you have a job to discuss. <Link className="font-medium underline" href={user.role === "ADMIN" ? "/admin" : "/dashboard"}>Go to your workspace</Link>.</EmptyState>}
    </div>
  </div>;
}
