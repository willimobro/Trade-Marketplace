export function nextAction(status: string, role: "customer" | "assigned" | "tradie" | "admin") {
  if (role === "tradie") return status === "REVIEW"
    ? "Your next step: provide or update your private estimate. Trade Marketplace sets the customer’s price."
    : status === "BOOKABLE" ? "Your next step: review the scope and gross pay before claiming. A job is assigned only after a successful claim." : "Review the latest saved job details; this job is not currently available to estimate or claim.";
  if (role === "admin") return ({
    REVIEW: "Next: review private estimates and set the customer’s fixed price.",
    PRICED: "Waiting for the customer to review and record their test payment.",
    BOOKABLE: "Waiting for a verified electrician to claim the job.",
    ASSIGNED: "The electrician is assigned. Review any requested variations before extra work proceeds.",
    SUBMITTED: "Next: review the CoC and sign off, or await customer sign-off and the automatic release threshold.",
    COMPLETED: "Job signed off. Review the separate manual payroll record; completion is not proof of payment.",
    CANCEL_REVIEW: "Next: investigate the cancellation and record the outcome.",
    CANCELLED: "Job cancelled. Review the saved payment record for any recorded refund.",
  } as Record<string, string>)[status] ?? "Review the latest saved job details.";
  if (role === "assigned") return ({
    ASSIGNED: "Your next step: use messages to agree access and timing. Request pricing for extra work before proceeding; upload the CoC when complete.",
    SUBMITTED: "Waiting for customer or Trade Marketplace sign-off. The automatic sign-off threshold is shown with your CoC.",
    COMPLETED: "Job signed off. Your payroll record is separate; check your dashboard for its manually recorded status.",
    CANCEL_REVIEW: "Trade Marketplace is reviewing the cancellation. Use messages to clarify the situation; no refund outcome is confirmed yet.",
    CANCELLED: "This job is cancelled. Check messages and any existing payroll record for the recorded outcome.",
  } as Record<string, string>)[status] ?? "Review the latest saved job details.";
  return ({
    REVIEW: "Waiting for private electrician estimates and Trade Marketplace’s fixed price. You do not need to pay yet.",
    PRICED: "Your next step: review the fixed price and available test checkout. No electrician is assigned yet.",
    BOOKABLE: "Waiting for a verified electrician to claim the job. No appointment has been scheduled.",
    ASSIGNED: "Your next step: agree access and timing in messages. Review any extra-work price before approving it.",
    SUBMITTED: "Your next step: review the completed work and CoC, then confirm completion. Check the automatic sign-off threshold below.",
    COMPLETED: "Job signed off. You can review the payment record and leave a review for your electrician.",
    CANCEL_REVIEW: "Waiting for Trade Marketplace to investigate your cancellation. A refund is not confirmed until recorded.",
    CANCELLED: "This job is cancelled. Check the payment record for any recorded refund; you can post a new job from your dashboard.",
  } as Record<string, string>)[status] ?? "Review the latest saved job details.";
}
