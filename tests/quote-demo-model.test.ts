import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { DEMO_JOBS } from "../src/lib/quote-demo/jobs";
import { claimDemoJob, completeDemoJob, createInitialState, getPointsBalance, INITIAL_DEMO_POINTS, parseStoredState, QuoteDemoError, submitDemoQuote, validateQuote } from "../src/lib/quote-demo/model";

const quoteJobs = DEMO_JOBS.filter((job) => job.stage === "quoting");
const availableJobs = DEMO_JOBS.filter((job) => job.stage === "available");
const note = "Includes labour, standard materials and testing.";
const time = "2026-10-21T10:00:00.000Z";

function enoughToClaim(userId = "sample-tradie") {
  let state = createInitialState(userId);
  for (const job of quoteJobs.slice(0, 2)) state = submitDemoQuote(state, job.id, "245.50", note, time).state;
  return state;
}

describe("isolated quote and points demo", () => {
  it("includes twelve photo-backed jobs across four trades, with quotes and available work", () => {
    assert.equal(DEMO_JOBS.length, 12);
    assert.equal(new Set(DEMO_JOBS.map((job) => job.id)).size, 12);
    assert.equal(new Set(DEMO_JOBS.map((job) => job.trade)).size, 4);
    for (const job of DEMO_JOBS) assert.ok(existsSync(resolve("public", job.image.slice(1))), `Missing ${job.image}`);
    assert.equal(availableJobs.length, 4);
    assert.equal(quoteJobs.length, 8);
  });

  it("earns exactly one point for the first valid quote and none for edits", () => {
    const original = createInitialState("sample-a");
    const first = submitDemoQuote(original, quoteJobs[0].id, "123.45", note, time);
    assert.equal(first.rewarded, true);
    assert.equal(getPointsBalance(first.state), INITIAL_DEMO_POINTS + 1);
    assert.equal(original.quotes.length, 0, "transition does not mutate its input");
    const second = submitDemoQuote(first.state, quoteJobs[0].id, "150", "Updated scope, including a replacement fitting.", "2026-10-21T11:00:00.000Z");
    assert.equal(second.rewarded, false);
    assert.equal(getPointsBalance(second.state), INITIAL_DEMO_POINTS + 1);
    assert.equal(second.state.quotes.length, 1);
    assert.equal(second.state.quotes[0].amountCents, 15000);
    assert.equal(second.state.quotes[0].submittedAt, time);
  });

  it("rejects invalid amounts and incomplete scopes without awarding points", () => {
    const state = createInitialState("sample-a");
    for (const amount of ["", "0", "0.99", "-50", "1.234", "1e3", "NaN", "Infinity", "1000000.01", "£45", "4.5.6"]) {
      assert.throws(() => submitDemoQuote(state, quoteJobs[0].id, amount, note, time), (error: unknown) => error instanceof QuoteDemoError && error.code === "invalid-quote", amount);
    }
    for (const scope of ["", "tiny", " ".repeat(20), "x".repeat(1001)]) assert.throws(() => submitDemoQuote(state, quoteJobs[0].id, "200", scope, time));
    assert.equal(getPointsBalance(state), INITIAL_DEMO_POINTS);
    assert.equal(state.quotes.length, 0);
    assert.deepEqual(validateQuote(" 245.50 ", ` ${note} `), { amountCents: 24550, note });
  });

  it("reloads a versioned record without awarding another point", () => {
    const first = submitDemoQuote(createInitialState("sample-a"), quoteJobs[0].id, "200", note, time).state;
    const reloaded = parseStoredState(JSON.parse(JSON.stringify(first)), "sample-a");
    assert.equal(getPointsBalance(reloaded), 4);
    const repeated = submitDemoQuote(reloaded, quoteJobs[0].id, "200", note, time);
    assert.equal(repeated.rewarded, false);
    assert.equal(getPointsBalance(repeated.state), 4);
  });

  it("spends five once, treats repeat claims idempotently, and never goes negative", () => {
    const ready = enoughToClaim();
    assert.equal(getPointsBalance(ready), 5);
    const first = claimDemoJob(ready, availableJobs[0].id, time);
    assert.equal(first.alreadyClaimed, false);
    assert.equal(getPointsBalance(first.state), 0);
    const repeat = claimDemoJob(parseStoredState(JSON.parse(JSON.stringify(first.state)), ready.userId), availableJobs[0].id, time);
    assert.equal(repeat.alreadyClaimed, true);
    assert.equal(getPointsBalance(repeat.state), 0);
    assert.equal(repeat.state.claims.length, 1);
    assert.throws(() => claimDemoJob(first.state, availableJobs[1].id, time), (error: unknown) => error instanceof QuoteDemoError && error.code === "insufficient-points");
    assert.equal(getPointsBalance(first.state), 0);
    assert.throws(() => claimDemoJob(createInitialState("poor"), availableJobs[0].id, time));
  });

  it("requires a claim before completion and never awards or spends extra points for completion", () => {
    assert.throws(() => completeDemoJob(createInitialState("sample-a"), availableJobs[0].id, time));
    const claimed = claimDemoJob(enoughToClaim(), availableJobs[0].id, time).state;
    const completed = completeDemoJob(claimed, availableJobs[0].id, "2026-10-21T12:00:00.000Z");
    assert.equal(completed.alreadyCompleted, false);
    assert.equal(getPointsBalance(completed.state), 0);
    assert.equal(completed.state.claims[0].completedAt, "2026-10-21T12:00:00.000Z");
    assert.equal(completeDemoJob(completed.state, availableJobs[0].id, time).alreadyCompleted, true);
    assert.equal(parseStoredState(JSON.parse(JSON.stringify(completed.state)), claimed.userId).claims[0].completedAt, "2026-10-21T12:00:00.000Z");
  });

  it("keeps each sample user's records and balance separate", () => {
    const a = enoughToClaim("sample-a"), b = createInitialState("sample-b");
    assert.equal(getPointsBalance(a), 5);
    assert.equal(getPointsBalance(b), 3);
    assert.throws(() => parseStoredState(a, "sample-b"), (error: unknown) => error instanceof QuoteDemoError && error.code === "invalid-storage");
    assert.equal(b.quotes.length, 0);
  });

  it("rejects malformed, old-version, duplicated and impossible stored data", () => {
    const base = enoughToClaim("sample-a");
    const bad = [null, "{broken", {}, { ...base, version: 99 }, { ...base, userId: "other" }, { ...base, revision: -1 },
      { ...base, revision: 0 }, { ...base, quotes: [base.quotes[0], base.quotes[0]] },
      { ...base, quotes: [{ ...base.quotes[0], amountCents: 0 }] }, { ...base, quotes: [{ ...base.quotes[0], jobId: "unknown" }] },
      { ...base, quotes: [{ ...base.quotes[0], updatedAt: "bad-date" }] }, { ...base, quotes: [{ ...base.quotes[0], note: "short" }] },
      { ...base, claims: [{ jobId: availableJobs[0].id, claimedAt: time }, { jobId: availableJobs[1].id, claimedAt: time }], revision: 4 },
      { ...base, claims: [{ jobId: availableJobs[0].id, claimedAt: time }, { jobId: availableJobs[0].id, claimedAt: time }], revision: 4 },
      { ...base, claims: [{ jobId: quoteJobs[0].id, claimedAt: time }], revision: 3 },
    ];
    for (const stored of bad) assert.throws(() => parseStoredState(stored, "sample-a"), (error: unknown) => error instanceof QuoteDemoError && error.code === "invalid-storage");
  });

  it("cannot quote an available job or claim an unpriced quoting job", () => {
    assert.throws(() => submitDemoQuote(createInitialState("a"), availableJobs[0].id, "100", note, time));
    assert.throws(() => claimDemoJob(enoughToClaim(), quoteJobs[0].id, time));
  });
});
