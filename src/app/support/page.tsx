import Link from "next/link";
import { SupportPreview } from "./SupportPreview";

export default function SupportPage() {
  return <div className="mx-auto max-w-[880px] px-4 py-10 sm:px-6">
    <p className="text-sm font-semibold text-muted">Help centre</p><h1 className="mt-3 text-3xl font-bold">Let’s find your next step.</h1>
    <p className="mt-4 max-w-2xl leading-7 text-muted">Guidance for the current development app. Support tickets, email delivery and account recovery are not connected.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <section className="card p-6"><h2 className="text-xl font-semibold">Can’t sign in?</h2><p className="mt-3 text-sm leading-6 text-muted">Check the email and password you registered with. If your session has ended, sign in again. Recovery is a preview and cannot restore access yet.</p><Link href="/login" className="mt-4 inline-flex min-h-12 items-center font-semibold underline">Go to sign in →</Link><br /><Link href="/recovery" className="inline-flex min-h-12 items-center text-sm underline">Explore recovery preview</Link></section>
      <section className="card p-6"><h2 className="text-xl font-semibold">Connection interrupted?</h2><p className="mt-3 text-sm leading-6 text-muted">Reconnect before submitting. If a request times out, check the job’s latest status before trying again. Avoid refreshing a form until you have copied any unsaved text.</p><Link href="/dashboard" className="mt-4 inline-flex min-h-12 items-center font-semibold underline">Check your dashboard →</Link></section>
      <section className="card p-6 sm:col-span-2"><h2 className="text-xl font-semibold">A question about a job?</h2><p className="mt-3 text-sm leading-6 text-muted">Open the job to review its status and available conversation. A private electrician estimate is not the customer’s fixed price. Extra work must follow the variation approval flow. Payments in this app are simulated.</p><Link href="/dashboard" className="mt-4 inline-flex min-h-12 items-center font-semibold underline">Find your job →</Link></section>
    </div>
    <SupportPreview />
    <Link href="/" className="mt-6 inline-flex min-h-12 items-center font-semibold underline">← Back to home</Link>
  </div>;
}
