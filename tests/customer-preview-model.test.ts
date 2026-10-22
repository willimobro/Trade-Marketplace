import assert from "node:assert/strict";
import test from "node:test";
import {
  CUSTOMER_SAMPLE_JOBS, CustomerPreviewError, acceptCustomerSamplePrice, customerPreviewJobs, customerPreviewKey,
  initialCustomerPreview, mergeCustomerDraft, postCustomerSampleJob, readCustomerPreview, updateCustomerDraft, validateCustomerDraft,
  type CustomerDraft,
} from "../src/lib/workspace-mode/customer-model";

const valid: CustomerDraft = { title: "Fit a new laundry tap", trade: "Plumbing", description: "Replace the laundry mixer using the existing water connections. A new mixer is supplied.", suburb: "Grey Lynn", timing: "Next week", photoNames: ["laundry.jpg"] };
const now = "2026-10-22T16:00:00.000Z";

test("customer sample jobs cover each stage and keep completed jobs last", () => {
  const state = initialCustomerPreview("same-person");
  const jobs = customerPreviewJobs(state);
  assert.equal(jobs.length, 5);
  assert.deepEqual(new Set(jobs.map((job) => job.stage)), new Set(["waiting", "priced", "underway", "complete"]));
  assert.equal(jobs.at(-1)?.stage, "complete");
  assert.ok(jobs.every((job) => job.photos.length >= 2 && job.photos.every((photo) => photo.url.startsWith("/demo/jobs/"))));
});

test("customer storage and drafts stay scoped to the signed-in identity", () => {
  const first = updateCustomerDraft(initialCustomerPreview("person-one"), valid);
  assert.notEqual(customerPreviewKey("person-one"), customerPreviewKey("person-two"));
  assert.throws(() => readCustomerPreview(JSON.stringify(first), "person-two"), CustomerPreviewError);
  assert.equal(initialCustomerPreview("person-two").draft.title, "");
  assert.throws(() => initialCustomerPreview(" "), CustomerPreviewError);
});

test("partial unsent draft text and photo names survive a round trip without file contents", () => {
  const state = updateCustomerDraft(initialCustomerPreview("person-one"), { ...valid, title: "New" });
  const loaded = readCustomerPreview(JSON.stringify(state), "person-one");
  assert.equal(loaded.draft.title, "New");
  assert.deepEqual(loaded.draft.photoNames, ["laundry.jpg"]);
  assert.equal(loaded.posted.length, 0);
  assert.equal(JSON.stringify(loaded).includes("blob:"), false);
  assert.equal(JSON.stringify(loaded).includes("data:image"), false);
});

test("explicit sample acceptance changes only that person's priced job and is idempotent", () => {
  const before = initialCustomerPreview("person-one");
  const result = acceptCustomerSamplePrice(before, "customer-sample-lights", now);
  assert.equal(result.alreadyAccepted, false);
  assert.equal(result.state.revision, 1);
  assert.equal(customerPreviewJobs(result.state).find((job) => job.id === "customer-sample-lights")?.stage, "underway");
  assert.equal(before.accepted.length, 0);
  assert.equal(customerPreviewJobs(initialCustomerPreview("person-two")).find((job) => job.id === "customer-sample-lights")?.stage, "priced");
  assert.equal(CUSTOMER_SAMPLE_JOBS[0].stage, "priced");
  const repeated = acceptCustomerSamplePrice(result.state, "customer-sample-lights", now);
  assert.equal(repeated.alreadyAccepted, true);
  assert.deepEqual(repeated.state, result.state);
});

test("waiting, underway, completed and unknown jobs cannot accept a sample price", () => {
  const state = initialCustomerPreview("person-one");
  for (const id of ["customer-sample-basin", "customer-sample-gate", "customer-sample-deck", "a-backend-job-id"]) {
    assert.throws(() => acceptCustomerSamplePrice(state, id, now), CustomerPreviewError);
  }
  assert.deepEqual(state.accepted, []);
});

