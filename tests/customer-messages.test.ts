import assert from "node:assert/strict";
import { test } from "node:test";
import { CUSTOMER_SAMPLE_JOBS, customerPreviewJobs, initialCustomerPreview, postCustomerSampleJob, updateCustomerDraft } from "../src/lib/workspace-mode/customer-model";
import {
  CUSTOMER_MESSAGE_LIMIT, CUSTOMER_MESSAGE_LENGTH, CustomerMessagesError, addCustomerMessage, customerConversationMessages,
  customerConversationUnread, customerMessagesKey, initialCustomerMessages, markCustomerConversation, readCustomerMessages, updateCustomerMessageDraft,
} from "../src/lib/workspace-mode/customer-messages";

const jobs = [...CUSTOMER_SAMPLE_JOBS];
const first = jobs[0];
const second = jobs[1];
const now = "2026-10-22T12:00:00.000Z";

test("customer messages start with honest fixture notes and cannot route a backend job into the sample", () => {
  const state = initialCustomerMessages("account-a");
  assert.equal(state.messages.length, 0);
  const conversation = customerConversationMessages(state, first);
  assert.equal(conversation.length, 1);
  assert.equal(conversation[0].sender, "sample");
  assert.equal(conversation[0].senderName, "Sample coordinator");
  assert.equal(conversation[0].createdAt, "");
  assert.equal(customerConversationUnread(state, first), true);
  assert.throws(() => addCustomerMessage(state, jobs, "backend-job-123", "customer-message-valid-id1", "Access through the side gate.", now), CustomerMessagesError);
});

test("drafts survive reload and mode navigation per job and account without changing the hiring state", () => {
  const storage = new Map<string, string>();
  const hiring = initialCustomerPreview("account-a");
  const draftA = updateCustomerMessageDraft(initialCustomerMessages("account-a"), jobs, first.id, "Unsent scope note\nwith a second line.");
  storage.set(customerMessagesKey("account-a"), JSON.stringify(draftA));
  const reloaded = readCustomerMessages(storage.get(customerMessagesKey("account-a")) ?? null, "account-a", jobs);
  const draftB = updateCustomerMessageDraft(reloaded, jobs, second.id, "Another job’s unsent note.");
  storage.set(customerMessagesKey("account-a"), JSON.stringify(draftB));
  const returned = readCustomerMessages(storage.get(customerMessagesKey("account-a")) ?? null, "account-a", jobs);
  assert.equal(returned.drafts[first.id], "Unsent scope note\nwith a second line.");
  assert.equal(returned.drafts[second.id], "Another job’s unsent note.");
  assert.notEqual(customerMessagesKey("account-a"), customerMessagesKey("account-b"));
  assert.deepEqual(readCustomerMessages(storage.get(customerMessagesKey("account-b")) ?? null, "account-b", jobs).drafts, {});
  assert.throws(() => readCustomerMessages(JSON.stringify(returned), "account-b", jobs), CustomerMessagesError);
  assert.equal(hiring.revision, 0);
  assert.deepEqual(hiring.accepted, []);
});

test("sending saves only the viewer’s message once, clears its draft, and never fabricates a reply", () => {
  let state = updateCustomerMessageDraft(initialCustomerMessages("account-a"), jobs, first.id, "  Please use the side entrance.  ");
  state = updateCustomerMessageDraft(state, jobs, second.id, "Keep this other draft.");
  state = markCustomerConversation(state, jobs, first.id, false);
  const saved = addCustomerMessage(state, jobs, first.id, "customer-message-local-id1", state.drafts[first.id], now);
  assert.equal(saved.messages.length, 1);
  assert.equal(saved.messages[0].body, "Please use the side entrance.");
  assert.equal(saved.drafts[first.id], undefined);
  assert.equal(saved.drafts[second.id], "Keep this other draft.");
  const thread = customerConversationMessages(saved, first);
  assert.deepEqual(thread.map((message) => message.sender), ["sample", "you"]);
  assert.equal(customerConversationUnread(saved, first), false);
  assert.equal(addCustomerMessage(saved, jobs, first.id, "customer-message-local-id1", "Please use the side entrance.", now), saved);
  assert.throws(() => addCustomerMessage(saved, jobs, second.id, "customer-message-local-id1", "A different note.", now), CustomerMessagesError);
  const reopened = readCustomerMessages(JSON.stringify(saved), "account-a", jobs);
  assert.deepEqual(reopened.messages, saved.messages);
});

