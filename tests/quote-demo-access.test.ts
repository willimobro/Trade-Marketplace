import assert from "node:assert/strict";
import test from "node:test";
import { allowsQuoteDemo } from "../src/lib/quote-demo-access";
test("quote simulation requires explicit runtime and reserved sample tradie", () => {
  assert.equal(allowsQuoteDemo(true, { role: "TRADIE", email: "sparky@demo.test" }), true);
  assert.equal(allowsQuoteDemo(false, { role: "TRADIE", email: "sparky@demo.test" }), false);
  assert.equal(allowsQuoteDemo(true, { role: "CUSTOMER", email: "sparky@demo.test" }), false);
  assert.equal(allowsQuoteDemo(true, { role: "TRADIE", email: "someone@demo.test" }), false);
  assert.equal(allowsQuoteDemo(true, { role: "TRADIE", email: "real@example.com" }), false);
});
