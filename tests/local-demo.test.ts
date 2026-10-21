import assert from "node:assert/strict";
import { test } from "node:test";
import { allowsLocalDemo } from "../src/app/demo/gate";

test("local demo requires explicit flag and an exact loopback Host", () => {
  for (const host of ["localhost", "LOCALHOST:3100", "127.0.0.1:8080", "[::1]:3000"]) assert.equal(allowsLocalDemo("1", host), true, host);
  for (const enabled of [undefined, "", "0", "true", " 1"]) assert.equal(allowsLocalDemo(enabled, "localhost"), false);
  for (const host of [null, "", "example.com", "localhost.example.com", "example.localhost", "127.0.0.2", "0.0.0.0", "::1", "localhost:0", "localhost:65536", "localhost:abc", "localhost:3000/path", "localhost,example.com", " localhost", "user@localhost", "localhost\n"]) assert.equal(allowsLocalDemo("1", host), false, String(host));
});
