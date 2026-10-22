"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { readJobDraft } from "@/app/jobs/new/job-draft";
import { homeCustomerDraft, homeJobDraft } from "@/lib/home-request";
import { customerPreviewKey, mergeCustomerDraft, readCustomerPreview } from "@/lib/workspace-mode/customer-model";
import { useWorkspaceLinks, useWorkspaceMode } from "@/components/workspace-mode/WorkspaceMode";
import styles from "./customer-home.module.css";

const chips = [
  { title: "Power points", category: "Electrical" }, { title: "Leaking taps", category: "Plumbing" },
  { title: "Building repairs", category: "Construction" }, { title: "Gas fitting", category: "Gas Fitting" },
  { title: "Fault finding", category: "Electrical" },
];

export function CustomerHome({ userId, role, region }: { userId: string; role: string; region: string }) {
  const workspace = useWorkspaceMode();
  const destinations = useWorkspaceLinks(role);
  const localCustomer = workspace.enabled && role === "TRADIE";
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const question = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    try {
      const draft = localCustomer ? readCustomerPreview(localStorage.getItem(customerPreviewKey(userId)), userId).draft : readJobDraft(userId)?.fields;
      if (draft) { setTitle(draft.title); setLocation(draft.suburb); setCategory("trade" in draft ? draft.trade : draft.category); }
    } catch { setError("Your saved draft could not be opened. Retry before starting another job."); }
  }, [localCustomer, userId]);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  function startRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const request = { title, location, category };
      if (localCustomer) {
        const key = customerPreviewKey(userId);
        const raw = localStorage.getItem(key);
        const current = readCustomerPreview(raw, userId);
        localStorage.setItem(key, JSON.stringify(mergeCustomerDraft(raw, userId, homeCustomerDraft(current.draft, request))));
      } else {
        const draft = homeJobDraft(readJobDraft(userId), request, region);
        sessionStorage.setItem(`trade-marketplace:job-draft:v1:${userId}`, JSON.stringify(draft));
      }
      window.location.assign(destinations.post);
    } catch { setError("We couldn’t carry your details across. Your text is still here. Check browser storage and try Get a price again."); }
  }

  return <div className={styles.home} data-mode="customer">
    <section className={styles.hero} aria-labelledby="customer-home-title">
      <div className={styles.heroInner}>
        <Image src="/original/signup-bolt.svg" width={419} height={694} alt="" aria-hidden="true" className={styles.bolt} />
        <div className={styles.copy}>
          <h1 id="customer-home-title">Sorted in a flash.</h1>
          <p className={styles.intro}>Post your job free. Review one fixed price. Get it sorted.</p>
          <form className={styles.request} onSubmit={startRequest} aria-label="Start your job">
            <label className={styles.question}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></svg><span className="sr-only">What needs doing?</span><input ref={question} name="title" value={title} onChange={event => setTitle(event.target.value)} placeholder="What needs doing?" minLength={5} maxLength={80} required autoComplete="off" /></label>
            <label className={styles.location}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></svg><span className="sr-only">Suburb or city</span><input name="location" value={location} onChange={event => setLocation(event.target.value)} placeholder="Suburb or city" maxLength={60} autoComplete="address-level2" /></label>
            <button className={`${styles.price} trade-motion-action`} type="submit">Get a price</button>
          </form>
          {error && <p ref={errorRef} tabIndex={-1} className={styles.error} role="alert">{error}</p>}
          <div className={styles.chips} role="group" aria-label="Common jobs">{chips.map(chip => <button key={chip.title} type="button" aria-pressed={category === chip.category && title === chip.title} className="trade-motion-action" onClick={() => { setTitle(chip.title); setCategory(chip.category); question.current?.focus(); }}>{chip.title}</button>)}</div>
          <p className={styles.trust}><span aria-hidden="true">✓</span> Free to post · Review before you accept · Your choice</p>
        </div>
        <Image className={styles.van} src="/brand/green-van.png" width={4000} height={2800} alt="" aria-hidden="true" sizes="(min-width: 1024px) 390px, 270px" priority />
      </div>
    </section>
    <section className={styles.stepsSection} id="how-it-works" aria-label="How it works">
      <ol className={styles.steps}>
        <li><span className={styles.number}>1</span><div><h2>Post it</h2><p>What needs doing? Add photos. Free.</p></div></li>
        <li><span className={styles.number}>2</span><div><h2>Get your price</h2><p>One fixed price. Review it before you accept.</p></div></li>
        <li><span className={styles.number}>3</span><div><h2>Sorted</h2><p>Follow the work and messages in one place.</p></div></li>
      </ol>
      <div className={styles.tradeDoor}><a className="trade-motion-action" href={workspace.enabled ? "/dashboard?quoteView=feed" : "/for-tradies"} onClick={() => { if (workspace.enabled) workspace.setMode("trade"); }}><Image src="/brand/logo.svg" width={18} height={30} alt="" />Tradie? Pick up paid jobs <span aria-hidden="true">→</span></a><p>You do the work. We do the paperwork.</p></div>
    </section>
  </div>;
}
