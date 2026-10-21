import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { CATEGORIES } from "@/lib/constants";
import { JobCard } from "@/components/JobCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [user, latest, counts] = await Promise.all([
    getCurrentUser(),
    db.job.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { photos: { take: 1 }, _count: { select: { quotes: true } } },
    }),
    db.job.groupBy({ by: ["category"], where: { status: "OPEN" }, _count: true }),
  ]);
  const countFor = (name: string) => counts.find((c) => c.category === name)?._count ?? 0;

  return (
    <>
      <section className="bg-forest text-white">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:pt-20">
          <p className="chip bg-lime/15 text-lime">Licensed individuals · not just big firms</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Get the job done by a <span className="text-lime">local sparky</span>, not a sales team.
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Post your job free. Licensed tradies near you send quotes, you pick the one you like. Plug moves, downlights,
            heat pump circuits - the small jobs the big companies don&apos;t want.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user?.role === "TRADIE" ? (
              <Link href="/jobs" className="btn-lime px-6 py-3 text-base">Find jobs near you</Link>
            ) : (
              <Link href={user ? "/jobs/new" : "/signup?role=CUSTOMER"} className="btn-lime px-6 py-3 text-base">
                Post a job - it&apos;s free
              </Link>
            )}
            {!user && (
              <Link href="/signup?role=TRADIE" className="btn border border-white/25 px-6 py-3 text-base text-white hover:bg-white/10">
                I&apos;m a tradie
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c.name} href={`/jobs?category=${encodeURIComponent(c.name)}`} className="card p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className={`grid h-10 w-10 place-items-center rounded-xl text-xl ${c.color}`} aria-hidden>{c.icon}</span>
              <p className="mt-3 font-semibold">{c.name}</p>
              <p className="text-xs text-muted">{countFor(c.name)} open job{countFor(c.name) === 1 ? "" : "s"}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["1", "Post your job", "Describe it, add a few photos. Takes two minutes and costs nothing."],
            ["2", "Get quotes", "Local licensed tradies quote you directly. Message them with any questions."],
            ["3", "Pick & review", "Accept the quote you like. Once it's done, leave a review to help others."],
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
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold">Latest jobs</h2>
          <Link href="/jobs" className="text-sm font-medium text-leaf-dark hover:underline">See all →</Link>
        </div>
        {latest.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {latest.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <p className="text-sm text-muted">No open jobs yet - be the first to post one.</p>
        )}
      </section>
    </>
  );
}
