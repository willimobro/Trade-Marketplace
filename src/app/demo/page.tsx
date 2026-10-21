import "server-only";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { login } from "@/app/actions/auth";
import type { FormState } from "@/app/actions/types";
import { DemoAccess } from "./DemoAccess";
import { allowsLocalDemo } from "./gate";

export const dynamic = "force-dynamic";
export const metadata = { title: "Local demo access", robots: { index: false, follow: false } };

async function requireLocalDemo() {
  const host = (await headers()).get("host");
  if (!allowsLocalDemo(process.env.TRADE_LOCAL_DEMO, host)) notFound();
}

async function demoLogin(previous: FormState, form: FormData): Promise<FormState> {
  "use server";
  // Repeat the gate on action requests; hiding the page alone is insufficient.
  await requireLocalDemo();
  const role = form.get("role");
  const accounts: Record<string, { email: string; next: string }> = {
    customer: { email: "customer@demo.test", next: "/dashboard" },
    tradie: { email: "sparky@demo.test", next: "/dashboard" },
    admin: { email: "admin@demo.test", next: "/admin" },
  };
  if (typeof role !== "string" || !Object.hasOwn(accounts, role)) return { error: "Choose one of the listed demo roles." };
  const credentials = new FormData();
  credentials.set("email", accounts[role].email);
  credentials.set("password", "demo-password");
  credentials.set("next", accounts[role].next);
  // Normal password verification and session creation live exclusively in login.
  return login(previous, credentials);
}

export default async function LocalDemoPage() {
  await requireLocalDemo();
  return <section className="mx-auto max-w-sm space-y-6 px-6 py-8">
    <h1 className="text-2xl font-semibold">Local demo access</h1>
    <p className="text-sm">For this explicitly enabled local development runtime only. Each button signs in through the normal password login using an existing demo account. It does not create accounts or bypass authentication.</p>
    <p className="text-sm">Choosing a role replaces this browser’s current session. Demo payments do not move money; account actions change this runtime’s database.</p>
    <DemoAccess action={demoLogin} />
  </section>;
}
