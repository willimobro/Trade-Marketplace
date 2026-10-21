import Link from "next/link";
import { timeAgo } from "@/lib/constants";
import { CategoryChip, StatusChip } from "./ui";

type JobCardJob = {
  id: string;
  title: string;
  category: string;
  description: string;
  region: string;
  suburb: string;
  budget: string | null;
  status: string;
  createdAt: Date;
  photos: { url: string }[];
  _count: { quotes: number };
};

export function JobCard({ job, showStatus = false }: { job: JobCardJob; showStatus?: boolean }) {
  const cover = job.photos[0]?.url;
  return (
    <Link href={`/jobs/${job.id}`} className="card group flex overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative w-28 shrink-0 bg-forest-2 sm:w-40">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-3xl opacity-60" aria-hidden>
            {job.category === "Electrical" ? "⚡" : "🛠️"}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip name={job.category} />
          {showStatus && <StatusChip status={job.status} />}
          <span className="ml-auto text-xs text-muted">{timeAgo(job.createdAt)}</span>
        </div>
        <h3 className="mt-2 truncate font-semibold group-hover:text-leaf-dark">{job.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{job.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span>📍 {job.suburb}, {job.region}</span>
          {job.budget && <span>💰 {job.budget}</span>}
          <span className="font-medium text-ink">
            {job._count.quotes} quote{job._count.quotes === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </Link>
  );
}
