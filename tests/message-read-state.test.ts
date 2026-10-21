import assert from "node:assert/strict";
import { test } from "node:test";
import { isConversationUnread, markConversationRead, messageReadStorageKey, parseMessageReadState, readMessageState, saveConversationRead } from "../src/app/messages/message-read-state";

test("read state starts without illustrative receipts and distinguishes incoming from own messages", () => {
  const reads = parseMessageReadState(null);
  assert.equal(Object.keys(reads).length, 0);
  assert.equal(isConversationUnread(reads, "job-1", { id: "message-1", senderId: "other" }, "customer"), true);
  assert.equal(isConversationUnread(reads, "job-1", { id: "message-1", senderId: "customer" }, "customer"), false);
  assert.equal(isConversationUnread(reads, "job-1", null, "customer"), false);
});

test("marking read records an actual browser timestamp and a later message becomes unread", () => {
  const incoming = { id: "message-1", senderId: "other" };
  const reads = markConversationRead({}, "job-1", incoming.id, 12345);
  assert.deepEqual(reads["job-1"], { latestMessageId: "message-1", readAt: 12345 });
  assert.equal(isConversationUnread(reads, "job-1", incoming, "customer"), false);
  assert.equal(isConversationUnread(reads, "job-1", { ...incoming, id: "message-2" }, "customer"), true);
  assert.equal(isConversationUnread(reads, "job-2", incoming, "customer"), true);
});

test("persisted receipts are versioned, account-scoped, and preserve other threads", () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  saveConversationRead(storage, "customer-a", "job-1", "message-1", 100);
  saveConversationRead(storage, "customer-a", "job-2", "message-2", 200);
  assert.deepEqual(readMessageState(storage, "customer-a")["job-1"], { latestMessageId: "message-1", readAt: 100 });
  assert.deepEqual(readMessageState(storage, "customer-a")["job-2"], { latestMessageId: "message-2", readAt: 200 });
  assert.equal(Object.keys(readMessageState(storage, "customer-b")).length, 0);
  assert.match(messageReadStorageKey("customer-a"), /:v1:customer-a$/);
  assert.notEqual(messageReadStorageKey("customer-a"), messageReadStorageKey("customer-b"));
});

test("invalid or incompatible stored data cannot create read receipts", () => {
  for (const raw of ["broken", "null", "[]", '{"version":2,"reads":{"job":{"latestMessageId":"message","readAt":1}}}', '{"version":1,"reads":{"job":{"latestMessageId":"message","readAt":"yesterday"}}}', '{"version":1,"reads":{"job":{"latestMessageId":"","readAt":1}}}']) {
    assert.equal(Object.keys(parseMessageReadState(raw)).length, 0);
  }
});
