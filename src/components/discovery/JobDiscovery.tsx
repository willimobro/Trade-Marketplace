"use client";

import { formatDistanceKm } from "@/lib/distance";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORY_NAMES, REGIONS } from "@/lib/constants";
import { tradeRequirementsPending } from "@/lib/trade-readiness";
import styles from "@/app/jobs/jobs.module.css";

export type DiscoveryJob = { id: string; jobNumber: number; title: string; description: string; category: string; region: string; suburb: string; status: string; cover?: string; detail: string; payAmount?: string; hours?: number; distanceKm?: number };
function statusLabel(job: DiscoveryJob) {
  return tradeRequirementsPending(job.category) ? "Requirements pending" : job.status === "BOOKABLE" ? "Available to claim" : "Needs estimates";
}
export function JobDiscovery({ jobs, defaultRegion, storageScope, initialQuery = "", initialCategory = "" }: { jobs: DiscoveryJob[]; defaultRegion: string; storageScope: string; initialQuery?: string; initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [region, setRegion] = useState(defaultRegion);
  const [stage, setStage] = useState("all");
  const [view, setView] = useState("all");
  const [saved, setSaved] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [storageError, setStorageError] = useState(false);
  const [failedPhotos, setFailedPhotos] = useState<string[]>([]);
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
  const visible = jobs.filter((job) => (!category || job.category === category) && (!region || job.region === region) && (stage === "all" || job.status === stage) && (view === "all" || (view === "saved" ? saved : recent).includes(job.id)) && `${job.category} ${job.title} ${job.description} ${job.suburb} TM-${job.jobNumber}`.toLowerCase().includes(query.trim().toLowerCase()));
  if (view === "recent") visible.sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id));
  const filtered = !!category || !!query || !!region || stage !== "all";
  return <div className={styles.board}>
    <section className={styles.filters} aria-label="Find jobs">
      <div className={styles.searchRow}>
        <div><label htmlFor="job-search" className={styles.label}>Search jobs</label><input id="job-search" className={styles.control} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Title, suburb or job number" /></div>
      </div>
      <details className={styles.filterDisclosure}><summary>Filters{[category, region, stage !== "all"].filter(Boolean).length > 0 ? ` (${[category, region, stage !== "all"].filter(Boolean).length})` : ""}</summary><div className={styles.fields}>
        <div><label htmlFor="job-category" className={styles.label}>Trade</label><select id="job-category" className={styles.control} value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All trades</option>{CATEGORY_NAMES.map((name) => <option key={name}>{name}</option>)}</select></div>
        <div><label htmlFor="job-region" className={styles.label}>Region</label><select id="job-region" className={styles.control} value={region} onChange={(e) => setRegion(e.target.value)}><option value="">All of NZ</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></div>
        <div><label htmlFor="job-stage" className={styles.label}>Job stage</label><select id="job-stage" className={styles.control} value={stage} onChange={(e) => setStage(e.target.value)}><option value="all">All open jobs</option><option value="BOOKABLE">Paid, awaiting assignment</option><option value="REVIEW">Under review</option></select></div>
      </div></details>
      <div className={styles.collections} aria-label="Job collections">{[["all", "All jobs"], ["saved", "Saved"], ["recent", "Recently opened"]].map(([value, label]) => <button key={value} type="button" className={view === value ? styles.selected : styles.button} aria-pressed={view === value} onClick={() => setView(value)}>{label}</button>)}{filtered && <button className={styles.button} type="button" onClick={() => { setQuery(""); setCategory(""); setRegion(""); setStage("all"); }}>Clear filters</button>}</div>
      {view !== "all" && <p className={styles.help}>Saved and recent jobs stay on this browser. Saving does not reserve work; closed jobs are hidden.</p>}
      {storageError && <p role="status" className={styles.storageError}>Browser storage is unavailable. Your selections work for this visit but may not be kept.</p>}
      {view === "recent" && recent.length > 0 && <button className={styles.button} type="button" onClick={() => store(saved, [])}>Clear recent history</button>}
    </section>
    <p role="status" aria-live="polite" className={styles.count}>{visible.length} open job{visible.length === 1 ? "" : "s"} shown{view !== "all" ? ` in ${view === "saved" ? "saved jobs" : "recently opened jobs"}` : ""}.</p>
    <div className={styles.grid}>{visible.map((job) => <article key={job.id} className={styles.card}>
      <Link href={`/jobs/${job.id}`} onClick={() => store(saved, [job.id, ...recent.filter((id) => id !== job.id)].slice(0, 20))} className={styles.link} aria-label={`${job.title}. ${job.suburb}, ${job.region}. ${statusLabel(job)}. ${job.payAmount && !tradeRequirementsPending(job.category) ? `Gross pay ${job.payAmount} before PAYE` : "Pay pending"}. ${formatDistanceKm(job.distanceKm)}. See full job details.`}>
        <div className={styles.photo}>
          {!job.cover || failedPhotos.includes(job.cover) ? <span className={styles.photoFallback} role="img" aria-label={job.cover ? "Photo unavailable" : "No photo supplied"}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 3-3 6 6" /></svg>
          </span> : <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={job.cover} alt="" onError={() => setFailedPhotos(current => current.includes(job.cover!) ? current : [...current, job.cover!])} />
          </> }
        </div>
        <h2 className={styles.title} title={job.title}>{job.title}</h2>
        <div className={styles.paySlot}>
          <strong className={styles.pay}>{job.payAmount && !tradeRequirementsPending(job.category) ? job.payAmount : "Pay pending"}</strong>
          <span className={styles.distance}>{formatDistanceKm(job.distanceKm)}</span>
        </div>
      </Link>
      <button type="button" className={styles.saveButton} aria-pressed={saved.includes(job.id)} aria-label={`${saved.includes(job.id) ? "Unsave" : "Save"} ${job.title}`} title={saved.includes(job.id) ? "Unsave job" : "Save job"} onClick={() => store(saved.includes(job.id) ? saved.filter((id) => id !== job.id) : [...saved, job.id].slice(-100), recent)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill={saved.includes(job.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z" /></svg>
      </button>
    </article>)}</div>
    {!visible.length && <div className={styles.empty}><h2 >{view === "saved" ? "No saved open jobs match" : view === "recent" ? "No recently opened jobs match" : "No open jobs match"}</h2><p >{view === "all" ? "Try another trade, region or fewer search terms. New jobs appear as customers post or record payment." : "Return to all jobs to browse. Only open jobs appear here; estimating and claiming depend on configured trade requirements."}</p><button className={styles.selected} onClick={() => { setView("all"); setRegion(""); setStage("all"); setQuery(""); setCategory(""); }}>Show all open jobs</button></div>}
  </div>;
}
