import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { recordTestPayment } from "../src/lib/record-test-payment";

test("cancelled saved checkout cannot record payment; valid assignment records once", async () => {
  const dir = mkdtempSync(join(tmpdir(), "tm-payment-regression-"));
  const file = join(dir, "isolated.db");
  execFileSync("sqlite3", [file], { input: readFileSync(new URL("../prisma/migrations/20261021045142_managed_service/migration.sql", import.meta.url)) });
  const client = new PrismaClient({ datasources: { db: { url: `file:${file}` } } });
  try {
    const customer = await client.user.create({ data: { email: "customer@test.invalid", name: "Test", role: "CUSTOMER", region: "Southland", passwordHash: "unused" } });
    const tradie = await client.user.create({ data: { email: "tradie@test.invalid", name: "Test", role: "TRADIE", region: "Southland", passwordHash: "unused" } });
    const job = await client.job.create({ data: { jobNumber: 1, customerId: customer.id, tradieId: tradie.id, title: "Isolated payment regression", category: "Electrical", description: "Test only", region: "Southland", suburb: "Test", address: "Test", status: "ASSIGNED" } });
    const variation = await client.variation.create({ data: { jobId: job.id, tradieId: tradie.id, description: "Test variation", hoursRequested: 1, status: "PRICED" } });
    const payment = await client.payment.create({ data: { jobId: job.id, variationId: variation.id, kind: "VARIATION", amountCents: 1000 } });
    // The customer had a valid saved checkout before the job was cancelled.
    await client.job.update({ where: { id: job.id }, data: { status: "CANCELLED" } });
    assert.deepEqual(await recordTestPayment(client, payment.id, customer.id), { jobId: job.id, recorded: false });
    assert.equal((await client.payment.findUniqueOrThrow({ where: { id: payment.id } })).status, "PENDING");
    assert.equal((await client.variation.findUniqueOrThrow({ where: { id: variation.id } })).status, "PRICED");
    assert.equal((await client.job.findUniqueOrThrow({ where: { id: job.id } })).status, "CANCELLED");
    await client.job.update({ where: { id: job.id }, data: { status: "ASSIGNED" } });
    assert.equal(await recordTestPayment(client, payment.id, tradie.id), null);
    assert.equal((await recordTestPayment(client, payment.id, customer.id))?.recorded, true);
    assert.equal((await recordTestPayment(client, payment.id, customer.id))?.recorded, false);
    assert.equal((await client.variation.findUniqueOrThrow({ where: { id: variation.id } })).status, "APPROVED");
    assert.equal(await client.payment.count({ where: { id: payment.id, status: "PAID" } }), 1);
  } finally { await client.$disconnect(); rmSync(dir, { recursive: true, force: true }); }
});
