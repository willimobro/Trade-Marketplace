import "server-only";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { createSession } from "./session";

/** Verify an existing password and create the ordinary signed session.
 * Callers own their destination; this helper never redirects or assigns roles. */
export async function createPasswordSession(email: string, password: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return false;
  await createSession(user.id);
  return true;
}
