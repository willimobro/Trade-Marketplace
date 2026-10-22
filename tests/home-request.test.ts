import assert from "node:assert/strict";
import test from "node:test";
import { homeCustomerDraft, homeJobDraft } from "../src/lib/home-request";
import { initialCustomerPreview, mergeCustomerDraft, readCustomerPreview } from "../src/lib/workspace-mode/customer-model";

test("Home request edits retain the customer's detailed draft and require a fresh review", () => {
  const current = { fields: { title: "Original title", description: "Detailed work already entered", category: "Plumbing", region: "Auckland", suburb: "Mount Eden", address: "Example address" }, reviewed: true, savedAt: 10, submittedAt: 11 };
  const changed = homeJobDraft(current, { title: " Repair the leaking tap ", location: " Grey Lynn ", category: "" }, "Wellington", 50);
  assert.deepEqual(changed, { fields: { ...current.fields, title: "Repair the leaking tap", suburb: "Grey Lynn" }, reviewed: false, savedAt: 50 });
  assert.equal(current.fields.title, "Original title");
  assert.equal(homeJobDraft(null, { title: "Building repairs", location: "", category: "Construction" }, "Wellington", 50).fields.region, "Wellington");
});

test("Home request merges into the latest account's local draft without losing photos, posts or accepted prices", () => {
  const latest = initialCustomerPreview("owner");
  latest.draft = { title: "A garden gate", trade: "Construction", description: "Keep the scope already typed", suburb: "Grey Lynn", timing: "Next week", photoNames: ["gate.jpg"] };
  latest.accepted = [{ jobId: "customer-sample-lights", acceptedAt: "2026-10-22T12:00:00.000Z" }]; latest.revision = 1;
  const draft = homeCustomerDraft(latest.draft, { title: "Repair a leaking tap", location: "Mount Eden", category: "Plumbing" });
  const merged = mergeCustomerDraft(JSON.stringify(latest), "owner", draft);
  assert.deepEqual(merged.accepted, latest.accepted);
  assert.equal(merged.draft.description, latest.draft.description);
  assert.deepEqual(merged.draft.photoNames, ["gate.jpg"]);
  assert.equal(merged.draft.trade, "Plumbing");
  assert.equal(merged.draft.timing, "Next week");
  assert.throws(() => readCustomerPreview(JSON.stringify(merged), "another-account"));
});
