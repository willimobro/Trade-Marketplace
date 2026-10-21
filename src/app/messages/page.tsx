import Link from "next/link";
import styles from "./messages.module.css";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui";
import { MessageList } from "./MessageList";

export const metadata = { title: "Messages" };
export default async function MessagesPage() {
  const user = await requireUser("/messages");
  const jobs = await db.job.findMany({
    where: user.role === "ADMIN" ? { messages: { some: {} } } : { OR: [{ customerId: user.id }, { tradieId: user.id }] },
    include: {
      photos: { where: { variationId: null }, take: 1 },
      messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  jobs.sort((a, b) => Number(!!b.messages.length) - Number(!!a.messages.length) || (b.messages[0]?.createdAt ?? b.createdAt).getTime() - (a.messages[0]?.createdAt ?? a.createdAt).getTime());
  return <div className={`${styles.screen} mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8`}>
    <p className="eyebrow">Your job conversations</p><h1 className="page-title mt-2">Messages</h1>
    <p className="mt-3 text-sm text-muted">Open a conversation to keep your job moving.</p>
    {jobs.length ? <MessageList key={user.id} userId={user.id} conversations={jobs.map((job) => ({
      id: job.id,
      title: job.title,
      jobNumber: job.jobNumber,
      photo: job.photos[0]?.url ?? null,
      latestMessage: job.messages[0] ? {
        id: job.messages[0].id,
        senderId: job.messages[0].senderId,
        senderName: job.messages[0].sender.name,
        body: job.messages[0].body,
      } : null,
    }))} /> : <div className="mt-8"><EmptyState title="No conversations yet">Messages will appear here when you have a job to discuss. <Link className="font-medium underline" href={user.role === "ADMIN" ? "/admin" : "/dashboard"}>Go to your workspace</Link>.</EmptyState></div>}
  </div>;
}
