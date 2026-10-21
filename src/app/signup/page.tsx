import Image from "next/image";
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
    <div className="mx-auto grid max-w-[1200px] items-start gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-16">
      <aside className="rounded-2xl bg-forest p-6 text-white sm:p-8"><h2 className="text-2xl font-bold sm:text-3xl">A better way to get the job done.</h2><p className="mt-4 text-white/80">Post an electrical job or join as a tradie. Private estimates help Trade Marketplace set a clear fixed price.</p><Image src="/brand/create-account.png" alt="" width={560} height={560} className="mx-auto mt-8 hidden h-auto w-full max-w-sm lg:block" /><p className="mt-6 text-sm text-white/70">Development preview · Payments are simulated.</p></aside>
      <div className="w-full max-w-[680px]">
      <h1 className="text-3xl font-bold">Create your account</h1>
      <p className="mt-3 text-sm text-muted">
        Already have one?{" "}
        <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-leaf-dark hover:underline">
          Log in
        </Link>
      </p>
      <SignupForm initialRole={role === "TRADIE" ? "TRADIE" : "CUSTOMER"} next={next} />
      </div>
    </div>
  );
}
