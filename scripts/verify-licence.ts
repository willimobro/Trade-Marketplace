// Marks a tradie's licence as verified after you've checked their registration
// number on the EWRB public register by hand.
//   npm run verify-licence -- someone@example.com          (verify)
//   npm run verify-licence -- someone@example.com --revoke (un-verify)
//   npm run verify-licence                                 (list pending)
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const [email, flag] = process.argv.slice(2);
  if (!email) {
    const pending = await db.user.findMany({
      where: { role: "TRADIE", licenceVerified: false },
      select: { email: true, name: true, trade: true, registrationNo: true },
    });
    if (!pending.length) return console.log("No tradies waiting for a licence check.");
    console.log("Waiting for a licence check:");
    for (const t of pending) console.log(`  ${t.email.padEnd(32)} ${t.name.padEnd(22)} ${t.trade}  reg ${t.registrationNo}`);
    return;
  }
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.role !== "TRADIE") throw new Error(`No tradie account for ${email}`);
  const verified = flag !== "--revoke";
  await db.user.update({ where: { id: user.id }, data: { licenceVerified: verified } });
  console.log(`${user.name} (${user.registrationNo}) is now ${verified ? "VERIFIED" : "unverified"}.`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
