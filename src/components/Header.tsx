import Link from "next/link";
import { logout } from "@/app/actions/auth";
import type { CurrentUser } from "@/lib/session";
import { Avatar, Logo } from "./ui";
import { Navigation } from "./Navigation";

export function Header({ user }: { user: CurrentUser | null }) {
  return (
    <header className={`bg-forest text-white ${user ? "lg:hidden" : ""}`}>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Account navigation" className="flex flex-wrap items-center gap-2 text-sm">
          {!user ? <>
            <Link href="/for-tradies" className="rounded-xl px-3 py-3 hover:bg-white/10">For electricians</Link>
            <Link href="/login" className="rounded-xl px-3 py-3 hover:bg-white/10">Log in</Link>
            <Link href="/signup" className="btn-lime">Get started</Link>
          </> : <>
            <Link href="/profile" className="flex min-h-12 items-center gap-2 rounded-xl px-2 hover:bg-white/10" aria-label={`Account for ${user.name}`}>
              <Avatar name={user.name} url={user.avatarUrl} size={32} /><span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
            </Link>
            <form action={logout}><button className="min-h-12 rounded-xl px-3 py-3 text-white/85 hover:bg-white/10">Log out</button></form>
          </>}
        </nav>
      </div>
      {user && <div className="border-t border-white/10"><Navigation role={user.role} mobile /></div>}
    </header>
  );
}
