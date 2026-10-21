import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { hourlyView } from "@/lib/pricing";
import { CATEGORIES, formatNZD } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()]);
  const h = hourlyView(settings);

  return (
    <>
      <section className="bg-forest text-white">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:pt-20">
          <p className="chip bg-lime/15 text-lime">Fixed prices · Licensed sparkies · CoC every time</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            One fair price. <span className="text-lime">No haggling.</span> A licensed sparky at your door.
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Post your job with a few photos. We price it properly, you pay once, and a verified local electrician does the
            work and hands you a Certificate of Compliance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user?.role === "TRADIE" ? (
              <Link href="/jobs" className="btn-lime px-6 py-3 text-base">See jobs near you</Link>
            ) : (
              <Link href={user ? "/jobs/new" : "/signup?role=CUSTOMER"} className="btn-lime px-6 py-3 text-base">
                Get a price - it&apos;s free
              </Link>
            )}
            {!user && (
              <Link href="/for-tradies" className="btn border border-white/25 px-6 py-3 text-base text-white hover:bg-white/10">
                Sparkies: earn {formatNZD(h.tradiePerHourCents)}/hr →
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <div key={c.name} className="card p-4">
              <span className={`grid h-10 w-10 place-items-center rounded-xl text-xl ${c.color}`} aria-hidden>{c.icon}</span>
              <p className="mt-3 font-semibold">{c.name}</p>
              <p className="text-xs text-muted">{c.name === "Electrical" ? "Live now" : "Coming soon"}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-xl font-bold">How it works</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1", "Post your job", "Describe it and add photos. Free, no obligation."],
            ["2", "We price it", "Local sparkies estimate it and we set one fixed price. No bidding wars, no lowballing."],
            ["3", "Pay to book", "Pay up front and your job goes to a verified local electrician."],
            ["4", "Job done + CoC", "You get your Certificate of Compliance. Anything extra is quoted with photos before it's done."],
          ].map(([n, t, d]) => (
            <div key={n} className="flex gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf font-bold text-white">{n}</span>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-sm text-muted">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="card grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <h2 className="text-xl font-bold">Why a fixed price?</h2>
            <p className="mt-2 text-sm text-muted">
              When tradies bid against each other, the cheapest corner-cutter wins. When customers name the price,
              good sparkies walk away. We set a fair price that pays the electrician properly and is still less than a
              typical call-out company.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-paper p-4">
              <p className="text-xs text-muted">You pay (incl GST)</p>
              <p className="mt-1 text-2xl font-bold">{formatNZD(h.customerPerHourCents)}<span className="text-sm font-medium">/hr</span></p>
            </div>
            <div className="rounded-xl bg-leaf/10 p-4">
              <p className="text-xs text-muted">Your sparky earns</p>
              <p className="mt-1 text-2xl font-bold text-leaf-dark">{formatNZD(h.tradiePerHourCents)}<span className="text-sm font-medium">/hr</span></p>
            </div>
            <p className="col-span-2 text-xs text-muted">Minimum {settings.minHours} hrs per job. Materials at cost.</p>
          </div>
        </div>
      </section>
    </>
  );
}
