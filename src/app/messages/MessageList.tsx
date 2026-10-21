"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { jobRef } from "@/lib/constants";
import { isConversationUnread, markConversationRead, messageReadStorageKey, readMessageState, saveConversationRead, type MessageReadState } from "./message-read-state";
import styles from "./messages.module.css";

type Conversation = {
  id: string;
  title: string;
  jobNumber: number;
  photo: string | null;
  latestMessage: { id: string; senderId: string; senderName: string; body: string } | null;
};

export function MessageList({ userId, conversations }: { userId: string; conversations: Conversation[] }) {
  const [reads, setReads] = useState<MessageReadState | null>(null);
  const [failedPhotos, setFailedPhotos] = useState<string[]>([]);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const conversationLinks = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    const refresh = () => {
      try { setReads(readMessageState(localStorage, userId)); }
      catch { setReads({}); setStorageUnavailable(true); }
    };
    refresh();
    const onStorage = (event: StorageEvent) => { if (event.key === messageReadStorageKey(userId) || event.key === null) refresh(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", refresh);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("pageshow", refresh); };
  }, [userId]);

  function markRead(conversation: Conversation) {
    if (!conversation.latestMessage) return;
    try { setReads(saveConversationRead(localStorage, userId, conversation.id, conversation.latestMessage.id)); }
    catch {
      setReads((current) => markConversationRead(current ?? {}, conversation.id, conversation.latestMessage!.id));
      setStorageUnavailable(true);
    }
    setAnnouncement(`${conversation.title} marked read in this browser.`);
  }

  return <>
    <ul className={styles.list} aria-label="Job conversations">
      {conversations.map((conversation) => {
        const unread = reads !== null && isConversationUnread(reads, conversation.id, conversation.latestMessage, userId);
        return <li key={conversation.id} className={`${styles.conversation} ${unread ? styles.unread : styles.read}`}>
          <Link ref={(link) => { if (link) conversationLinks.current.set(conversation.id, link); else conversationLinks.current.delete(conversation.id); }} href={`/jobs/${encodeURIComponent(conversation.id)}#messages`} className={styles.open} onClick={() => markRead(conversation)}>
            <span className={styles.photo} aria-hidden="true">
              {conversation.photo && !failedPhotos.includes(conversation.photo) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={conversation.photo} alt="" onError={() => setFailedPhotos((current) => [...current, conversation.photo!])} />
              ) : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 3-3 6 6" /></svg>}
            </span>
            <span className={styles.content}>
              <span className={styles.title}>{conversation.title}</span>
              <span className={styles.preview}>{conversation.latestMessage ? `${conversation.latestMessage.senderId === userId ? "You" : conversation.latestMessage.senderName}: ${conversation.latestMessage.body}` : "No messages yet"}</span>
              <span className={styles.reference}>{jobRef(conversation.jobNumber)}</span>
            </span>
            <span className={styles.indicator}>{unread && <span className={styles.dot} aria-hidden="true" />}<span className="sr-only">{unread ? "Unread in this browser. " : ""}Open conversation</span><span className={styles.chevron} aria-hidden="true">›</span></span>
          </Link>
          {unread && <button type="button" className={styles.markRead} onClick={() => {
            markRead(conversation);
            conversationLinks.current.get(conversation.id)?.focus({ preventScroll: true });
          }} aria-label={`Mark ${conversation.title} as read`}>Mark read</button>}
        </li>;
      })}
    </ul>
    {storageUnavailable && <p className={styles.localNote} role="status">This browser can&apos;t save read status.</p>}
    <p className="sr-only" role="status">{announcement}</p>
  </>;
}
