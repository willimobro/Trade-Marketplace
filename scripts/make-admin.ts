// Turns an existing account into a Trade Marketplace admin (pricing, payouts, licence checks).
//   npm run make-admin -- you@example.com
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const email = process.argv[2]?.toLowerCase();
  if (!email) throw new Error("Usage: npm run make-admin -- you@example.com");
  const user = await db.user.update({ where: { email }, data: { role: "ADMIN" } }).catch(() => null);
  if (!user) throw new Error(`No account for ${email} - sign up on the site first.`);
  console.log(`${user.name} is now an admin.`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
