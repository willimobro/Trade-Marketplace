import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { DEMO_JOBS } from "../src/lib/quote-demo/jobs";
import { acceptDemoQuote, addDemoComment, claimDemoJob, completeDemoJob, createInitialState, getDemoQuoteStatus, getPointsBalance, INITIAL_DEMO_POINTS, parseStoredState, QUOTE_DEMO_VERSION, QuoteDemoError, submitDemoQuote, validateQuote } from "../src/lib/quote-demo/model";

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
    for (const job of DEMO_JOBS) {
      assert.ok(existsSync(resolve("public", job.image.slice(1))), `Missing ${job.image}`);
      assert.ok(job.photos.length >= 2, `${job.id} needs multiple photos`);
      assert.equal(new Set(job.photos.map((photo) => photo.url)).size, job.photos.length);
      for (const photo of job.photos) {
        assert.ok(existsSync(resolve("public", photo.url.slice(1))), `Missing ${photo.url}`);
        assert.ok(photo.alt.length > 10);
      }
      assert.ok(job.scope.length >= 3 && job.siteNotes.length >= 3 && job.quoteGuidance.length >= 3, `${job.id} needs useful detail`);
      assert.ok(job.customer.name && job.customer.availability && job.customer.property);
      assert.ok(job.comments.length >= 2);
    }
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

  it("normalizes old version-1 records without losing their quote, claim or balance", () => {
    const current = claimDemoJob(enoughToClaim("legacy-user"), availableJobs[0].id, time).state;
    const legacy = { version: 1, userId: current.userId, revision: current.revision, quotes: current.quotes, claims: current.claims };
    const loaded = parseStoredState(JSON.parse(JSON.stringify(legacy)), current.userId);
    assert.equal(loaded.version, 2);
    assert.deepEqual(loaded.quotes, current.quotes);
    assert.deepEqual(loaded.claims, current.claims);
    assert.deepEqual(loaded.acceptances, []);
    assert.deepEqual(loaded.comments, []);
    assert.equal(getPointsBalance(loaded), 0);
  });

  it("writes a new record version that a version-1 client must reject before it can drop acceptance or comments", () => {
    const quote = submitDemoQuote(createInitialState("sample-a"), quoteJobs[0].id, "200", note, time).state;
    const accepted = acceptDemoQuote(quote, quoteJobs[0].id, time).state;
    const saved = addDemoComment(accepted, quoteJobs[0].id, "We can arrange a visit.", "comment-0001", time).state;
    assert.equal(QUOTE_DEMO_VERSION, 2);
    // This is the exact incompatible-version condition in the previous parser.
    const previousClientRejects = (value: { version: number }) => value.version !== 1;
    assert.equal(previousClientRejects(saved), true);
    assert.equal(parseStoredState(JSON.parse(JSON.stringify(saved)), "sample-a").acceptances.length, 1);
    assert.equal(parseStoredState(JSON.parse(JSON.stringify(saved)), "sample-a").comments.length, 1);
    assert.throws(() => parseStoredState({ ...saved, acceptances: undefined }, "sample-a"));
    assert.throws(() => parseStoredState({ ...saved, comments: undefined }, "sample-a"));
  });

  it("requires an explicit saved quote before customer acceptance can be previewed", () => {
    const blank = createInitialState("sample-a");
    assert.equal(getDemoQuoteStatus(blank, quoteJobs[0].id), undefined);
    assert.throws(() => acceptDemoQuote(blank, quoteJobs[0].id, time));
    assert.throws(() => acceptDemoQuote(blank, "unknown", time));
    const claimed = claimDemoJob(enoughToClaim(), availableJobs[0].id, time).state;
    assert.equal(getDemoQuoteStatus(claimed, availableJobs[0].id), undefined);
    assert.equal(claimed.acceptances.length, 0);
    assert.throws(() => acceptDemoQuote(claimed, availableJobs[0].id, time));
  });

  it("persists one acceptance without extra rewards and locks its price and scope after reload", () => {
    const quoted = submitDemoQuote(createInitialState("sample-a"), quoteJobs[0].id, "245.50", note, time).state;
    assert.equal(getDemoQuoteStatus(quoted, quoteJobs[0].id), "quoted");
    assert.throws(() => acceptDemoQuote(quoted, quoteJobs[0].id, "2026-10-20T10:00:00.000Z"));
    const accepted = acceptDemoQuote(quoted, quoteJobs[0].id, "2026-10-21T11:00:00.000Z");
    assert.equal(accepted.alreadyAccepted, false);
    assert.equal(getDemoQuoteStatus(accepted.state, quoteJobs[0].id), "accepted");
    assert.equal(getPointsBalance(accepted.state), 4);
    assert.equal(quoted.acceptances.length, 0, "the source state is unchanged");
    const loaded = parseStoredState(JSON.parse(JSON.stringify(accepted.state)), "sample-a");
    const repeated = acceptDemoQuote(loaded, quoteJobs[0].id, "2026-10-21T12:00:00.000Z");
    assert.equal(repeated.alreadyAccepted, true);
    assert.deepEqual(repeated.state, loaded);
    assert.equal(repeated.state.acceptances.length, 1);
    assert.equal(getPointsBalance(repeated.state), 4);
    assert.throws(() => submitDemoQuote(loaded, quoteJobs[0].id, "300", "A changed and more expensive scope.", "2026-10-21T12:00:00.000Z"), (error: unknown) => error instanceof QuoteDemoError && error.code === "quote-accepted");
    assert.deepEqual(loaded.quotes[0], quoted.quotes[0]);
  });

  it("keeps acceptance exclusive to the viewing tradie even when two tradies quoted the same job", () => {
    const a = submitDemoQuote(createInitialState("sample-a"), quoteJobs[0].id, "200", note, time).state;
    const b = submitDemoQuote(createInitialState("sample-b"), quoteJobs[0].id, "275", note, time).state;
    const acceptedA = acceptDemoQuote(a, quoteJobs[0].id, time).state;
    assert.equal(getDemoQuoteStatus(acceptedA, quoteJobs[0].id), "accepted");
    assert.equal(getDemoQuoteStatus(b, quoteJobs[0].id), "quoted");
    assert.equal(b.acceptances.length, 0);
    assert.equal(getDemoQuoteStatus(createInitialState("sample-c"), quoteJobs[0].id), undefined);
    assert.equal(getPointsBalance(b), 4);
    assert.throws(() => parseStoredState(acceptedA, "sample-b"));
  });

  it("saves local comments per user without changing points and makes the same retry idempotent", () => {
    const blank = createInitialState("sample-a");
    const first = addDemoComment(blank, quoteJobs[0].id, "  Is there driveway parking?  ", "comment-0001", time);
    assert.equal(first.alreadyAdded, false);
    assert.equal(first.state.comments[0].body, "Is there driveway parking?");
    assert.equal(getPointsBalance(first.state), 3);
    assert.equal(blank.comments.length, 0);
    const reloaded = parseStoredState(JSON.parse(JSON.stringify(first.state)), "sample-a");
    const repeated = addDemoComment(reloaded, quoteJobs[0].id, "Is there driveway parking?", "comment-0001", "2026-10-21T11:00:00.000Z");
    assert.equal(repeated.alreadyAdded, true);
    assert.deepEqual(repeated.state, reloaded);
    assert.throws(() => addDemoComment(reloaded, quoteJobs[0].id, "A different comment.", "comment-0001", time));
    assert.throws(() => addDemoComment(reloaded, quoteJobs[1].id, "Is there driveway parking?", "comment-0001", time));
    const b = createInitialState("sample-b");
    assert.equal(b.comments.length, 0);
    assert.throws(() => parseStoredState(reloaded, "sample-b"));
    const otherUser = addDemoComment(b, quoteJobs[0].id, "My account's question.", "comment-0001", time).state;
    assert.equal(otherUser.comments[0].body, "My account's question.");
    assert.equal(reloaded.comments[0].body, "Is there driveway parking?");
  });

  it("validates comment input and permits discussion on quoting and claimed jobs", () => {
    const blank = createInitialState("sample-a");
    for (const body of ["", "  ", "a", "x".repeat(2001)]) assert.throws(() => addDemoComment(blank, quoteJobs[0].id, body, "comment-0001", time), (error: unknown) => error instanceof QuoteDemoError && error.code === "invalid-comment");
    assert.throws(() => addDemoComment(blank, "unknown", "A question.", "comment-0001", time));
    assert.throws(() => addDemoComment(blank, quoteJobs[0].id, "A question.", "short", time));
    assert.throws(() => addDemoComment(blank, quoteJobs[0].id, "A question.", "comment-0001", "bad-date"));
    const availableComment = addDemoComment(blank, availableJobs[0].id, "Can we discuss the arrival window?", "comment-0001", time).state;
    assert.equal(availableComment.comments.length, 1);
    assert.equal(getPointsBalance(availableComment), 3);
  });

  it("rejects malformed acceptance and comment records instead of resetting the ledger", () => {
    const quoted = submitDemoQuote(createInitialState("sample-a"), quoteJobs[0].id, "200", note, time).state;
    const accepted = acceptDemoQuote(quoted, quoteJobs[0].id, time).state;
    const commented = addDemoComment(quoted, quoteJobs[0].id, "A useful question.", "comment-0001", time).state;
    const bad = [
      { ...accepted, acceptances: null },
      { ...accepted, acceptances: [accepted.acceptances[0], accepted.acceptances[0]] },
      { ...accepted, acceptances: [{ jobId: quoteJobs[1].id, acceptedAt: time }] },
      { ...accepted, acceptances: [{ jobId: quoteJobs[0].id, acceptedAt: "2026-10-20T10:00:00.000Z" }] },
      { ...accepted, revision: 1 },
      { ...commented, comments: {} },
      { ...commented, comments: [commented.comments[0], commented.comments[0]] },
      { ...commented, comments: [{ ...commented.comments[0], body: " " }] },
      { ...commented, comments: [{ ...commented.comments[0], jobId: "unknown" }] },
      { ...commented, comments: [{ ...commented.comments[0], createdAt: "invalid" }] },
      { ...commented, revision: 1 },
    ];
    for (const record of bad) assert.throws(() => parseStoredState(record, "sample-a"), (error: unknown) => error instanceof QuoteDemoError && error.code === "invalid-storage");
  });
});