test("posting a sample job validates its draft, clears only after success and preserves text", () => {
  const before = updateCustomerDraft(initialCustomerPreview("person-one"), valid);
  const after = postCustomerSampleJob(before, "customer-local-example01", now);
  assert.equal(after.posted.length, 1);
  assert.deepEqual(after.posted[0].fields, valid);
  assert.equal(after.draft.title, "");
  assert.equal(before.draft.title, valid.title);
  const jobs = customerPreviewJobs(after);
  assert.equal(jobs[0].id, "customer-local-example01");
  assert.equal(jobs[0].stage, "waiting");
  assert.deepEqual(jobs[0].photos, []);
  assert.equal(jobs.at(-1)?.stage, "complete");
  assert.deepEqual(readCustomerPreview(JSON.stringify(after), "person-one"), after);
});

test("invalid drafts and repeated sample identifiers cannot clear or duplicate a draft", () => {
  const invalid = updateCustomerDraft(initialCustomerPreview("person-one"), { ...valid, description: "Too short" });
  assert.throws(() => postCustomerSampleJob(invalid, "customer-local-example01", now), CustomerPreviewError);
  assert.equal(invalid.draft.description, "Too short");
  const posted = postCustomerSampleJob(updateCustomerDraft(initialCustomerPreview("person-one"), valid), "customer-local-example01", now);
  const second = updateCustomerDraft(posted, valid);
  assert.throws(() => postCustomerSampleJob(second, "customer-local-example01", now), CustomerPreviewError);
  assert.equal(second.posted.length, 1);
  assert.equal(second.draft.title, valid.title);
});

test("a bounded five-job preview retains the next draft when the limit is reached", () => {
  let state = initialCustomerPreview("person-one");
  for (let i = 0; i < 5; i += 1) state = postCustomerSampleJob(updateCustomerDraft(state, valid), `customer-local-example0${i}`, now);
  state = updateCustomerDraft(state, { ...valid, title: "A sixth sample job" });
  assert.throws(() => postCustomerSampleJob(state, "customer-local-example06", now), (error) => error instanceof CustomerPreviewError && error.code === "preview-limit");
  assert.equal(state.posted.length, 5);
  assert.equal(state.draft.title, "A sixth sample job");
});

test("customer state rejects corrupt data and acceptance of jobs without a ready price", () => {
  const state = initialCustomerPreview("person-one");
  for (const raw of ["invalid", "[]", "x".repeat(60001), JSON.stringify({ ...state, version: 99 }), JSON.stringify({ ...state, revision: -1 }), JSON.stringify({ ...state, revision: 1, accepted: [{ jobId: "customer-sample-basin", acceptedAt: now }] })]) {
    assert.throws(() => readCustomerPreview(raw, "person-one"), CustomerPreviewError);
  }
});

test("draft validation trims text and rejects oversized or invalid photo metadata", () => {
  assert.equal(validateCustomerDraft({ ...valid, title: ` ${valid.title} ` }).title, valid.title);
  assert.throws(() => validateCustomerDraft({ ...valid, photoNames: Array.from({ length: 7 }, () => "photo.jpg") }), CustomerPreviewError);
  assert.throws(() => validateCustomerDraft({ ...valid, photoNames: ["a".repeat(161)] }), CustomerPreviewError);
});

test("editing a stale tab's draft preserves another tab's newer acceptance and sample job", () => {
  const staleTab = updateCustomerDraft(initialCustomerPreview("person-one"), { ...valid, title: "Unsent local draft" });
  const acceptedElsewhere = acceptCustomerSamplePrice(staleTab, "customer-sample-lights", now).state;
  const newerPersisted = postCustomerSampleJob(updateCustomerDraft(acceptedElsewhere, valid), "customer-local-other-tab01", now);
  const merged = mergeCustomerDraft(JSON.stringify(newerPersisted), "person-one", { ...staleTab.draft, description: "New text typed in the original tab after the other tab saved its job." });
  assert.deepEqual(merged.accepted, newerPersisted.accepted);
  assert.deepEqual(merged.posted, newerPersisted.posted);
  assert.equal(merged.draft.title, "Unsent local draft");
  assert.equal(merged.revision, newerPersisted.revision + 1);
  assert.throws(() => mergeCustomerDraft("corrupt", "person-one", staleTab.draft), CustomerPreviewError);
});
