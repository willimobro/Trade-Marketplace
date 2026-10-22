import Link from "next/link";
import { headers } from "next/headers";
import styles from "./messages.module.css";
import { canUseHostedPreview } from "@/lib/hosted-preview";
import { allowsLocalDemo } from "@/app/demo/gate";
import { allowsQuoteDemo } from "@/lib/quote-demo-access";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui";
import { MessageList } from "./MessageList";
import { QuoteConversations } from "./QuoteConversations";
import { CustomerConversations } from "./CustomerConversations";
import { allowsWorkspaceDemo } from "@/lib/workspace-mode/preference";
import { WorkspaceModeView } from "@/components/workspace-mode/WorkspaceMode";

export const metadata = { title: "Messages" };
export default async function MessagesPage() {
  const user = await requireUser("/messages");
  const demoRuntime = await canUseHostedPreview() || allowsLocalDemo(process.env.TRADE_LOCAL_DEMO, (await headers()).get("host"));
  const quoteDemo = allowsQuoteDemo(demoRuntime, user);
  const workspaceDemo = allowsWorkspaceDemo(demoRuntime, user);
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
    <p className={styles.localNote}>Read status is saved for your account in this browser. Mark a conversation as unread to come back to it.</p>
    {(workspaceDemo || quoteDemo) && <WorkspaceModeView mode="trade"><QuoteConversations key={`quotes-${user.id}`} userId={user.id} /></WorkspaceModeView>}
    <WorkspaceModeView mode={user.role === "TRADIE" ? "trade" : "customer"}>
    <section className={quoteDemo ? styles.section : undefined} aria-label={quoteDemo ? "Existing job conversations" : "Job conversations"}>
    {quoteDemo && <h2 className={styles.sectionHeading}>Existing job conversations</h2>}
    {jobs.length ? <MessageList key={user.id} userId={user.id} conversations={jobs.map((job) => ({
      id: job.id,
      title: job.title,
      jobNumber: job.jobNumber,
      photo: job.photos[0]?.url ?? null,
      priceCents: job.priceCents,
      completed: job.status === "COMPLETED",
      latestMessage: job.messages[0] ? {
        id: job.messages[0].id,
        senderId: job.messages[0].senderId,
        senderName: job.messages[0].sender.name,
        body: job.messages[0].body,
      } : null,
    }))} /> : <div className="mt-8"><EmptyState title={quoteDemo ? "No existing job conversations" : "No conversations yet"}>Messages will appear here when you have a job to discuss. <Link className="font-medium underline" href={user.role === "ADMIN" ? "/admin" : "/dashboard"}>Go to your workspace</Link>.</EmptyState></div>}
    </section>
    </WorkspaceModeView>
    {workspaceDemo && user.role === "TRADIE" && <WorkspaceModeView mode="customer"><CustomerConversations key={`customer-messages-${user.id}`} userId={user.id} /></WorkspaceModeView>}
  </div>;
}
