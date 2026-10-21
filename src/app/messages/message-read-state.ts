export type MessageReadReceipt = { latestMessageId: string; readAt: number };
export type MessageReadState = Record<string, MessageReadReceipt>;
type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "getItem" | "setItem">;

export function messageReadStorageKey(userId: string) {
  return `trade-marketplace:message-reads:v1:${encodeURIComponent(userId)}`;
}

/** Receipts describe only messages opened or marked read in this browser. */
export function parseMessageReadState(raw: string | null): MessageReadState {
  const reads: MessageReadState = Object.create(null);
  if (!raw) return reads;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || !("version" in value) || value.version !== 1 || !("reads" in value) || !value.reads || typeof value.reads !== "object" || Array.isArray(value.reads)) return reads;
    for (const [jobId, receipt] of Object.entries(value.reads).slice(-2000)) {
      if (jobId.length > 200 || !receipt || typeof receipt !== "object") continue;
      const candidate = receipt as Partial<MessageReadReceipt>;
      if (typeof candidate.latestMessageId !== "string" || !candidate.latestMessageId || candidate.latestMessageId.length > 200 || typeof candidate.readAt !== "number" || !Number.isFinite(candidate.readAt) || candidate.readAt < 0) continue;
      reads[jobId] = { latestMessageId: candidate.latestMessageId, readAt: candidate.readAt };
    }
  } catch { /* Invalid or older browser data starts with no read receipts. */ }
  return reads;
}

export function readMessageState(storage: StorageReader, userId: string) {
  return parseMessageReadState(storage.getItem(messageReadStorageKey(userId)));
}

export function isConversationUnread(reads: MessageReadState, jobId: string, latestMessage: { id: string; senderId: string } | null, userId: string) {
  return !!latestMessage && latestMessage.senderId !== userId && reads[jobId]?.latestMessageId !== latestMessage.id;
}

export function markConversationRead(reads: MessageReadState, jobId: string, latestMessageId: string, readAt = Date.now()): MessageReadState {
  return { ...reads, [jobId]: { latestMessageId, readAt } };
}

export function saveConversationRead(storage: StorageWriter, userId: string, jobId: string, latestMessageId: string, readAt = Date.now()) {
  const reads = markConversationRead(readMessageState(storage, userId), jobId, latestMessageId, readAt);
  storage.setItem(messageReadStorageKey(userId), JSON.stringify({ version: 1, reads }));
  return reads;
}
