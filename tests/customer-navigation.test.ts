import assert from "node:assert/strict";
import test from "node:test";
import {
  CUSTOMER_SAMPLE_JOBS, acceptCustomerSamplePrice, customerConversationHref, customerJobFilter, customerJobSelection,
  customerPostingDestination, customerPreviewJobs, customerStageLabel, customerWorkspaceHref,
  initialCustomerPreview, postCustomerSampleJob, readCustomerPreview, updateCustomerDraft,
} from "../src/lib/workspace-mode/customer-model";

test("sample acceptance is presented as price accepted while the existing work example stays underway", () => {
  const state = initialCustomerPreview("account-a");
  const accepted = acceptCustomerSamplePrice(state, "customer-sample-lights", "2026-10-22T12:00:00.000Z").state;
  const restored = readCustomerPreview(JSON.stringify(accepted), "account-a");
  const jobs = customerPreviewJobs(restored);
  const lights = jobs.find((job) => job.id === "customer-sample-lights")!;
  assert.equal(customerStageLabel(lights), "Price accepted");
  assert.equal(lights.priceCents, CUSTOMER_SAMPLE_JOBS[0].priceCents);
  assert.equal(customerStageLabel(jobs.find((job) => job.id === "customer-sample-gate")!), "Getting underway");
  assert.equal(customerStageLabel(jobs.find((job) => job.id === "customer-sample-deck")!), "Completed");
  assert.equal(customerStageLabel(customerPreviewJobs(state)[0]), "Price ready");
  assert.equal(JSON.stringify(accepted).includes("priceAccepted"), false, "the label flag must remain derived, not a new stored booking state");
});

test("job to messages to job links preserve the exact sample and filter using bounded local paths", () => {
  for (const filter of ["all", "action", "active", "complete"] as const) {
    const jobId = CUSTOMER_SAMPLE_JOBS[0].id;
    const jobUrl = new URL(customerWorkspaceHref(jobId, filter, true), "https://example.test");
    assert.equal(jobUrl.pathname, "/dashboard");
    assert.equal(jobUrl.searchParams.get("customerJob"), jobId);
    assert.equal(jobUrl.searchParams.get("customerReview"), "price");
    const messages = new URL(customerConversationHref(jobUrl.searchParams.get("customerJob"), customerJobFilter(jobUrl.searchParams.get("customerFilter"))), jobUrl.origin);
    assert.equal(messages.pathname, "/messages");
    assert.equal(messages.searchParams.get("customerReview"), null);
    const back = new URL(customerWorkspaceHref(messages.searchParams.get("customerJob"), customerJobFilter(messages.searchParams.get("customerFilter"))), jobUrl.origin);
    assert.equal(back.searchParams.get("customerJob"), jobId);
    assert.equal(customerJobFilter(back.searchParams.get("customerFilter")), filter);
    assert.equal(back.origin, jobUrl.origin);
  }
  assert.equal(customerWorkspaceHref(), "/dashboard");
  assert.equal(customerConversationHref(), "/messages");
  assert.equal(customerJobFilter("unexpected"), "all");
  const encoded = new URL(customerConversationHref("//elsewhere.test/?customerJob=other&customerFilter=complete"), "https://example.test");
  assert.equal(encoded.pathname, "/messages");
  assert.equal(encoded.searchParams.get("customerFilter"), null);
});

test("query selection resolves only this account's known fixture or locally posted job", () => {
  const accountA = postCustomerSampleJob(updateCustomerDraft(initialCustomerPreview("account-a"), {
    title: "Repair a garden gate", trade: "Construction", description: "Realign the timber gate and replace the loose hinge.", suburb: "Grey Lynn", timing: "Flexible", photoNames: [],
  }), "customer-local-example01", "2026-10-22T12:00:00.000Z");
  const jobsA = customerPreviewJobs(accountA);
  const jobsB = customerPreviewJobs(initialCustomerPreview("account-b"));
  assert.equal(customerJobSelection(jobsA, "customer-local-example01")?.title, "Repair a garden gate");
  assert.equal(customerJobSelection(jobsB, "customer-local-example01"), undefined);
  assert.equal(customerJobSelection(jobsA, "customer-sample-lights")?.id, "customer-sample-lights");
  for (const id of [null, "", "backend-job", "customer-sample-missing", "https://elsewhere.test", "../customer-sample-lights", "customer-sample-lights&customerJob=customer-sample-gate"]) {
    assert.equal(customerJobSelection(jobsA, id), undefined);
  }
  assert.equal(accountA.revision, 2, "following a link must not save state or award anything");
});

test("posting handoff requires the existing preview gate, tradie identity and selected Customer mode", () => {
  assert.equal(customerPostingDestination("TRADIE", true, "customer"), "/dashboard?customerView=post");
  for (const role of [null, "CUSTOMER", "ADMIN", "TRADIE"]) {
    assert.equal(customerPostingDestination(role, false, "customer"), null);
    assert.equal(customerPostingDestination(role, true, "trade"), null);
    if (role !== "TRADIE") assert.equal(customerPostingDestination(role, true, "customer"), null);
  }
});