test("manual unread survives own-message saves and reloads until explicitly marked read", () => {
  let state = markCustomerConversation(initialCustomerMessages("account-a"), jobs, first.id, false);
  assert.equal(customerConversationUnread(state, first), false);
  state = markCustomerConversation(state, jobs, first.id, true);
  state = addCustomerMessage(state, jobs, first.id, "customer-message-local-id2", "One more access detail.", now);
  assert.equal(customerConversationUnread(readCustomerMessages(JSON.stringify(state), "account-a", jobs), first), true);
  state = markCustomerConversation(state, jobs, first.id, false);
  assert.equal(customerConversationUnread(state, first), false);
  assert.equal(customerConversationUnread(state, second), true);
});

test("locally posted jobs get their own empty conversation and stale notes are pruned after a hiring reset", () => {
  const hiring = postCustomerSampleJob(updateCustomerDraft(initialCustomerPreview("account-a"), { title: "Fix a garden gate", trade: "Construction", description: "Repair the loose hinge on the garden gate.", suburb: "Grey Lynn", timing: "Flexible", photoNames: [] }), "customer-local-example01", now);
  const expanded = customerPreviewJobs(hiring);
  const localJob = expanded.find((job) => job.id === "customer-local-example01")!;
  let state = initialCustomerMessages("account-a");
  assert.deepEqual(customerConversationMessages(state, localJob), []);
  assert.equal(customerConversationUnread(state, localJob), false);
  state = updateCustomerMessageDraft(state, expanded, localJob.id, "A local job note.");
  state = addCustomerMessage(state, expanded, localJob.id, "customer-message-local-id3", state.drafts[localJob.id], now);
  state = markCustomerConversation(state, expanded, localJob.id, true);
  state = updateCustomerMessageDraft(state, expanded, first.id, "Keep the fixture draft.");
  const reset = readCustomerMessages(JSON.stringify(state), "account-a", jobs);
  assert.deepEqual(reset.messages, []);
  assert.equal(reset.reads[localJob.id], undefined);
  assert.equal(reset.drafts[first.id], "Keep the fixture draft.");
});

test("storage corruption, oversize text and the local message limit preserve the unsent draft", () => {
  const original = initialCustomerMessages("account-a");
  for (const raw of ["broken", "null", JSON.stringify({ ...original, userId: "someone-else" }), JSON.stringify({ ...original, version: 2 }), JSON.stringify({ ...original, messages: [{ id: "fake", jobId: first.id, body: "fake", createdAt: now }] }), "x".repeat(260001)]) {
    assert.throws(() => readCustomerMessages(raw, "account-a", jobs), CustomerMessagesError);
  }
  assert.throws(() => updateCustomerMessageDraft(original, jobs, first.id, "x".repeat(CUSTOMER_MESSAGE_LENGTH + 1)), CustomerMessagesError);
  assert.throws(() => addCustomerMessage(original, jobs, first.id, "customer-message-local-id4", "   ", now), CustomerMessagesError);
  let full = original;
  for (let index = 0; index < CUSTOMER_MESSAGE_LIMIT; index++) full = addCustomerMessage(full, jobs, first.id, `customer-message-bounded-${String(index).padStart(3, "0")}`, "A saved local note.", now);
  full = updateCustomerMessageDraft(full, jobs, first.id, "Keep my unsent text.");
  assert.throws(() => addCustomerMessage(full, jobs, first.id, "customer-message-limit-id", full.drafts[first.id], now), /100 local messages/);
  assert.equal(full.drafts[first.id], "Keep my unsent text.");
  assert.equal(readCustomerMessages(JSON.stringify(full), "account-a", jobs).messages.length, CUSTOMER_MESSAGE_LIMIT);
});
