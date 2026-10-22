import Image from "next/image";
import Link from "next/link";
import { SourceIcon } from "@/components/SourceIcon";
import styles from "./customer-landing.module.css";

const categories = [
  { name: "Electrical", detail: "Lights, power points & more", image: "/landing/electrical.webp" },
  { name: "Plumbing", detail: "Taps, leaks & pipework", image: "/landing/plumbing.webp" },
  { name: "Construction", detail: "Building, repairs & improvements", image: "/landing/construction.webp" },
  { name: "Gas fitting", detail: "Appliances, connections & more", image: null },
];

function Arrow() {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

function PostJob({ children = "Post a job", className = "" }: { children?: React.ReactNode; className?: string }) {
  return <Link href="/jobs/new" className={`${styles.primary} ${className}`}>{children}<Arrow /></Link>;
}

/** Public customer introduction. All posting continues through the existing job flow. */
export function CustomerLanding() {
  return <div className={styles.landing} data-mode="customer">
    <div className={styles.heroShell}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="Trade Marketplace home"><Image src="/brand/wordmark.svg" width={188} height={46} alt="Trade Marketplace" priority /></Link>
        <nav aria-label="Landing navigation" className={styles.nav}>
          <a href="#how-it-works" className={styles.howLink}>How it works</a>
          <Link href="/for-tradies" className={styles.tradeLink}>For tradies</Link>
          <Link href="/login" className={styles.login}>Log in<SourceIcon name="person" size={18} /></Link>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="landing-title">
        <Image src="/original/signup-bolt.svg" alt="" width={419} height={694} className={styles.bolt} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>YOUR HOME. YOUR TO-DO LIST.</p>
          <h1 id="landing-title">Sorted in<br /><span>a flash.</span></h1>
          <p className={styles.heroIntro}>From the little fixes to the bigger plans.<br className={styles.desktopBreak} /> Get your next job off the list.</p>
          <div className={styles.start}>
            <h2>What needs doing?</h2>
            <p>Tell us about your job to get started.</p>
            <PostJob />
            <p className={styles.previewNote}>Preview only · use sample details.</p>
          </div>
          <a href="#how-it-works" className={styles.explore}>A simpler way to get it sorted<span aria-hidden="true">↓</span></a>
        </div>
        <figure className={styles.heroPhoto}>
          <Image src="/landing/home-renovation.webp" alt="A tradesperson applying a finish to a wall during a home renovation" width={1200} height={1500} sizes="(min-width: 1200px) 580px, (min-width: 800px) 48vw, 100vw" priority className={styles.photo} />
          <figcaption><span className={styles.photoMark}><Image src="/brand/logo.svg" width={17} height={28} alt="" /></span><span>A little help.<br /><strong>A lot off your list.</strong></span></figcaption>
        </figure>
      </section>
    </div>

    <section className={`${styles.section} ${styles.categories}`} aria-labelledby="categories-title">
      <div className={styles.sectionHead}><div><p className={styles.kicker}>START WITH WHAT YOU NEED</p><h2 id="categories-title">Big plans. Small fixes.</h2></div><p>One place to start<br />across the trades.</p></div>
      <ul className={styles.categoryGrid}>
        {categories.map(category => <li key={category.name} className={styles.category}>
          <div className={styles.categoryArt}>
            {category.image ? <Image src={category.image} width={160} height={160} alt="" sizes="160px" /> : <svg width="76" height="96" viewBox="0 0 76 96" aria-hidden="true"><path d="M41 5c5 24-17 28-13 46 3-8 11-13 16-20 1 15 20 23 20 38A26 26 0 0 1 12 69C12 41 37 32 41 5Z" fill="currentColor" /><path d="M38 57c2 12-10 16-10 24a11 11 0 0 0 22 0c0-8-8-14-12-24Z" fill="var(--trade-paper)" /></svg>}
          </div>
          <h3>{category.name}</h3><p>{category.detail}</p>
        </li>)}
      </ul>
      <div className={styles.categoryFooter}><p>Not sure where your job fits? Start by telling us what needs doing.</p><Link href="/jobs/new">Start your job<Arrow /></Link></div>
    </section>

    <section id="how-it-works" className={styles.how} aria-labelledby="how-title">
      <div className={styles.section}>
        <div className={styles.sectionHead}><div><p className={styles.kicker}>LESS TO THINK ABOUT</p><h2 id="how-title">Your job. Three simple steps.</h2></div></div>
        <ol className={styles.steps}>
          <li><span className={styles.stepNumber}>01</span><h3>Tell us the job</h3><p>A few details and photos help explain what needs doing.</p></li>
          <li><span className={styles.stepNumber}>02</span><h3>Review your price</h3><p>See the scope and fixed price before you decide to go ahead.</p></li>
          <li><span className={styles.stepNumber}>03</span><h3>Keep it all together</h3><p>Follow your job, messages and next steps in one place.</p></li>
        </ol>
        <div className={styles.reassurance}><SourceIcon name="check" size={22} /><p><strong>You stay in the loop.</strong> Review and approve any priced extra work before it goes ahead.</p></div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.finalPrompt}`} aria-labelledby="final-title">
      <Image src="/brand/logo.svg" width={35} height={58} alt="" />
      <div><p className={styles.kicker}>ONE LESS THING ON YOUR LIST</p><h2 id="final-title">Let&apos;s get it sorted.</h2></div>
      <PostJob />
    </section>

    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}><Link href="/" className={styles.logo} aria-label="Trade Marketplace home"><Image src="/brand/wordmark.svg" width={188} height={46} alt="Trade Marketplace" /></Link><p>Got the skills?<br /><Link href="/for-tradies">Take a look at the tradie side<Arrow /></Link></p></div>
        <div className={styles.footerBottom}><p><strong>Preview only.</strong> Explore with sample details. Trade Marketplace is not taking live bookings or payments.</p><Link href="/support">Help & support</Link></div>
        <p className={styles.credit}>Illustrative stock photography by <a href="https://www.pexels.com/photo/a-man-renovating-a-home-5493656/">Antoni Shkraba / Pexels</a>.</p>
      </div>
    </footer>
  </div>;
}
