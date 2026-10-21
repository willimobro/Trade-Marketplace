"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { REGIONS } from "@/lib/constants";

export type DiscoveryJob = { id: string; jobNumber: number; title: string; description: string; region: string; suburb: string; status: string; cover?: string; detail: string };
export function JobDiscovery({ jobs, defaultRegion, storageScope }: { jobs: DiscoveryJob[]; defaultRegion: string; storageScope: string }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState(defaultRegion);
  const [stage, setStage] = useState("all");
  const [view, setView] = useState("all");
  const [saved, setSaved] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [storageError, setStorageError] = useState(false);
  const key = `tm-discovery-${storageScope}`;
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) ?? "{}");
      setSaved(Array.isArray(stored.saved) ? stored.saved.filter((x: unknown) => typeof x === "string").slice(0, 100) : []);
      setRecent(Array.isArray(stored.recent) ? stored.recent.filter((x: unknown) => typeof x === "string").slice(0, 20) : []);
    } catch { setStorageError(true); }
  }, [key]);
  function store(nextSaved: string[], nextRecent: string[]) {
    setSaved(nextSaved); setRecent(nextRecent);
    try { localStorage.setItem(key, JSON.stringify({ saved: nextSaved, recent: nextRecent })); }
    catch { setStorageError(true); }
  }
  const visible = jobs.filter((job) => (!region || job.region === region) && (stage === "all" || job.status === stage) && (view === "all" || (view === "saved" ? saved : recent).includes(job.id)) && `${job.title} ${job.description} ${job.suburb} TM-${job.jobNumber}`.toLowerCase().includes(query.trim().toLowerCase()));
  if (view === "recent") visible.sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id));
  const filtered = !!query || !!region || stage !== "all";
  return <>
    <section className="card mt-6 space-y-4 p-4 sm:p-6" aria-label="Find jobs">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <div><label htmlFor="job-search" className="label">Search jobs</label><input id="job-search" className="input" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Title, suburb or job number" /></div>
        <div><label htmlFor="job-region" className="label">Region</label><select id="job-region" className="input" value={region} onChange={(e) => setRegion(e.target.value)}><option value="">All of NZ</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></div>
        <div><label htmlFor="job-stage" className="label">Job stage</label><select id="job-stage" className="input" value={stage} onChange={(e) => setStage(e.target.value)}><option value="all">All open jobs</option><option value="BOOKABLE">Available to claim</option><option value="REVIEW">Needs estimates</option></select></div>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Job collections">{[["all", "All jobs"], ["saved", "Saved"], ["recent", "Recently opened"]].map(([value, label]) => <button key={value} type="button" className={view === value ? "btn-primary" : "btn-ghost"} aria-pressed={view === value} onClick={() => setView(value)}>{label}</button>)}{filtered && <button className="btn-ghost" type="button" onClick={() => { setQuery(""); setRegion(""); setStage("all"); }}>Clear filters</button>}</div>
      <p className="text-sm text-muted">Saved jobs and jobs opened from this board stay in this browser only. Saving does not reserve a job. Jobs that are no longer open are hidden.</p>
      {storageError && <p role="status" className="text-sm text-amber-900">Browser storage is unavailable. Your selections work for this visit but may not be kept.</p>}
      {view === "recent" && recent.length > 0 && <button className="btn-ghost" type="button" onClick={() => store(saved, [])}>Clear recent history</button>}
    </section>
    <p role="status" aria-live="polite" className="my-5 text-sm text-muted">{visible.length} open job{visible.length === 1 ? "" : "s"} shown{view !== "all" ? ` in ${view === "saved" ? "saved jobs" : "recently opened jobs"}` : ""}.</p>
    <div className="grid gap-4 xl:grid-cols-2">{visible.map((job) => <article key={job.id} className="card overflow-hidden">
      <Link href={`/jobs/${job.id}`} onClick={() => store(saved, [job.id, ...recent.filter((id) => id !== job.id)].slice(0, 20))} className="block p-5 hover:bg-paper/60">
        {job.cover && <div className="mb-4 overflow-hidden rounded-xl bg-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={job.cover} alt="" className="h-36 w-full object-cover" />
        </div>}
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-muted">TM-{job.jobNumber}</span><span className={`chip ${job.status === "BOOKABLE" ? "bg-lime text-forest" : "bg-amber-100 text-amber-900"}`}>{job.status === "BOOKABLE" ? "Available to claim" : "Needs estimates"}</span></div>
        <h2 className="mt-3 break-words text-lg font-semibold">{job.title}</h2><p className="mt-2 line-clamp-2 text-sm text-muted">{job.description}</p><p className="mt-4 text-sm">{job.suburb}, {job.region}</p><p className="mt-2 font-medium text-leaf-dark">{job.detail}</p><span className="mt-4 inline-block text-sm font-semibold underline">View job</span>
      </Link>
      <div className="border-t border-border px-5 py-2"><button type="button" className="btn-ghost" aria-pressed={saved.includes(job.id)} aria-label={`${saved.includes(job.id) ? "Unsave" : "Save"} ${job.title}`} onClick={() => store(saved.includes(job.id) ? saved.filter((id) => id !== job.id) : [...saved, job.id].slice(-100), recent)}>{saved.includes(job.id) ? "Saved on this browser ✓" : "Save job"}</button></div>
    </article>)}</div>
    {!visible.length && <div className="card p-8 text-center"><h2 className="text-lg font-semibold">{view === "saved" ? "No saved open jobs match" : view === "recent" ? "No recently opened jobs match" : "No open jobs match"}</h2><p className="mt-2 text-muted">{view === "all" ? "Try another region or fewer search terms. New jobs appear as customers post or record payment." : "Return to all jobs to browse. Only jobs still available for estimates or claiming appear here."}</p><button className="btn-primary mt-4" onClick={() => { setView("all"); setRegion(""); setStage("all"); setQuery(""); }}>Show all open jobs</button></div>}
  </>;
}
