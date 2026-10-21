"use client";
import { formatDistanceKm } from "@/lib/distance";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { SourceIcon, type SourceIconName } from "@/components/SourceIcon";
import styles from "@/app/home.module.css";

function arrowScroll(event: KeyboardEvent<HTMLDivElement>) {
  if (event.target !== event.currentTarget || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const element = event.currentTarget;
  if (event.key === "Home" || event.key === "End") element.scrollTo({ left: event.key === "Home" ? 0 : element.scrollWidth });
  else element.scrollBy({ left: event.key === "ArrowRight" ? 171 : -171 });
}
function HomeJobCard({ job, onOpen }: { job: HomeJob; onOpen: (id: string) => void }) {
  const [failed, setFailed] = useState(false);
  return <Link href={`/jobs/${job.id}`} onClick={() => onOpen(job.id)} className={styles.jobCard} aria-label={`${job.title}. ${job.payAmount ? `Gross pay ${job.payAmount} before PAYE.` : "Pay pending."} ${formatDistanceKm(job.distanceKm)}. Open job details.`}>
    <div className={styles.photo}>{job.cover && !failed ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={job.cover} alt="" onError={() => setFailed(true)} />
    ) : <span className={styles.photoFallback} role="img" aria-label="Photo unavailable"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 3-3 6 6" /></svg></span>}</div>
    <div className={styles.cardInfo}><strong className={styles.cardTitle} title={job.title}>{job.title}</strong><span className={styles.pay}>{job.payAmount ?? "Pay pending"}</span><span className={styles.distance}>{formatDistanceKm(job.distanceKm)}</span></div>
  </Link>;
}
export type HomeJob = { id: string; title: string; cover: string | null; payAmount: string | null; distanceKm?: number };
export function HomeBrowse({ jobs, storageScope }: { jobs: HomeJob[]; storageScope: string }) {
  const [recent, setRecent] = useState<string[]>([]);
  const [searches, setSearches] = useState<string[]>([]);
  const [storageError, setStorageError] = useState(false);
  const key = `tm-discovery-${storageScope}`;
  const searchKey = `tm-searches-${storageScope}`;
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) ?? "{}");
      setRecent(Array.isArray(stored.recent) ? stored.recent.filter((x: unknown) => typeof x === "string").slice(0, 20) : []);
      const terms = JSON.parse(localStorage.getItem(searchKey) ?? "[]");
      setSearches(Array.isArray(terms) ? terms.filter((x: unknown) => typeof x === "string" && x.length <= 200).slice(0, 8) : []);
    } catch { setStorageError(true); }
  }, [key, searchKey]);
  function openJob(id: string) {
    const next = [id, ...recent.filter(item => item !== id)].slice(0, 20);
    setRecent(next);
    try {
      const stored = JSON.parse(localStorage.getItem(key) ?? "{}");
      localStorage.setItem(key, JSON.stringify({ saved: Array.isArray(stored.saved) ? stored.saved : [], recent: next }));
    } catch { setStorageError(true); }
  }
  function rememberSearch(event: FormEvent<HTMLFormElement>) {
    const term = String(new FormData(event.currentTarget).get("q") ?? "").trim().slice(0, 200);
    if (!term) return;
    try { localStorage.setItem(searchKey, JSON.stringify([term, ...searches.filter(item => item !== term)].slice(0, 8))); }
    catch { setStorageError(true); }
  }
  const recentJobs = recent.flatMap(id => { const job = jobs.find(item => item.id === id); return job ? [job] : []; });
  const suggested = jobs.slice(0, 6);
  function jobStrip(label: string) {
    return suggested.length ? <div className={styles.strip} tabIndex={0} role="region" aria-label={`${label}. Scroll horizontally; use left and right arrow keys.`} onKeyDown={arrowScroll}>
      {suggested.map(job => <div className={styles.column} key={job.id}><HomeJobCard job={job} onOpen={openJob} /></div>)}
    </div> : <p className={styles.empty}>No open jobs yet. New listings will appear here.</p>;
  }
  const searching = useSearchParams().get("view") === "search";
  const menu = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigation: [string, string, SourceIconName][] = [["/", "Home", "home"], ["/?view=search", "Browse", "magnifier"], ["/dashboard", "My jobs", "jobs"], ["/messages", "Messages", "bubble"], ["/profile", "Account", "person"]];
  return <div className={styles.wrapper}>
    <header className={`${styles.header} ${searching ? styles.searchHeader : ""}`}>
      <button ref={menuButton} type="button" className={styles.menuButton} aria-label="Open navigation menu" aria-haspopup="dialog" onClick={() => menu.current?.showModal()}><SourceIcon name="menu" size={26} /></button>
      <form className={styles.searchForm} action="/jobs" method="get" role="search" aria-label="Search jobs" onSubmit={rememberSearch}>
        <button type="submit" aria-label="Submit search"><SourceIcon name="magnifier" size={16} /></button>
        <input type="search" name="q" aria-label="Search currently available jobs" placeholder={searching ? "Search for any job" : "Search"} />
      </form>
      <Link href="/jobs/new" className={styles.post} aria-label="Post a job"><SourceIcon name="plus-square" size={26} /></Link>
      {!searching && <h1>Browse</h1>}
    </header>
    <div className={styles.content}>
      {searching ? <>
        <h1 className={styles.searchTitle}>Search jobs</h1>
        <section className={styles.searchGroup} aria-label="Recently searched">
          <div className={styles.heading}><h2>Recently Searched</h2></div>
          {searches.length ? <div className={styles.searchRail} tabIndex={0} role="region" aria-label="Recent searches. Scroll horizontally." onKeyDown={arrowScroll}>{searches.map(term => <Link key={term} href={`/jobs?q=${encodeURIComponent(term)}`}>{term}</Link>)}</div> : <p className={styles.empty}>Your searches from this page will appear here on this browser.</p>}
        </section>
        <section aria-label="Open jobs"><div className={styles.heading}><h2>Open Jobs</h2><Link href="/jobs">See all</Link></div>{jobStrip("Open jobs")}</section>
      </> : <>
        <div className={`${styles.strip} ${styles.categories}`} tabIndex={0} role="region" aria-label="Trade categories. Scroll horizontally; use left and right arrow keys." onKeyDown={arrowScroll}>
          <Link href="/jobs?category=Electrical" className={styles.category}><span className={`${styles.categoryTint} ${styles.electrical}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.multimeter} src="/original/browse-fb398d016e30d08fb00c4f5b0105a140173a8da9.png" alt="" /><span className={styles.categoryLabel}><strong>Electrical</strong><span>and related</span></span></Link>
          <Link href="/jobs?category=Construction" className={styles.category}><span className={`${styles.categoryTint} ${styles.construction}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.staple} src="/original/browse-c9bd4c4af0c22f24a0abc58a8ed672ea849ef9a8.png" alt="" /><span className={styles.categoryLabel}><strong>Construction</strong><span>and related</span></span></Link>
          <Link href="/jobs?category=Plumbing" className={styles.category}><span className={`${styles.categoryTint} ${styles.plumbing}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.pipe} src="/original/browse-2a782790be5cf1dfe155a220bd9c8853f067a73f.png" alt="" /><span className={styles.categoryLabel}><strong>Plumbing</strong><span>and related</span></span></Link>
          <Link href="/jobs?category=Gas%20Fitting" className={styles.category}><span className={`${styles.categoryTint} ${styles.gas}`} /><span className={styles.categoryLabel}><strong>Gas Fitting</strong><span>and related</span></span></Link>
        </div>
        <section aria-label="Suggested jobs"><div className={styles.heading}><h2>Suggested Jobs</h2><Link href="/jobs">See all</Link></div>{jobStrip("Suggested jobs")}</section>
        <section className={styles.recent} aria-label="Recently viewed jobs"><div className={styles.heading}><h2>Recently Viewed</h2></div>{recentJobs.length ? <div className={styles.verticalCards}>{recentJobs.map(job => <HomeJobCard key={job.id} job={job} onOpen={openJob} />)}</div> : <p className={styles.empty}>Open a job to start your history. Only currently open listings are shown here.</p>}</section>
      </>}
      {storageError && <p className={styles.empty} role="status">Browser history is unavailable. You can still browse and open jobs.</p>}
    </div>
    <nav className={styles.bottomNav} aria-label="Main navigation">{navigation.map(([href, label, icon]) => <Link key={href} href={href} aria-label={label} aria-current={(searching ? href === "/?view=search" : href === "/") ? "page" : undefined}><SourceIcon name={icon} size={26} navigation /><span className="sr-only">{label}</span></Link>)}</nav>
    <dialog ref={menu} className={styles.menu} aria-labelledby="home-menu-title" onClose={() => requestAnimationFrame(() => menuButton.current?.focus())}>
      <div className={styles.menuHeading}><h2 id="home-menu-title">Trade Marketplace</h2><button type="button" aria-label="Close menu" onClick={() => menu.current?.close()}><SourceIcon name="x" /></button></div>
      <nav aria-label="Menu">{[["/jobs", "Find work"], ["/jobs/new", "Post a job"], ["/for-tradies", "For tradies"], ["/login", "Log in"], ["/support", "Help"]].map(([href,label]) => <Link key={href} href={href} onClick={() => menu.current?.close()}>{label}</Link>)}</nav>
    </dialog>
  </div>;
}
