import assert from "node:assert/strict";
import { test } from "node:test";
import { isConversationUnread, markConversationRead, markConversationUnread, messageReadStorageKey, parseMessageReadState, readMessageState, saveConversationRead, saveConversationUnread } from "../src/app/messages/message-read-state";

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

test("an explicit unread reminder applies to own messages and survives later messages until read", () => {
  const own = { id: "message-1", senderId: "tradie" };
  const reads = markConversationUnread({}, "job-1", own.id, 300);
  assert.deepEqual(reads["job-1"], { latestMessageId: own.id, readAt: 300, markedUnread: true });
  assert.equal(isConversationUnread(reads, "job-1", own, "tradie"), true);
  assert.equal(isConversationUnread(reads, "job-1", { ...own, id: "message-2" }, "tradie"), true);
  assert.equal(isConversationUnread(reads, "job-1", { id: "message-3", senderId: "customer" }, "tradie"), true);
  assert.equal(isConversationUnread(reads, "job-2", own, "tradie"), false);

  const opened = markConversationRead(reads, "job-1", "message-3", 400);
  assert.equal(opened["job-1"].markedUnread, undefined);
  assert.equal(isConversationUnread(opened, "job-1", { id: "message-3", senderId: "customer" }, "tradie"), false);
  assert.equal(isConversationUnread(opened, "job-1", { ...own, id: "message-4" }, "tradie"), false);
  assert.equal(isConversationUnread(opened, "job-1", { id: "message-5", senderId: "customer" }, "tradie"), true);
});

test("manual read and unread choices reload per account without replacing other receipts", () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  saveConversationRead(storage, "tradie-a", "other-job", "other-message", 100);
  saveConversationUnread(storage, "tradie-a", "job-1", "own-message", 200);
  const reloaded = readMessageState(storage, "tradie-a");
  assert.equal(isConversationUnread(reloaded, "job-1", { id: "own-message", senderId: "tradie-a" }, "tradie-a"), true);
  assert.deepEqual(reloaded["other-job"], { latestMessageId: "other-message", readAt: 100 });
  assert.equal(Object.keys(readMessageState(storage, "tradie-b")).length, 0);
  saveConversationRead(storage, "tradie-b", "job-1", "incoming-message", 250);
  saveConversationRead(storage, "tradie-a", "job-1", "own-message", 300);
  assert.equal(isConversationUnread(readMessageState(storage, "tradie-a"), "job-1", { id: "own-message", senderId: "tradie-a" }, "tradie-a"), false);
  assert.deepEqual(readMessageState(storage, "tradie-b")["job-1"], { latestMessageId: "incoming-message", readAt: 250 });
});

test("invalid or incompatible stored data cannot create read receipts", () => {
  for (const raw of ["broken", "null", "[]", '{"version":2,"reads":{"job":{"latestMessageId":"message","readAt":1}}}', '{"version":1,"reads":{"job":{"latestMessageId":"message","readAt":"yesterday"}}}', '{"version":1,"reads":{"job":{"latestMessageId":"","readAt":1}}}', '{"version":1,"reads":{"job":{"latestMessageId":"message","readAt":1,"markedUnread":"yes"}}}']) {
    assert.equal(Object.keys(parseMessageReadState(raw)).length, 0);
  }
});
