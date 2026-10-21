"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function NotificationsPreview() {
  const [mode, setMode] = useState("examples");
  const [read, setRead] = useState<string[]>([]);
  const stateRef = useRef<HTMLSelectElement>(null);
  const focusAfterRetry = useRef(false);
  useEffect(() => {
    if (!focusAfterRetry.current) return;
    focusAfterRetry.current = false;
    stateRef.current?.focus();
  }, [mode]);
  const examples = [{ id: "price", title: "Fixed price ready to review", detail: "Example: TM has priced a job. The customer’s next step is to review the scope and fixed price." }, { id: "message", title: "New job message", detail: "Example: a message is available in a job conversation. Open the relevant job to read and respond." }];
  return <div className="mx-auto max-w-[760px] px-4 py-10 sm:px-6">
    <p className="text-sm font-semibold text-muted">Account</p><h1 className="mt-3 text-3xl font-bold">Notifications</h1>
    <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><strong>Preview only.</strong> These are fictional examples, not your notifications. Read status lasts only while this page is open. No notification service is connected.</div>
    <label htmlFor="notification-state" className="label mt-6">Preview state</label><select ref={stateRef} id="notification-state" value={mode} onChange={event => setMode(event.target.value)} className="input"><option value="examples">Example notifications</option><option value="empty">No notifications</option><option value="error">Connection error</option></select>
    {mode === "examples" && <section className="mt-6" aria-label="Example notifications"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted" role="status">{examples.length - read.length} unread examples</p><button type="button" className="btn-ghost" aria-disabled={read.length === examples.length} onClick={() => { if (read.length !== examples.length) setRead(examples.map(item => item.id)); }}>Mark examples as read</button></div><ul className="space-y-4">{examples.map(item => <li key={item.id} className="card p-6"><p className="text-xs font-semibold uppercase tracking-wider text-muted">Example · {read.includes(item.id) ? "Read" : "Unread"}</p><h2 className="mt-2 text-xl font-semibold">{item.title}</h2><p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p><button type="button" className="btn-ghost mt-4" onClick={() => setRead(current => current.includes(item.id) ? current.filter(id => id !== item.id) : [...current, item.id])}>Mark as {read.includes(item.id) ? "unread" : "read"}</button></li>)}</ul></section>}
    {mode === "empty" && <section className="card mt-6 p-8"><h2 className="text-xl font-semibold">You’re all caught up — example</h2><p className="mt-3 text-muted">When connected, job updates and messages would appear here. Check your dashboard for actual job status.</p><Link href="/dashboard" className="btn-primary mt-6">Go to dashboard</Link></section>}
    {mode === "error" && <section className="card mt-6 p-8" role="alert"><h2 className="text-xl font-semibold">Couldn’t load updates — example</h2><p className="mt-3 text-muted">This demonstrates a connection error. Your job state would remain unchanged. The button below restores the fictional examples; it does not contact a service.</p><button type="button" className="btn-primary mt-6" onClick={() => { focusAfterRetry.current = true; setMode("examples"); }}>Retry preview</button></section>}
    <div className="mt-6 flex flex-wrap gap-6"><Link href="/profile" className="inline-flex min-h-12 items-center font-semibold underline">Back to account</Link><Link href="/support" className="inline-flex min-h-12 items-center font-semibold underline">Get help</Link></div>
  </div>;
}
