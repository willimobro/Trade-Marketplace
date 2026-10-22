import Link from "next/link";
import { JobCardFrame } from "@/components/job-cards/JobCardFrame";
import cardStyles from "@/components/job-cards/job-card.module.css";
import { formatNZD } from "@/lib/constants";
import { demoQuoteEta } from "@/lib/demo-quote-etas";
import { tradeRequirementsPending } from "@/lib/trade-readiness";
import styles from "./CustomerJobCard.module.css";

type CustomerJob = {
  id: string;
  jobNumber: number;
  title: string;
  category: string;
  description: string;
  region: string;
  suburb: string;
  status: string;
  priceCents: number | null;
  createdAt: Date;
  photos: { url: string }[];
};

const CUSTOMER_STAGES: Record<string, string> = {
  REVIEW: "Getting your quote",
  PRICED: "Price ready",
  BOOKABLE: "Finding your tradie",
  ASSIGNED: "Tradie assigned",
  SUBMITTED: "Ready for your review",
  COMPLETED: "Completed",
  CANCEL_REVIEW: "Cancellation in review",
  CANCELLED: "Cancelled",
};

function customerAction(job: CustomerJob, pendingPaymentId?: string) {
  const href = `/jobs/${job.id}`;
  if (job.status === "PRICED" && job.priceCents !== null) {
    // This only opens the existing review flow. Acceptance and test payment still
    // require the separate confirmation on the checkout page.
    return { label: "Accept price", href: pendingPaymentId ? `/pay/${pendingPaymentId}` : href };
  }
  if (job.status === "ASSIGNED") return { label: "Message your tradie", href: `${href}#messages` };
  if (job.status === "SUBMITTED") return { label: "Review completion", href };
  if (job.status === "COMPLETED") return { label: "View payment record", href: `/receipts/${job.id}` };
  if (job.status === "CANCEL_REVIEW") return { label: "View cancellation", href };
  return { label: "View job", href };
}

export function CustomerJobCard({ job, pendingPaymentId }: { job: CustomerJob; pendingPaymentId?: string }) {
  const pendingTradeSetup = tradeRequirementsPending(job.category);
  const eta = job.status === "REVIEW" && !pendingTradeSetup ? demoQuoteEta(job.id) : undefined;
  const action = customerAction(job, pendingPaymentId);
  const needsAction = job.status === "PRICED" || job.status === "SUBMITTED";
  const closed = job.status === "COMPLETED" || job.status === "CANCELLED";
  const stage = job.status === "REVIEW" && pendingTradeSetup ? "Trade setup pending"
    : job.status === "PRICED" && job.priceCents === null ? "Waiting for price"
      : CUSTOMER_STAGES[job.status] ?? "View job status";

  return <JobCardFrame
    title={job.title}
    href={`/jobs/${job.id}`}
    photos={job.photos.map((photo, index) => ({ url: photo.url, alt: `${job.title}, photo ${index + 1}` }))}
    completed={job.status === "COMPLETED"}
    headingLevel={2}
    meta={job.suburb}
    status={<span className={`${styles.status} ${needsAction ? styles.needsAction : closed ? styles.closed : ""}`}><span className={styles.statusDot} aria-hidden="true" />{stage}</span>}
    valueLabel={job.priceCents !== null ? "Fixed price" : closed ? "Price" : "Quote ETA"}
    value={job.priceCents !== null ? formatNZD(job.priceCents) : closed ? "Not priced" : eta ?? "Pending"}
    actions={<Link href={action.href} className={job.status === "PRICED" && job.priceCents !== null ? cardStyles.primaryAction : cardStyles.secondaryAction}>{action.label}<span aria-hidden="true">↗</span></Link>}
  />;
}
