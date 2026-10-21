"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, type KeyboardEvent } from "react";
import { SourceIcon, type SourceIconName } from "@/components/SourceIcon";
import styles from "./home.module.css";

// Original browse frames31:15/31:95:159×162 cards,11px radius,12px gaps.
// The source example photography is retained; these are not live job listings.
const examples = [
  { title: "Sink install", category: "Plumbing", image: "bed6b845151af858f85abfcb49c75ac4568e59a7.png" },
  { title: "Furniture relocation", category: "Labour", image: "07073effd959dfe2bad64f56c4e79fee8a892e33.jpg" },
  { title: "Socket installation", category: "Electrical", image: "d1e83ceab15c246a3935332130a53eb24a546adc.jpg" },
];
function arrowScroll(event: KeyboardEvent<HTMLDivElement>) {
  if (event.target !== event.currentTarget || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const element = event.currentTarget;
  if (event.key === "Home" || event.key === "End") element.scrollTo({ left: event.key === "Home" ? 0 : element.scrollWidth });
  else element.scrollBy({ left: event.key === "ArrowRight" ? 171 : -171 });
}
function ExampleCard({ index, money = false }: { index: number; money?: boolean }) {
  const example = examples[index % examples.length];
  return <Link href="/jobs" className={styles.jobCard} aria-label={`${example.title}, design example. Browse currently available jobs.`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`/original/browse-${money ? "9a4c6fb946a4a0e617181226bbb34099c8b040c9.png" : example.image}`} alt="" />
    <span className={styles.example}>Example</span>
    <span className={styles.caption}><span>{example.category}</span><strong>{example.title}</strong></span>
  </Link>;
}
function JobStrip({ label, twoRows = false }: { label: string; twoRows?: boolean }) {
  return <div className={`${styles.strip} ${twoRows ? styles.twoRows : ""}`} tabIndex={0} role="region" aria-label={`${label}. Scroll horizontally; use left and right arrow keys.`} onKeyDown={arrowScroll}>
    {examples.map((example, index) => <div key={example.title} className={styles.column}><ExampleCard index={index} />{twoRows && <ExampleCard index={index} money={index === 1} />}</div>)}
  </div>;
}
function HomeContent() {
  const searching = useSearchParams().get("view") === "search";
  const menu = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigation: [string, string, SourceIconName][] = [["/", "Home", "home"], ["/?view=search", "Browse", "magnifier"], ["/dashboard", "My jobs", "jobs"], ["/messages", "Messages", "bubble"], ["/profile", "Account", "person"]];
  return <div className={styles.wrapper}>
    <header className={`${styles.header} ${searching ? styles.searchHeader : ""}`}>
      <button ref={menuButton} type="button" className={styles.menuButton} aria-label="Open navigation menu" aria-haspopup="dialog" onClick={() => menu.current?.showModal()}><SourceIcon name="menu" size={26} /></button>
      <form className={styles.searchForm} action="/jobs" method="get" role="search" aria-label="Search jobs">
        <button type="submit" aria-label="Submit search"><SourceIcon name="magnifier" size={16} /></button>
        <input type="search" name="q" aria-label="Search currently available jobs" placeholder={searching ? "Search for any job" : "Search"} />
      </form>
      <Link href="/jobs/new" className={styles.post} aria-label="Post a job"><SourceIcon name="plus-square" size={26} /></Link>
      {!searching && <h1>Browse</h1>}
    </header>
    <div className={styles.content}>
      {searching ? <>
        <h1 className={styles.searchTitle}>Recently Searched</h1>
        <p className={styles.searchContext}>Example searches · More trades coming; electrical jobs available now.</p>
        {["Plug socket install", "Labour jobs"].map((term) => <section key={term} className={styles.searchGroup} aria-label={`Example search: ${term}`}><div className={styles.queryHeading}><span>“{term}”</span><Link href={term === "Labour jobs" ? "/jobs" : "/jobs?q=socket"}>Search again</Link></div><JobStrip label={`Example results for ${term}`} /></section>)}
        <section className={styles.searchGroup}><div className={styles.heading}><h2>Electrical</h2><Link href="/jobs">See all</Link></div><JobStrip label="Electrical examples" /></section>
      </> : <>
        <div className={`${styles.strip} ${styles.categories}`} tabIndex={0} role="region" aria-label="Trade categories. Scroll horizontally; use left and right arrow keys." onKeyDown={arrowScroll}>
          <Link href="/jobs" className={styles.category}><span className={`${styles.categoryTint} ${styles.electrical}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.multimeter} src="/original/browse-fb398d016e30d08fb00c4f5b0105a140173a8da9.png" alt="" /><span className={styles.categoryLabel}><strong>Electrical</strong><span>and related</span></span></Link>
          <div className={styles.category} aria-label="Construction, not currently available"><span className={`${styles.categoryTint} ${styles.construction}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.staple} src="/original/browse-c9bd4c4af0c22f24a0abc58a8ed672ea849ef9a8.png" alt="" /><span className={styles.categoryLabel}><strong>Construction</strong><span>Coming later</span></span></div>
          <div className={styles.category} aria-label="Plumbing, not currently available"><span className={`${styles.categoryTint} ${styles.plumbing}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.pipe} src="/original/browse-2a782790be5cf1dfe155a220bd9c8853f067a73f.png" alt="" /><span className={styles.categoryLabel}><strong>Plumbing</strong><span>Coming later</span></span></div>
        </div>
        <section aria-label="Suggested jobs"><div className={styles.heading}><h2>Suggested Jobs</h2><Link href="/jobs">See all</Link></div><JobStrip label="Suggested job examples" twoRows /></section>
        <section className={styles.recent} aria-label="Recently viewed examples"><div className={styles.heading}><h2>Recently Viewed</h2><Link href="/jobs">See all</Link></div><div className={styles.verticalCards}>{[0,1,2,0,1,2].map((index, order) => <ExampleCard key={order} index={index} />)}</div></section>
      </>}
    </div>
    <nav className={styles.bottomNav} aria-label="Main navigation">{navigation.map(([href, label, icon]) => <Link key={href} href={href} aria-label={label} aria-current={(searching ? href === "/?view=search" : href === "/") ? "page" : undefined}><SourceIcon name={icon} size={26} navigation /><span className="sr-only">{label}</span></Link>)}</nav>
    <dialog ref={menu} className={styles.menu} aria-labelledby="home-menu-title" onClose={() => requestAnimationFrame(() => menuButton.current?.focus())}>
      <div className={styles.menuHeading}><h2 id="home-menu-title">Trade Marketplace</h2><button type="button" aria-label="Close menu" onClick={() => menu.current?.close()}><SourceIcon name="x" /></button></div>
      <nav aria-label="Menu">{[["/jobs", "Find work"], ["/jobs/new", "Post a job"], ["/for-tradies", "For electricians"], ["/login", "Log in"], ["/support", "Help"]].map(([href,label]) => <Link key={href} href={href} onClick={() => menu.current?.close()}>{label}</Link>)}</nav>
    </dialog>
  </div>;
}
export default function Home() { return <Suspense fallback={<p>Loading browse…</p>}><HomeContent /></Suspense>; }
