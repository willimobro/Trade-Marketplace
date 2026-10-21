export const supportTopics = ["Getting started", "Your account", "Jobs & quotes", "Payments"] as const;
export type SupportTopic = typeof supportTopics[number];

export type SupportRequest = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export type SupportErrors = Partial<Record<keyof SupportRequest, string>>;

export function validateSupportRequest(request: SupportRequest): SupportErrors {
  const errors: SupportErrors = {};
  if (request.name.trim().length < 2) errors.name = "Enter a name with at least 2 characters.";
  else if (request.name.trim().length > 100) errors.name = "Keep your name under 100 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email.trim()) || request.email.trim().length > 254) {
    errors.email = "Enter an email address, such as alex@example.com.";
  }
  if (!supportTopics.includes(request.topic as SupportTopic)) errors.topic = "Choose what you need help with.";
  if (request.message.trim().length < 20) errors.message = "Add a little more detail (at least 20 characters).";
  else if (request.message.trim().length > 2000) errors.message = "Keep your message under 2,000 characters.";
  return errors;
}

export const supportArticles: {
  id: string;
  topic: SupportTopic;
  question: string;
  answer: string;
  link?: { href: string; label: string };
}[] = [
  {
    id: "post-a-job", topic: "Getting started", question: "How do I find the right tradie?",
    answer: "Start with the trade you need, then describe the job and where it is. Add photos if they help explain the work. You can browse tradie profiles and review your job from My jobs.",
    link: { href: "/jobs/new", label: "Post a job" },
  },
  {
    id: "forgot-password", topic: "Your account", question: "What if I’ve forgotten my password?",
    answer: "Choose Forgot password on the sign-in page and follow the recovery steps. The recovery walkthrough currently uses sample details; no email is sent and no password is changed.",
    link: { href: "/recovery", label: "Open account recovery" },
  },
  {
    id: "job-progress", topic: "Jobs & quotes", question: "Where can I check my job’s progress?",
    answer: "Open My jobs and choose your job. Its details show the latest status, the next available action and your conversation. If you’re returning after an interruption, check this status before trying an action again.",
    link: { href: "/dashboard", label: "Go to My jobs" },
  },
  {
    id: "extra-work", topic: "Jobs & quotes", question: "What happens if the job needs extra work?",
    answer: "Extra work needs a variation. Review the proposed changes and price in the job before approving them. A tradie’s private estimate is separate from the fixed price shown to the customer.",
  },
  {
    id: "payment", topic: "Payments", question: "Will I be charged when I try a payment?",
    answer: "Payments in this app are a demo. Following a test payment updates the example flow without charging a card. Use sample details only; never enter real card information.",
  },
  {
    id: "receipt", topic: "Payments", question: "Where can I find my payment record?",
    answer: "Open the job from My jobs. After a completed test payment, use its payment record link to review the example amount and status. Demo payment records are examples, rather than tax invoices.",
    link: { href: "/dashboard", label: "Find your job" },
  },
  {
    id: "update-account", topic: "Your account", question: "How do I update my account details?",
    answer: "Visit Account to review your profile and the details available to edit. If you need to use a different account, sign out before signing in again.",
    link: { href: "/profile", label: "Open Account" },
  },
  {
    id: "trades", topic: "Getting started", question: "Which trades can I find here?",
    answer: "Browse Electrical, Plumbing, Gas Fitting and Construction. Each tradie’s profile gives you more context about their work. Check the details on the profile before choosing the right person for your job.",
    link: { href: "/", label: "Explore the trades" },
  },
];
