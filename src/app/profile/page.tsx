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
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your profile</h1>
        {user.role === "TRADIE" && (
          <Link href={`/tradies/${session.id}`} className="text-sm font-medium text-leaf-dark hover:underline">View public profile →</Link>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">{user.email} · {user.role === "TRADIE" ? "Tradie account" : "Customer account"}</p>
      <ProfileForm user={user} />
      <form action={logout} className="mt-6 sm:hidden">
        <button className="btn-ghost w-full">Log out</button>
      </form>
    </div>
  );
}
