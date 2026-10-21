// Demo data for local development: one job at every stage. Wipes the database first.
// Every demo account's password is: demo-password
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { priceWork } from "../src/lib/pricing";

const db = new PrismaClient();
const DEMO_PASSWORD = "demo-password";
// Local source-image wrappers visibly identify themselves as demo illustrations.
// These are fixture URLs, not uploads or photographs of the fictional jobs.
const DEMO_PHOTOS = ["/demo/wiring-demo.svg", "/demo/pipework-demo.svg"];
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);

async function main() {
  await db.$transaction([
    db.review.deleteMany(), db.message.deleteMany(), db.payout.deleteMany(), db.coc.deleteMany(),
    db.payment.deleteMany(), db.photo.deleteMany(), db.variation.deleteMany(), db.estimate.deleteMany(),
    db.job.deleteMany(), db.user.deleteMany(), db.settings.deleteMany(),
  ]);
  const s = await db.settings.create({ data: { id: 1 } });
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = (email: string, data: Record<string, unknown>) =>
    db.user.create({ data: { email, passwordHash, region: "Southland", ...data } as never });

  await user("admin@demo.test", { name: "Trade Marketplace", role: "ADMIN" });
  const sarah = await user("customer@demo.test", { name: "Sarah Thompson", role: "CUSTOMER", phone: "021 000 0001" });
  const mike = await user("customer2@demo.test", { name: "Mike Rāwiri", role: "CUSTOMER", phone: "021 000 0003" });
  const jack = await user("sparky@demo.test", {
    name: "Jack Henderson", role: "TRADIE", trade: "Electrical", registrationNo: "E000001", licenceVerified: true, phone: "027 000 0002",
    bio: "Registered electrician, 6 years in the trade. Evenings and weekends around Invercargill.",
  });
  const aroha = await user("sparky2@demo.test", {
    name: "Aroha Wilson", role: "TRADIE", trade: "Electrical", registrationNo: "E000002", licenceVerified: true,
  });
  await user("sparky3@demo.test", { name: "Sam Patel", role: "TRADIE", trade: "Electrical", registrationNo: "E000003", licenceVerified: false });

  let n = 1001;
  const frozen = { tradieRateCents: s.tradieRateCents, onCostPct: s.onCostPct, marginPct: s.marginPct, gstPct: s.gstPct };
  const priced = (hours: number, materials: number) => {
    const p = priceWork(hours, materials * 100, s);
    return { ...frozen, hours: p.hours, materialsCents: p.materialsCents, priceCents: p.totalCents };
  };
  const base = { category: "Electrical", region: "Southland", photos: { create: DEMO_PHOTOS.map((url) => ({ url })) } };

  // 1. Under review, with two blind estimates
  const review = await db.job.create({
    data: {
      ...base, jobNumber: n++, customerId: mike.id, suburb: "Gladstone", address: "12 Example Street", createdAt: daysAgo(0.3),
      title: "Heat pump circuit for new 6kW unit",
      description: "DEMO JOB — attached images are illustrative legacy design samples, not photos of this work. Getting a heat pump installed in the lounge. Installer says I need a dedicated circuit from the switchboard - about 8 m run. Switchboard is in the garage.",
    },
  });
  await db.estimate.createMany({
    data: [
      { jobId: review.id, tradieId: jack.id, hours: 3, materialsCents: 12000, note: "RCBO + 2.5mm + outdoor isolator. Assumes space on the board." },
      { jobId: review.id, tradieId: aroha.id, hours: 4, materialsCents: 14000, note: "Allowing an hour in case the board needs a tidy." },
    ],
  });

  // 2. Under review, no estimates yet
  await db.job.create({
    data: {
      ...base, jobNumber: n++, customerId: sarah.id, suburb: "Waverley", address: "8 Example Road", createdAt: daysAgo(0.1),
      title: "3 downlights in hallway",
      description: "DEMO JOB — attached images are illustrative legacy design samples, not photos of this work. Hallway only has one old batten light. Would like 3 LED downlights on the existing switch. Ceiling space accessible from the manhole.",
    },
  });

  // 3. Priced, waiting for customer payment
  const pricedJob = await db.job.create({
    data: {
      ...base, jobNumber: n++, customerId: sarah.id, suburb: "Waverley", address: "8 Example Road", status: "PRICED",
      createdAt: daysAgo(2), pricedAt: daysAgo(1.5), ...priced(2, 25),
      title: "Replace 2 broken double power points",
      description: "DEMO JOB — attached images are illustrative legacy design samples, not photos of this work. Two cracked double power points in the bedroom need replacing. Both work, just cracked faces.",
      pricingNote: "Includes 2 new PDL 600 series doubles, testing and CoC.",
    },
  });
  await db.payment.create({ data: { jobId: pricedJob.id, kind: "JOB", amountCents: pricedJob.priceCents! } });

  // 4. Paid, waiting for a sparky
  const bookable = await db.job.create({
    data: {
      ...base, jobNumber: n++, customerId: mike.id, suburb: "Glengarry", address: "40 Example Avenue", status: "BOOKABLE",
      createdAt: daysAgo(3), pricedAt: daysAgo(2.5), paidAt: daysAgo(0.5), ...priced(3, 180),
      title: "Smoke alarms - hardwired interconnected x4",
      description: "DEMO JOB — attached images are illustrative legacy design samples, not photos of this work. Selling the house and want 4 hardwired interconnected smoke alarms. Single storey, good ceiling access.",
    },
  });
  await db.payment.create({ data: { jobId: bookable.id, kind: "JOB", amountCents: bookable.priceCents!, status: "PAID", paidAt: daysAgo(0.5) } });

  // 5. Assigned to Jack, with a variation waiting for pricing
  const kitchen = await db.job.create({
    data: {
      ...base, jobNumber: n++, customerId: sarah.id, tradieId: jack.id, suburb: "Waverley", address: "8 Example Road", status: "ASSIGNED",
      createdAt: daysAgo(6), pricedAt: daysAgo(5), paidAt: daysAgo(4.5), assignedAt: daysAgo(4), ...priced(6, 330),
      title: "Kitchen reno - move plugs, hob isolator, dishwasher plug",
      description: "DEMO JOB — attached images are illustrative legacy design samples, not photos of this work. Hob isolator moved to the other side, 2 benchtop doubles relocated, new dishwasher plug under the sink and a rangehood plug. Gib is off.",
    },
  });
  await db.payment.create({ data: { jobId: kitchen.id, kind: "JOB", amountCents: kitchen.priceCents!, status: "PAID", paidAt: daysAgo(4.5) } });
  await db.variation.create({
    data: {
      jobId: kitchen.id, tradieId: jack.id, hoursRequested: 1.5, createdAt: daysAgo(0.05),
      photos: { create: DEMO_PHOTOS.map((url) => ({ url, jobId: kitchen.id })) },
      description: "DEMO JOB — attached images are illustrative legacy design samples, not photos of this work. Existing hob cable is 4mm and nicked behind the old isolator - needs a new 6mm run from the board, ~12 m.",
    },
  });
  await db.message.createMany({
    data: [
      { jobId: kitchen.id, senderId: sarah.id, body: "Gib's off, the side door will be unlocked from 8.", createdAt: daysAgo(3) },
      { jobId: kitchen.id, senderId: jack.id, body: "Sweet, I'll be there 8.30 Thursday.", createdAt: daysAgo(2.9) },
    ],
  });

  // 6. Completed and paid out, with a review
  const done = await db.job.create({
    data: {
      ...base, jobNumber: n++, customerId: mike.id, tradieId: jack.id, suburb: "Gladstone", address: "12 Example Street", status: "COMPLETED",
      createdAt: daysAgo(20), pricedAt: daysAgo(19), paidAt: daysAgo(18), assignedAt: daysAgo(17), completedAt: daysAgo(15), ...priced(2, 40),
      title: "Outdoor double plug on the deck",
      description: "DEMO JOB — attached images are illustrative legacy design samples, not photos of this work. Want a weatherproof double plug on the deck for a BBQ and heater.",
    },
  });
  await db.payment.create({ data: { jobId: done.id, kind: "JOB", amountCents: done.priceCents!, status: "PAID", paidAt: daysAgo(18) } });
  await db.coc.create({ data: { jobId: done.id, cocNumber: "DEMO-NOT-A-CERTIFICATE", fileUrl: "/demo/not-a-certificate.pdf", materialsSpentCents: 3850, uploadedAt: daysAgo(16) } });
  const pay = priceWork(2, 0, s, { applyMinimum: false });
  await db.payout.create({
    data: { jobId: done.id, tradieId: jack.id, hours: 2, rateCents: s.tradieRateCents, grossCents: pay.tradieGrossCents, holidayPayCents: pay.holidayPayCents, createdAt: daysAgo(15) },
  });
  await db.review.create({ data: { jobId: done.id, authorId: mike.id, tradieId: jack.id, rating: 5, comment: "On time, tidy, explained everything.", createdAt: daysAgo(14) } });

  console.log(`Seeded. Password for every demo account is in prisma/seed.ts. Accounts: admin@, customer@, customer2@, sparky@, sparky2@, sparky3@ (all @demo.test).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
