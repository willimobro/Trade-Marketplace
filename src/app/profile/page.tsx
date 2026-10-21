import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await requireUser("/profile");
  const user = await db.user.findUniqueOrThrow({
    where: { id: session.id },
    select: { name: true, email: true, role: true, region: true, phone: true, bio: true, registrationNo: true, avatarUrl: true, licenceVerified: true },
  });
  return (
    <div className="mx-auto max-w-[760px] px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Your account</h1>
        {user.role === "TRADIE" && (
          <Link href={`/tradies/${session.id}`} className="text-sm font-medium text-leaf-dark hover:underline">View public profile →</Link>
        )}
      </div>
      <p className="mt-3 break-words text-sm text-muted">{user.email} · {user.role === "ADMIN" ? "Administrator account" : user.role === "TRADIE" ? "Tradie account" : "Customer account"}</p>
      <p className="mt-4 text-muted">Keep your details up to date so it’s easier to coordinate your jobs.</p>
      <ProfileForm user={user} />
      <form action={logout} className="mt-6">
        <button className="btn-ghost">Log out</button>
      </form>
    </div>
  );
}
