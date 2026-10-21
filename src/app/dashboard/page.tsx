import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatNZD, timeAgo } from "@/lib/constants";
import { JobCard } from "@/components/JobCard";
import { CategoryChip, EmptyState, LicenceBadge, StatusChip } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kia ora, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-muted">{user.role === "TRADIE" ? `${user.trade} · ${user.region}` : user.region}</p>
        </div>
        {user.role === "CUSTOMER" ? (
          <Link href="/jobs/new" className="btn-primary">+ Post a job</Link>
        ) : (
          <div className="flex items-center gap-3">
            <LicenceBadge verified={user.licenceVerified} />
            <Link href="/jobs" className="btn-primary">Find jobs</Link>
          </div>
        )}
      </div>
      {user.role === "CUSTOMER" ? <CustomerDash userId={user.id} /> : <TradieDash userId={user.id} />}
    </div>
  );
}

async function CustomerDash({ userId }: { userId: string }) {
  const jobs = await db.job.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: "desc" },
    include: { photos: { take: 1 }, _count: { select: { quotes: true } } },
  });
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-bold">Your jobs</h2>
      {jobs.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {jobs.map((job) => <JobCard key={job.id} job={job} showStatus />)}
        </div>
      ) : (
        <EmptyState title="You haven't posted any jobs yet">
          <Link href="/jobs/new" className="underline">Post your first job</Link> - it&apos;s free.
        </EmptyState>
      )}
    </section>
  );
}

async function TradieDash({ userId }: { userId: string }) {
  const quotes = await db.quote.findMany({
    where: { tradieId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      job: { select: { id: true, title: true, category: true, suburb: true, region: true, status: true } },
      _count: { select: { messages: true } },
    },
  });
  const won = quotes.filter((q) => q.status === "ACCEPTED");
  const wonValue = won.reduce((s, q) => s + q.priceCents, 0);

  return (
    <>
      <section className="mt-8 grid grid-cols-3 gap-3">
        {[
          ["Quotes sent", quotes.length.toString()],
          ["Jobs won", won.length.toString()],
          ["Won value", formatNZD(wonValue)],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-1 text-xl font-bold">{value}</p>
          </div>
        ))}
      </section>
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">Your quotes</h2>
        {quotes.length ? (
          <div className="card divide-y divide-black/5">
            {quotes.map((q) => (
              <Link key={q.id} href={`/jobs/${q.job.id}`} className="flex flex-wrap items-center gap-3 p-4 hover:bg-black/[0.02]">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryChip name={q.job.category} />
                    <span className="text-xs text-muted">{q.job.suburb}, {q.job.region} · {timeAgo(q.createdAt)}</span>
                  </div>
                  <p className="mt-1 truncate font-medium">{q.job.title}</p>
                  <p className="text-xs text-muted">{q._count.messages} message{q._count.messages === 1 ? "" : "s"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatNZD(q.priceCents)}</p>
                  <StatusChip status={q.status} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No quotes yet">
            <Link href="/jobs" className="underline">Browse open jobs</Link> in your area.
          </EmptyState>
        )}
      </section>
    </>
  );
}
