import assert from "node:assert/strict";
import test from "node:test";
import { supportTopics, validateSupportRequest } from "../src/app/support/support-data";

const valid = { name: "Alex", email: "alex@example.com", topic: "Your account", message: "I need some help finding my example job." };

test("a valid sample request is accepted for every support topic", () => {
  for (const topic of supportTopics) assert.deepEqual(validateSupportRequest({ ...valid, topic }), {});
});

test("blank and whitespace-only details return errors beside the required fields", () => {
  const errors = validateSupportRequest({ name: "  ", email: "  ", topic: "", message: "  " });
  assert.deepEqual(Object.keys(errors), ["name", "email", "topic", "message"]);
});

test("invalid email addresses and unknown topics are rejected", () => {
  for (const email of ["alex", "alex@", "alex@example", "alex @example.com"]) assert.ok(validateSupportRequest({ ...valid, email }).email);
  assert.ok(validateSupportRequest({ ...valid, topic: "Unrecognised topic" }).topic);
});

test("message length checks count meaningful content and accept the exact bounds", () => {
  assert.ok(validateSupportRequest({ ...valid, message: `  ${"a".repeat(19)}  ` }).message);
  assert.equal(validateSupportRequest({ ...valid, message: "a".repeat(20) }).message, undefined);
  assert.equal(validateSupportRequest({ ...valid, message: "a".repeat(2000) }).message, undefined);
  assert.ok(validateSupportRequest({ ...valid, message: "a".repeat(2001) }).message);
});

test("oversized names and emails are rejected without changing entered values", () => {
  const request = { ...valid, name: "A".repeat(101), email: `${"a".repeat(245)}@example.com` };
  const errors = validateSupportRequest(request);
  assert.ok(errors.name);
  assert.ok(errors.email);
  assert.equal(request.name.length, 101);
});
