import Link from "next/link";
import { jobRef, timeAgo } from "@/lib/constants";
import { CategoryChip, StatusChip } from "./ui";

type JobCardJob = {
  id: string;
  jobNumber: number;
  title: string;
  category: string;
  description: string;
  region: string;
  suburb: string;
  status: string;
  createdAt: Date;
  photos: { url: string }[];
};

export function JobCard({
  job,
  audience = "staff",
  aside,
}: {
  job: JobCardJob;
  audience?: "staff" | "customer" | "none";
  aside?: React.ReactNode;
}) {
  const cover = job.photos[0]?.url;
  return (
    <Link href={`/jobs/${job.id}`} className="card group flex overflow-hidden transition hover:border-forest/40 hover:shadow-md">
      <div className="relative w-20 shrink-0 bg-forest-2 sm:w-36">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-3xl opacity-60" aria-hidden>⚡</div>
        )}
      </div>
      <div className="min-w-0 flex-1 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip name={job.category} />
          {audience !== "none" && <StatusChip status={job.status} audience={audience} />}
          <span className="ml-auto text-xs text-muted">{jobRef(job.jobNumber)} · {timeAgo(job.createdAt)}</span>
        </div>
        <h3 className="mt-2 break-words font-semibold group-hover:text-leaf-dark">{job.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{job.description}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>{job.suburb}, {job.region}</span>
          {aside}
        </div>
      </div>
    </Link>
  );
}
