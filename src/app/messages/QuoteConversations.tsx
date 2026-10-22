"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEMO_JOBS } from "@/lib/quote-demo/jobs";
import { getDemoQuoteStatus, type QuoteDemoState } from "@/lib/quote-demo/model";
import { loadQuoteDemo, subscribeQuoteDemo } from "@/lib/quote-demo/storage";
import { MessageList, type Conversation } from "./MessageList";
import styles from "./messages.module.css";

/** Rendered only after the server has checked the sample account and demo runtime. */
export function QuoteConversations({ userId }: { userId: string }) {
  const [state, setState] = useState<QuoteDemoState | null>(null);
  const [error, setError] = useState("");
  const alive = useRef(false);
  const request = useRef(0);
  const refresh = useCallback(async () => {
    const currentRequest = ++request.current;
    try {
      const saved = await loadQuoteDemo(userId);
      if (alive.current && currentRequest === request.current) { setState(saved); setError(""); }
    } catch {
      if (alive.current && currentRequest === request.current) setError("Couldn’t load conversations. Retry to reconnect.");
    }
  }, [userId]);

  useEffect(() => {
    alive.current = true;
    setState(null);
    setError("");
    void refresh();
    const unsubscribe = subscribeQuoteDemo(userId, () => void refresh());
    return () => { alive.current = false; unsubscribe(); };
  }, [refresh, userId]);

  const conversations: Conversation[] = state ? DEMO_JOBS.flatMap((job) => {
    const quote = state.quotes.find((item) => item.jobId === job.id);
    const claim = state.claims.find((item) => item.jobId === job.id);
    const comments = state.comments.filter((item) => item.jobId === job.id);
    if (!quote && !comments.length && !claim) return [];
    const latestSaved = comments.at(-1);
    const latestFixture = job.comments.at(-1);
    return [{
      id: job.id,
      title: job.title,
      reference: `${job.trade} · ${job.suburb}`,
      href: `/quote-jobs/${encodeURIComponent(job.id)}#comments`,
      photo: job.photos[0]?.url ?? null,
      priceCents: quote?.amountCents ?? job.priceCents ?? null,
      priceLabel: quote ? "Your quote" : "Job price",
      quoteStatus: getDemoQuoteStatus(state, job.id),
      completed: !!claim?.completedAt,
      activityAt: Math.max(...[latestSaved?.createdAt, quote?.updatedAt, claim?.completedAt ?? claim?.claimedAt].map((date) => date ? Date.parse(date) : 0)),
      latestMessage: latestSaved ? { id: latestSaved.id, senderId: userId, senderName: "You", body: latestSaved.body }
        : latestFixture ? { id: latestFixture.id, senderId: `sample-${latestFixture.role.toLowerCase()}:${job.id}`, senderName: latestFixture.author.replace(/ · sample tradie$/i, ""), body: latestFixture.body }
        : null,
    }];
  }).sort((a, b) => b.activityAt - a.activityAt) : [];

  return <section className={styles.section} aria-labelledby="quote-conversations-heading" aria-busy={!state && !error}>
    <h2 id="quote-conversations-heading" className={styles.sectionHeading}>Job conversations</h2>
    {error ? <div className={styles.quoteEmpty}><p role="status">{error}</p><button type="button" className={styles.markRead} onClick={() => void refresh()}>Retry</button></div>
      : !state ? <p className={styles.localNote} role="status">Loading saved conversations…</p>
      : conversations.length ? <MessageList userId={userId} conversations={conversations} label="Quote conversations" />
      : <p className={styles.quoteEmpty}>No conversations yet. <Link href="/dashboard?quoteView=feed">Quote more jobs</Link>.</p>}
  </section>;
}
