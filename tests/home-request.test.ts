import assert from "node:assert/strict";
import test from "node:test";
import { homeCustomerDraft, homeJobDraft, type HomeRequest } from "../src/lib/home-request";
import { initialCustomerPreview, mergeCustomerDraft, readCustomerPreview } from "../src/lib/workspace-mode/customer-model";

test("Home request edits retain the customer's detailed draft and require a fresh review", () => {
  const current = { fields: { title: "Original title", description: "Detailed work already entered", category: "Plumbing", region: "Auckland", suburb: "Mount Eden", address: "Example address" }, reviewed: true, savedAt: 10, submittedAt: 11 };
  const changed = homeJobDraft(current, { title: " Repair the leaking tap ", location: " Grey Lynn ", category: "" }, "Wellington", 50);
  assert.deepEqual(changed, { fields: { ...current.fields, title: "Repair the leaking tap", suburb: "Grey Lynn" }, reviewed: false, savedAt: 50 });
  assert.equal(current.fields.title, "Original title");
  assert.equal(homeJobDraft(null, { title: "Building repairs", location: "", category: "Construction" }, "Wellington", 50).fields.region, "Wellington");
});

const edits: { name: string; patch: HomeRequest; title: string; suburb: string; trade: string }[] = [
  { name: "title only", patch: { title: "Home's new title" }, title: "Home's new title", suburb: "Te Aro", trade: "Gas Fitting" },
  { name: "location only", patch: { location: "Kelburn" }, title: "Other tab's latest title", suburb: "Kelburn", trade: "Gas Fitting" },
  { name: "category only", patch: { category: "Construction" }, title: "Other tab's latest title", suburb: "Te Aro", trade: "Construction" },
  { name: "clean/no-change", patch: {}, title: "Other tab's latest title", suburb: "Te Aro", trade: "Gas Fitting" },
  { name: "intentional location clearing", patch: { location: "" }, title: "Other tab's latest title", suburb: "", trade: "Gas Fitting" },
  { name: "chip title and category", patch: { title: "Leaking taps", category: "Plumbing" }, title: "Leaking taps", suburb: "Te Aro", trade: "Plumbing" },
];

test("stale Home applies only edited fields to the latest ordinary customer draft", async t => {
  for (const edit of edits) await t.test(edit.name, () => {
    const latest = { fields: { title: "Other tab's latest title", category: "Gas Fitting", suburb: "Te Aro", description: "Latest detailed scope", region: "Wellington", address: "Latest address" }, reviewed: true, submittedAt: 40, savedAt: 30 };
    const changed = homeJobDraft(latest, edit.patch, "Auckland", 50);
    assert.deepEqual(changed.fields, { ...latest.fields, title: edit.title, suburb: edit.suburb, category: edit.trade });
    assert.equal(changed.reviewed, false);
    assert.equal(changed.submittedAt, undefined);
    assert.equal(changed.savedAt, 50);
    assert.equal(latest.fields.category, "Gas Fitting", "the latest snapshot is not mutated");
  });
});

test("stale Home preserves the latest shared customer workspace across tabs", async t => {
  for (const edit of edits) await t.test(edit.name, () => {
    const latest = initialCustomerPreview("owner");
    latest.draft = { title: "Other tab's latest title", trade: "Gas Fitting", suburb: "Te Aro", description: "Latest detailed scope", timing: "Next week", photoNames: ["latest-photo.jpg"] };
    latest.accepted = [{ jobId: "customer-sample-lights", acceptedAt: "2026-10-22T12:00:00.000Z" }]; latest.revision = 7;
    const before = JSON.stringify(latest);
    const changed = mergeCustomerDraft(before, "owner", homeCustomerDraft(latest.draft, edit.patch));
    assert.deepEqual(changed.draft, { ...latest.draft, title: edit.title, suburb: edit.suburb, trade: edit.trade });
    assert.deepEqual(changed.accepted, latest.accepted);
    assert.deepEqual(changed.posted, latest.posted);
    assert.equal(changed.revision, 8);
    assert.equal(JSON.stringify(latest), before);
  });
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
