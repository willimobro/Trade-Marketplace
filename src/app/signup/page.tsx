import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { SignupForm } from "./SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; next?: string }>;
}) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { role, next } = await searchParams;
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted">
        Already have one?{" "}
        <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-leaf-dark hover:underline">
          Log in
        </Link>
      </p>
      <SignupForm initialRole={role === "TRADIE" ? "TRADIE" : "CUSTOMER"} next={next} />
    </div>
  );
}
