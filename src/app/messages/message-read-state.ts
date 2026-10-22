export type MessageReadReceipt = { latestMessageId: string; readAt: number; markedUnread?: true };
export type MessageReadState = Record<string, MessageReadReceipt>;
type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "getItem" | "setItem">;
export const MESSAGE_READ_EVENT = "trade-message-reads-updated";

function announceReadChange(userId: string) {
  // Storage events cover other tabs; this event also updates mounted lists here.
  try { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(MESSAGE_READ_EVENT, { detail: userId })); }
  catch { /* A saved receipt remains valid if browser notifications are unavailable. */ }
}

export function messageReadStorageKey(userId: string) {
  return `trade-marketplace:message-reads:v1:${encodeURIComponent(userId)}`;
}

/** Browser receipts also preserve an explicit “mark as unread” reminder. */
export function parseMessageReadState(raw: string | null): MessageReadState {
  const reads: MessageReadState = Object.create(null);
  if (!raw) return reads;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || !("version" in value) || value.version !== 1 || !("reads" in value) || !value.reads || typeof value.reads !== "object" || Array.isArray(value.reads)) return reads;
    for (const [jobId, receipt] of Object.entries(value.reads).slice(-2000)) {
      if (jobId.length > 200 || !receipt || typeof receipt !== "object") continue;
      const candidate = receipt as Partial<MessageReadReceipt>;
      if (typeof candidate.latestMessageId !== "string" || !candidate.latestMessageId || candidate.latestMessageId.length > 200 || typeof candidate.readAt !== "number" || !Number.isFinite(candidate.readAt) || candidate.readAt < 0 || (candidate.markedUnread !== undefined && candidate.markedUnread !== true)) continue;
      reads[jobId] = { latestMessageId: candidate.latestMessageId, readAt: candidate.readAt, ...(candidate.markedUnread ? { markedUnread: true } : {}) };
    }
  } catch { /* Invalid or older browser data starts with no read receipts. */ }
  return reads;
}

export function readMessageState(storage: StorageReader, userId: string) {
  return parseMessageReadState(storage.getItem(messageReadStorageKey(userId)));
}

export function isConversationUnread(reads: MessageReadState, jobId: string, latestMessage: { id: string; senderId: string } | null, userId: string) {
  if (!latestMessage) return false;
  // A manual reminder survives new messages, including messages sent by this user.
  if (reads[jobId]?.markedUnread) return true;
  return latestMessage.senderId !== userId && reads[jobId]?.latestMessageId !== latestMessage.id;
}

export function markConversationRead(reads: MessageReadState, jobId: string, latestMessageId: string, readAt = Date.now()): MessageReadState {
  return { ...reads, [jobId]: { latestMessageId, readAt } };
}

export function markConversationUnread(reads: MessageReadState, jobId: string, latestMessageId: string, markedAt = Date.now()): MessageReadState {
  return { ...reads, [jobId]: { latestMessageId, readAt: markedAt, markedUnread: true } };
}

export function saveConversationRead(storage: StorageWriter, userId: string, jobId: string, latestMessageId: string, readAt = Date.now()) {
  const reads = markConversationRead(readMessageState(storage, userId), jobId, latestMessageId, readAt);
  storage.setItem(messageReadStorageKey(userId), JSON.stringify({ version: 1, reads }));
  announceReadChange(userId);
  return reads;
}

export function saveConversationUnread(storage: StorageWriter, userId: string, jobId: string, latestMessageId: string, markedAt = Date.now()) {
  const reads = markConversationUnread(readMessageState(storage, userId), jobId, latestMessageId, markedAt);
  storage.setItem(messageReadStorageKey(userId), JSON.stringify({ version: 1, reads }));
  announceReadChange(userId);
  return reads;
}
