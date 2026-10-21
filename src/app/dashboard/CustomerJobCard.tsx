import Link from "next/link";
import { SourceIcon } from "@/components/SourceIcon";
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
  const photo = job.photos[0]?.url;
  const pendingTradeSetup = tradeRequirementsPending(job.category);
  const eta = job.status === "REVIEW" && !pendingTradeSetup ? demoQuoteEta(job.id) : undefined;
  const action = customerAction(job, pendingPaymentId);
  const needsAction = job.status === "PRICED" || job.status === "SUBMITTED";
  const closed = job.status === "COMPLETED" || job.status === "CANCELLED";
  const stage = job.status === "REVIEW" && pendingTradeSetup ? "Trade setup pending"
    : job.status === "PRICED" && job.priceCents === null ? "Waiting for price"
      : CUSTOMER_STAGES[job.status] ?? "View job status";

  return (
    <article className={styles.card} aria-labelledby={`customer-job-${job.id}`}>
      <Link href={`/jobs/${job.id}`} className={styles.photo} aria-label={`View ${job.title}`}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" />
        ) : <div className={styles.noPhoto}><SourceIcon name="jobs" size={40} /><span>No photo yet</span></div>}
      </Link>
      <div className={styles.body}>
        <h2 id={`customer-job-${job.id}`} className={styles.title}><Link href={`/jobs/${job.id}`}>{job.title}</Link></h2>
        <span className={`${styles.status} ${needsAction ? styles.needsAction : closed ? styles.closed : ""}`}>
          <span className={styles.statusDot} aria-hidden="true" />{stage}
        </span>
        {job.priceCents !== null ? (
          <dl className={styles.quote}><dt>Fixed price</dt><dd>{formatNZD(job.priceCents)}</dd></dl>
        ) : eta ? (
          <dl className={styles.quote}><dt>Quote ETA · demo</dt><dd className={styles.eta}>{eta}</dd></dl>
        ) : null}
        <Link href={action.href} className={styles.action}>{action.label}<span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  );
}
