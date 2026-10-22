import { CustomerLanding } from "@/components/landing/CustomerLanding";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
/** Marketing remains available without replacing the signed-in app Home. */
export default async function Website() {
  const user = await getCurrentUser();
  return <CustomerLanding role={user?.role ?? null} landingPath="/website" />;
}
