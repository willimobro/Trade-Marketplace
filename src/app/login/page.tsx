import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { next } = await searchParams;
  return (
    <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-16">
      <aside className="rounded-2xl bg-forest p-6 text-white sm:p-8"><h2 className="text-2xl font-bold sm:text-3xl">Pick up where you left off.</h2><p className="mt-4 text-white/80">Keep your job details, conversations and next steps in one place.</p><Image src="/brand/login-phone.png" alt="" width={560} height={560} className="mx-auto mt-8 hidden h-auto w-full max-w-sm lg:block" /></aside>
      <div className="w-full max-w-[680px]">
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-3 text-sm text-muted">
        No account?{" "}
        <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-leaf-dark hover:underline">
          Sign up
        </Link>
      </p>
      <LoginForm next={next} />
      <div className="mt-4 flex flex-wrap gap-x-6"><Link href="/recovery" className="inline-flex min-h-12 items-center text-sm font-semibold underline">Forgot password? (Preview)</Link><Link href="/support" className="inline-flex min-h-12 items-center text-sm font-semibold underline">Sign-in help</Link></div>
      </div>
    </div>
  );
}
