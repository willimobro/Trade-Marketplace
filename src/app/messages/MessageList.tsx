"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatNZD, jobRef } from "@/lib/constants";
import { activeJobsFirst } from "@/lib/job-presentation";
import { isConversationUnread, markConversationRead, markConversationUnread, MESSAGE_READ_EVENT, messageReadStorageKey, readMessageState, saveConversationRead, saveConversationUnread, type MessageReadState } from "./message-read-state";
import styles from "./messages.module.css";

export type Conversation = {
  id: string;
  title: string;
  jobNumber?: number;
  reference?: string;
  href?: string;
  photo: string | null;
  priceCents: number | null;
  priceLabel?: string;
  quoteStatus?: "quoted" | "accepted";
  completed?: boolean;
  latestMessage: { id: string; senderId: string; senderName: string; body: string } | null;
};

export function MessageList({ userId, conversations, label = "Job conversations" }: { userId: string; conversations: Conversation[]; label?: string }) {
  const [reads, setReads] = useState<MessageReadState | null>(null);
  const [failedPhotos, setFailedPhotos] = useState<string[]>([]);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const refresh = () => {
      try { setReads(readMessageState(localStorage, userId)); setStorageUnavailable(false); }
      catch { setReads({}); setStorageUnavailable(true); }
    };
    refresh();
    const onStorage = (event: StorageEvent) => { if (event.key === messageReadStorageKey(userId) || event.key === null) refresh(); };
    const onReadChange = (event: Event) => { if ((event as CustomEvent<string>).detail === userId) refresh(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener(MESSAGE_READ_EVENT, onReadChange);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("pageshow", refresh); window.removeEventListener("focus", refresh); window.removeEventListener(MESSAGE_READ_EVENT, onReadChange); };
  }, [userId]);

  function updateReadState(conversation: Conversation, unread: boolean) {
    if (!conversation.latestMessage) return;
    const messageId = conversation.latestMessage.id;
    try { setReads((unread ? saveConversationUnread : saveConversationRead)(localStorage, userId, conversation.id, messageId)); setStorageUnavailable(false); }
    catch {
      setReads((current) => (unread ? markConversationUnread : markConversationRead)(current ?? {}, conversation.id, messageId));
      setStorageUnavailable(true);
    }
    setAnnouncement(`${conversation.title} marked as ${unread ? "unread" : "read"} in this browser.`);
  }

  return <>
    <ul className={styles.list} aria-label={label}>
      {activeJobsFirst(conversations, (conversation) => !!conversation.completed).map((conversation) => {
        const unread = reads !== null && isConversationUnread(reads, conversation.id, conversation.latestMessage, userId);
        const readStatus = !conversation.latestMessage ? "No messages" : reads === null ? "Loading…" : unread ? "Unread" : "Read";
        const quoteStatus = conversation.completed ? "" : conversation.quoteStatus === "accepted" ? "Quote accepted" : conversation.quoteStatus === "quoted" ? "Quoted" : "";
        const jobState = conversation.completed ? "Complete" : quoteStatus;
        const price = conversation.priceCents !== null ? `${conversation.priceLabel ?? "Job price"} ${formatNZD(conversation.priceCents)}` : "Price pending";
        return <li key={conversation.id} className={`${styles.conversation} ${unread ? styles.unread : styles.read}`}>
          <Link href={conversation.href ?? `/jobs/${encodeURIComponent(conversation.id)}#messages`} className={styles.open} onClick={() => updateReadState(conversation, false)} aria-label={`${conversation.title}. ${readStatus === "Loading…" ? "Loading read status" : `${readStatus} in this browser`}. ${jobState ? `${jobState}. ` : ""}${price}. Open conversation.`}>
            <span className={`${styles.photo} ${conversation.completed ? styles.completedPhoto : conversation.quoteStatus === "accepted" ? styles.acceptedPhoto : conversation.quoteStatus === "quoted" ? styles.quotedPhoto : ""}`} aria-hidden="true">
              {conversation.photo && !failedPhotos.includes(conversation.photo) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={conversation.photo} alt="" onError={() => setFailedPhotos((current) => [...current, conversation.photo!])} />
              ) : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 3-3 6 6" /></svg>}
            </span>
            <span className={styles.content}>
              <span className={styles.title}>{conversation.title}</span>
              <span className={styles.preview}>{conversation.latestMessage ? `${conversation.latestMessage.senderId === userId ? "You" : conversation.latestMessage.senderName}: ${conversation.latestMessage.body}` : "No messages yet"}</span>
              <span className={styles.metadata}>
                <span className={`${styles.readState} ${unread ? styles.unreadState : ""}`}>{unread && <span className={styles.dot} aria-hidden="true" />}{readStatus}</span>
                {conversation.completed ? <span className={`${styles.quoteState} ${styles.completedState}`}><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4L19 6" /></svg>COMPLETE</span>
                  : quoteStatus && <span className={`${styles.quoteState} ${conversation.quoteStatus === "accepted" ? styles.acceptedState : styles.quotedState}`}>{quoteStatus}</span>}
                <span className={styles.reference}>{conversation.reference ?? (conversation.jobNumber !== undefined ? jobRef(conversation.jobNumber) : "")}</span>
                <span className={styles.price}>{price}</span>
              </span>
            </span>
            <span className={styles.chevron} aria-hidden="true">›</span>
          </Link>
          <div className={styles.conversationActions}>
            <button type="button" className={styles.markRead} disabled={reads === null || !conversation.latestMessage} onClick={() => updateReadState(conversation, !unread)} aria-label={`Mark ${conversation.title} as ${unread ? "read" : "unread"}`}>Mark as {unread ? "read" : "unread"}</button>
          </div>
        </li>;
      })}
    </ul>
    {storageUnavailable && <p className={styles.localNote} role="status">This browser can&apos;t save read status. Your changes will last until you leave this page.</p>}
    <p className="sr-only" role="status">{announcement}</p>
  </>;
}
