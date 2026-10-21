import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { SignupForm } from "./SignupForm";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ role?: string; next?: string }> }) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { role, next } = await searchParams;
  return <SignupForm initialRole={role === "TRADIE" ? "TRADIE" : "CUSTOMER"} next={next} />;
}
