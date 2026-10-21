import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { Avatar, Logo } from "./ui";

export async function Header() {
  const user = await getCurrentUser();
  const nav = "rounded-lg px-2 py-2 hover:bg-white/10 sm:px-3";
  return (
    <header className="bg-forest text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Logo className="text-base sm:text-lg" />
        <nav className="ml-auto flex items-center gap-1 text-sm sm:gap-2">
          {!user && (
            <>
              <Link href="/for-tradies" className={nav}>For sparkies</Link>
              <Link href="/login" className={nav}>Log in</Link>
              <Link href="/signup" className="btn-lime">Sign up</Link>
            </>
          )}
          {user?.role === "CUSTOMER" && (
            <>
              <Link href="/jobs/new" className="btn-lime">Get a price</Link>
              <Link href="/dashboard" className={nav}>My jobs</Link>
            </>
          )}
          {user?.role === "TRADIE" && (
            <>
              <Link href="/jobs" className={nav}>Job board</Link>
              <Link href="/dashboard" className={nav}>My work</Link>
            </>
          )}
          {user?.role === "ADMIN" && <Link href="/admin" className="btn-lime">Admin</Link>}
          {user && (
            <>
              <Link href="/profile" className="rounded-full hover:ring-2 hover:ring-lime" title="Your profile">
                <Avatar name={user.name} url={user.avatarUrl} size={34} />
              </Link>
              <form action={logout} className="hidden sm:block">
                <button className="rounded-lg px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white">Log out</button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
