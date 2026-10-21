// Demo data for local development. Wipes the database first.
// Every demo account's password is: demo-password
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const DEMO_PASSWORD = "demo-password";
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);

async function main() {
  await db.$transaction([
    db.review.deleteMany(),
    db.message.deleteMany(),
    db.quote.deleteMany(),
    db.photo.deleteMany(),
    db.job.deleteMany(),
    db.user.deleteMany(),
  ]);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const sarah = await db.user.create({
    data: { email: "customer@demo.test", passwordHash, name: "Sarah Thompson", role: "CUSTOMER", region: "Southland", phone: "021 000 0001" },
  });
  const mike = await db.user.create({
    data: { email: "customer2@demo.test", passwordHash, name: "Mike Rāwiri", role: "CUSTOMER", region: "Southland" },
  });
  const sparky = await db.user.create({
    data: {
      email: "sparky@demo.test", passwordHash, name: "Jack Henderson", role: "TRADIE", region: "Southland",
      trade: "Electrical", registrationNo: "E000001", licenceVerified: true, phone: "027 000 0002",
      bio: "Registered electrician, 6 years in the trade. Evenings and weekends for small domestic jobs around Invercargill - plug moves, lighting, heat pump circuits, kitchen renos.",
    },
  });
  const sparky2 = await db.user.create({
    data: {
      email: "sparky2@demo.test", passwordHash, name: "Aroha Wilson", role: "TRADIE", region: "Southland",
      trade: "Electrical", registrationNo: "E000002", licenceVerified: false,
      bio: "Electrician, happy to do small jobs on weekends.",
    },
  });
  await db.user.create({
    data: {
      email: "plumber@demo.test", passwordHash, name: "Tom Baker", role: "TRADIE", region: "Otago",
      trade: "Plumbing", registrationNo: "P000003", licenceVerified: true,
    },
  });

  const kitchen = await db.job.create({
    data: {
      customerId: sarah.id, title: "Kitchen reno - move plugs, hob isolator, dishwasher plug", category: "Electrical",
      description: "Redoing our kitchen. Need the hob isolator moved to the other side, 2 benchtop double plugs relocated, a new dishwasher plug under the sink and a rangehood plug. Gib is off at the moment so access is easy. Joinery goes in next month.",
      region: "Southland", suburb: "Waverley", budget: "$1,000-1,500", createdAt: daysAgo(3),
    },
  });
  await db.job.create({
    data: {
      customerId: sarah.id, title: "Add 3 downlights in hallway", category: "Electrical",
      description: "Hallway only has one old batten light. Would like 3 LED downlights on the existing switch. Ceiling space is accessible from the manhole.",
      region: "Southland", suburb: "Waverley", createdAt: daysAgo(1),
    },
  });
  await db.job.create({
    data: {
      customerId: mike.id, title: "Heat pump circuit for new 6kW unit", category: "Electrical",
      description: "Getting a heat pump installed in the lounge. Installer says I need a dedicated circuit from the switchboard - about 8 m run. Switchboard is in the garage.",
      region: "Southland", suburb: "Gladstone", budget: "Under $600", createdAt: daysAgo(0.2),
    },
  });
  await db.job.create({
    data: {
      customerId: mike.id, title: "Leaking shower mixer", category: "Plumbing",
      description: "Shower mixer drips constantly even when fully off. Probably needs a new cartridge.",
      region: "Otago", suburb: "Mosgiel", createdAt: daysAgo(2),
    },
  });
  const done = await db.job.create({
    data: {
      customerId: mike.id, title: "Replace 2 broken power points", category: "Electrical",
      description: "Two cracked double power points in the bedroom need replacing.",
      region: "Southland", suburb: "Gladstone", status: "COMPLETED", createdAt: daysAgo(20),
    },
  });

  const q1 = await db.quote.create({
    data: {
      jobId: kitchen.id, tradieId: sparky.id, priceCents: 120000, createdAt: daysAgo(2),
      message: "All in price incl. materials and CoC. About 5 hours while the gib is off, then fit-off once the joinery is in. Can start Monday.",
    },
  });
  await db.quote.create({
    data: {
      jobId: kitchen.id, tradieId: sparky2.id, priceCents: 135000, createdAt: daysAgo(1),
      message: "Includes all materials, hob isolator, 4 sockets, CoC. Weekend work only.",
    },
  });
  await db.message.createMany({
    data: [
      { quoteId: q1.id, senderId: sarah.id, body: "Does that include the rangehood plug as well?", createdAt: daysAgo(1.9) },
      { quoteId: q1.id, senderId: sparky.id, body: "Yep, rangehood plug is included. Fridge plug move too if you want it.", createdAt: daysAgo(1.8) },
    ],
  });

  await db.quote.create({
    data: { jobId: done.id, tradieId: sparky.id, priceCents: 18000, status: "ACCEPTED", message: "Two new PDL doubles fitted and tested.", createdAt: daysAgo(19) },
  });
  await db.review.create({
    data: { jobId: done.id, authorId: mike.id, tradieId: sparky.id, rating: 5, comment: "Turned up when he said he would, tidy job, fair price.", createdAt: daysAgo(15) },
  });

  console.log(`Seeded. Demo logins use password "${DEMO_PASSWORD}": customer@demo.test, sparky@demo.test (and customer2/sparky2/plumber).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
