"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const updates = [
  { id: "price", title: "Your fixed price is ready", detail: "Review the scope and price for your hallway lighting before you continue.", time: "10 minutes ago", label: "Review your jobs", href: "/dashboard" },
  { id: "message", title: "You have a new message", detail: "Your job conversation has an update. Keep the details together in one place.", time: "1 hour ago", label: "Open messages", href: "/messages" },
];
type Mode = "updates" | "loading" | "empty" | "error";
export function NotificationsPreview() {
  const [mode, setMode] = useState<Mode>("updates");
  const [read, setRead] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const heading = useRef<HTMLHeadingElement>(null);
  const recovering = useRef(false);
  useEffect(() => {
    if (mode !== "loading") return;
    const timer = setTimeout(() => { recovering.current = true; setMode("updates"); }, 600);
    return () => clearTimeout(timer);
  }, [mode]);
  useEffect(() => { if (recovering.current) { recovering.current = false; heading.current?.focus(); } }, [mode]);
  const unread = updates.filter(item => !read.includes(item.id));
  const visible = filter === "unread" ? unread : updates;
  return <div className="mx-auto max-w-[880px] px-4 py-10 sm:px-8">
    <p className="text-sm font-semibold text-muted">Your updates</p>
    <h1 ref={heading} tabIndex={-1} className="mt-3 text-3xl font-bold">Notifications</h1>
    <p className="mt-4 max-w-xl leading-7 text-muted">Job updates and conversations, all in one place.</p>
    <p className="mt-3 text-xs text-muted">Sample activity · read status stays in this preview.</p>
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-2" role="group" aria-label="Filter notifications">
        <button type="button" className={filter === "all" ? "btn-primary" : "btn-ghost"} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All updates</button>
        <button type="button" className={filter === "unread" ? "btn-primary" : "btn-ghost"} aria-pressed={filter === "unread"} onClick={() => setFilter("unread")}>Unread ({unread.length})</button>
      </div>
      <button type="button" className="btn-ghost" aria-disabled={!unread.length || mode !== "updates"} onClick={() => { if (unread.length && mode === "updates") setRead(updates.map(item => item.id)); }}>Mark all as read</button>
    </div>
    <div className="mt-6" aria-live="polite" aria-busy={mode === "loading"}>
      {mode === "loading" ? <section className="card p-8" role="status"><span className="block h-3 w-1/3 rounded bg-paper" /><p className="mt-6 text-muted">Loading your updates…</p></section>
      : mode === "error" ? <section className="card p-8" role="alert"><h2 className="text-xl font-semibold">We couldn’t load your updates</h2><p className="mt-3 leading-6 text-muted">Your job information is unchanged. Try again when you’re ready.</p><button type="button" className="btn-primary mt-6" onClick={() => setMode("loading")}>Try again</button></section>
      : mode === "empty" || !visible.length ? <section className="card p-8"><h2 className="text-xl font-semibold">You’re all caught up</h2><p className="mt-3 leading-6 text-muted">{filter === "unread" ? "No unread updates. You can still find everything under All updates." : "New job activity will appear here. In the meantime, check your workspace."}</p><Link href="/dashboard" className="btn-primary mt-6">Go to your jobs</Link></section>
      : <ul className="space-y-4">{visible.map(item => <li key={item.id} className="card p-6 sm:p-8"><div className="flex flex-wrap items-center gap-3 text-xs text-muted"><span className="font-semibold">{read.includes(item.id) ? "Read" : "Unread"}</span><span>{item.time}</span></div><h2 className="mt-3 text-xl font-semibold">{item.title}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted">{item.detail}</p><div className="mt-5 flex flex-wrap items-center gap-4"><Link className="btn-primary" href={item.href} onClick={() => setRead(current => [...new Set([...current, item.id])])}>{item.label}</Link><button type="button" className="btn-ghost" onClick={() => { setRead(current => current.includes(item.id) ? current.filter(id => id !== item.id) : [...current, item.id]); if (filter === "unread") heading.current?.focus(); }}>Mark as {read.includes(item.id) ? "unread" : "read"}</button></div></li>)}</ul>}
    </div>
    <details className="mt-8 border-t border-line pt-4 text-sm"><summary className="cursor-pointer py-3 font-semibold">Explore sample states</summary><label htmlFor="notification-state" className="label mt-4">Notification view</label><select id="notification-state" className="input" value={mode} onChange={event => setMode(event.target.value as Mode)}><option value="updates">Updates</option><option value="loading">Loading</option><option value="empty">Empty inbox</option><option value="error">Connection interrupted</option></select></details>
    <div className="mt-6 flex flex-wrap gap-6"><Link href="/profile" className="inline-flex min-h-12 items-center font-semibold underline">Back to account</Link><Link href="/support" className="inline-flex min-h-12 items-center font-semibold underline">Get help</Link></div>
  </div>;
}
