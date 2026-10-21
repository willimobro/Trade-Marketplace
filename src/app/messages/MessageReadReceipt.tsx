"use client";

import { useEffect } from "react";
import { saveConversationRead } from "./message-read-state";

/** Mount with the job thread; a receipt means the messages section was visible here. */
export function MessageReadReceipt({ userId, jobId, latestMessageId }: { userId: string; jobId: string; latestMessageId: string | null }) {
  useEffect(() => {
    if (!latestMessageId) return;
    const section = document.getElementById("messages");
    if (!section) return;
    let marked = false;
    const markRead = () => {
      if (marked || document.visibilityState !== "visible") return;
      try { saveConversationRead(localStorage, userId, jobId, latestMessageId); marked = true; }
      catch { /* Reading a conversation still works if browser storage is disabled. */ }
    };
    let sectionVisible = false;
    const observer = new IntersectionObserver((entries) => {
      sectionVisible = entries.some((entry) => entry.isIntersecting);
      if (sectionVisible) markRead();
    });
    observer.observe(section);
    const onVisibilityChange = () => { if (sectionVisible) markRead(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibilityChange); };
  }, [userId, jobId, latestMessageId]);
  return null;
}
