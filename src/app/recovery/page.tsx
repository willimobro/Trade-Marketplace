import Link from "next/link";

const screens = {
  request: { title: "Trouble signing in?", description: "Explore how account recovery will work. Recovery emails and password resets are not connected in this prototype." },
  sent: { title: "Recovery request preview", description: "In the connected service, this screen would confirm a recovery request without revealing whether an account exists. No email has been sent." },
  expired: { title: "This example link has expired", description: "A real recovery link would be time limited and usable once. This is an example of the expired-link state, not a check of your account." },
  reset: { title: "Reset password preview", description: "A connected service would verify the recovery link before accepting a new password. Do not enter a real password here." },
  complete: { title: "Recovery walkthrough complete", description: "You have reached the end of the preview. No password was changed and your existing sign-in details are unchanged." },
};

export default async function RecoveryPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  const stage = state && Object.prototype.hasOwnProperty.call(screens, state) ? state as keyof typeof screens : "request";
  const screen = screens[stage];
  return <div className="mx-auto max-w-[680px] px-4 py-10 sm:px-6">
    <Link href="/login" className="inline-flex min-h-12 items-center text-sm font-semibold underline">← Back to sign in</Link>
    <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><strong>Frontend preview only.</strong> No emails, account lookups or password changes occur here.</div>
    <section className="card mt-6 p-6 sm:p-8">
      <p className="text-sm font-semibold text-muted">Account recovery</p><h1 className="mt-3 text-3xl font-bold">{screen.title}</h1><p className="mt-4 leading-7 text-muted">{screen.description}</p>
      {stage === "request" && <><label htmlFor="example-email" className="label mt-6">Example email (demonstration only)</label><input id="example-email" className="input" value="customer@example.com" readOnly aria-describedby="example-email-help" /><p id="example-email-help" className="mt-2 text-sm text-muted">We use an example address so you don’t need to share personal details.</p><Link href="/recovery?state=sent" className="btn-primary mt-6">Preview recovery request →</Link></>}
      {stage === "sent" && <><p className="mt-6 rounded-xl bg-paper p-4 text-sm leading-6">In the live flow: check your inbox and spam folder, confirm the address, then request a new link if needed. The service is not connected yet.</p><div className="mt-6 flex flex-wrap gap-3"><Link className="btn-primary" href="/recovery?state=reset">Preview a valid link</Link><Link className="btn-ghost" href="/recovery?state=expired">Preview an expired link</Link></div></>}
      {stage === "expired" && <Link href="/recovery" className="btn-primary mt-6">Start the preview again</Link>}
      {stage === "reset" && <><div className="mt-6 rounded-xl bg-paper p-4"><p className="font-semibold">Password entry is disabled in this preview</p><p className="mt-2 text-sm text-muted">The final form will include password requirements, confirmation and validation feedback. No password is requested or stored here.</p></div><Link href="/recovery?state=complete" className="btn-primary mt-6">Preview completion</Link></>}
      {stage === "complete" && <Link href="/login" className="btn-primary mt-6">Return to sign in</Link>}
    </section>
    <Link href="/support?topic=sign-in" className="mt-4 inline-flex min-h-12 items-center font-semibold underline">Need more help?</Link>
  </div>;
}
