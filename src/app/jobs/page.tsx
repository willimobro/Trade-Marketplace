import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { CATEGORY_NAMES, REGIONS } from "@/lib/constants";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; region?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const category = (CATEGORY_NAMES as readonly string[]).includes(sp.category ?? "") ? sp.category : undefined;
  const region = (REGIONS as readonly string[]).includes(sp.region ?? "") ? sp.region : undefined;
  const q = sp.q?.trim().slice(0, 80) || undefined;

  const [user, jobs] = await Promise.all([
    getCurrentUser(),
    db.job.findMany({
      where: {
        status: "OPEN",
        category,
        region,
        ...(q && { OR: [{ title: { contains: q } }, { description: { contains: q } }, { suburb: { contains: q } }] }),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { photos: { take: 1 }, _count: { select: { quotes: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Open jobs</h1>
          <p className="text-sm text-muted">{jobs.length} job{jobs.length === 1 ? "" : "s"} taking quotes</p>
        </div>
        {user?.role === "CUSTOMER" && <Link href="/jobs/new" className="btn-primary">+ Post a job</Link>}
      </div>

      <form className="card mt-6 grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto_auto]">
        <input className="input" name="q" defaultValue={q} placeholder="Search e.g. heat pump, rewire, Waikiwi" aria-label="Search jobs" />
        <select className="input" name="category" defaultValue={category ?? ""} aria-label="Category">
          <option value="">All trades</option>
          {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" name="region" defaultValue={region ?? ""} aria-label="Region">
          <option value="">All of NZ</option>
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
        <button className="btn-primary">Filter</button>
      </form>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {jobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
      {!jobs.length && (
        <div className="mt-6">
          <EmptyState title="No jobs match that">
            Try a different region or trade, or <Link href="/jobs" className="underline">clear the filters</Link>.
          </EmptyState>
        </div>
      )}
    </div>
  );
}
