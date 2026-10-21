"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { formatNZD, REGIONS } from "@/lib/constants";
import { priceWork } from "@/lib/pricing";
import { makeJourney, ROLES, SAMPLE_RATES, SAMPLES, STAGES, TRADES, type Journey, type Role, type Trade } from "./journey-data";
import styles from "./journey.module.css";

type Errors = Record<string, string>;
const PHOTO_NAMES: Record<string, string> = { overview: "Scope overview", detail: "A closer look", finished: "Finished work" };
const FIELDS_WITH_HINTS = new Set(["description", "hours", "materials", "price-hours", "price-materials", "variation-hours", "variation-materials"]);
function previewNumber(value: string) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}
function reopenFrom(previous: Journey, reached: number, role: Role): Journey {
  return {
    ...previous, reached, stage: reached, role, paymentAccepted: false,
    claimReview: false, claimAccepted: false, completionSent: false, completionReviewed: false,
    variation: { ...previous.variation, status: "none" },
  };
}

function TradeMark({ trade, size = 28 }: { trade: Trade; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {trade === "Electrical" ? <path d="M19 3 7 18h8l-2 11 12-16h-8l2-10Z" /> : trade === "Plumbing" ? <><path d="M5 5h10v10h12v10H13a8 8 0 0 1-8-8V5Z" /><path d="M3 5h14M27 13v14M7 12h6M20 17v6" /></> : trade === "Gas Fitting" ? <><path d="M17 3c1 8-7 9-7 15a7 7 0 0 0 14 0c0-4-2-6-3-8-1 3-2 4-3 5 0-6-1-9-1-12Z" /><path d="M15 21c-2 3 0 6 3 6" /></> : <><path d="m5 24 12-12M13 6l5-3 10 10-3 5-5-5-5 5-5-5 5-5-2-2ZM3 26l3 3 4-4-3-3-4 4Z" /></>}
  </svg>;
}

function SamplePhoto({ trade, detail = false, finished = false }: { trade: Trade; detail?: boolean; finished?: boolean }) {
  const line = finished ? "#326c20" : "#52645b";
  return <svg viewBox="0 0 320 200" role="img" aria-label={`${trade}: ${finished ? "finished work" : detail ? "detail" : "scope overview"}, sample illustration`}>
    <rect width="320" height="200" fill={finished ? "#e7f0dd" : "#e9e7df"} />
    <path d="M0 155h320M35 0v155M285 0v155" stroke="#cbd0c6" strokeWidth="2" />
    {trade === "Electrical" ? <><path d={detail ? "M80 0v70h160v86" : "M75 0v77h90V30h80v125"} fill="none" stroke="#c29969" strokeWidth="6" /><rect x={detail ? "65" : "48"} y="80" width="76" height="52" rx="4" fill="white" stroke={line} strokeWidth="3" /><rect x="204" y="105" width="56" height="40" rx="3" fill="white" stroke={line} strokeWidth="3" /><path d="m88 98 7 9m18-9-7 9m-8 8v7m123-5 5 7m17-7-5 7" stroke={line} strokeWidth="4" /></> : trade === "Construction" ? <><path d="M65 40v125M250 40v125" stroke="#7d644b" strokeWidth="13" />{[86, 114, 142, 170, 198, 226].map(x => <rect key={x} x={x} y="49" width="22" height="106" fill={finished ? "#cfa471" : "#b9a48c"} stroke="#846c53" strokeWidth="2" />)}<path d="M77 72h162M77 135h162m-147 0 130-63" stroke="#846c53" strokeWidth="7" /><path d="M223 95h35v9h-35Z" fill={line} /></> : trade === "Gas Fitting" ? <><rect x="45" y="56" width="230" height="99" rx="6" fill="#c7cdc6" stroke={line} strokeWidth="3" />{[100, 220].map(x => <g key={x}><circle cx={x} cy="103" r="29" fill="#f4f4ec" stroke={line} strokeWidth="5" /><path d={`M${x-23} 80l46 46m-46 0 46-46`} stroke={line} strokeWidth="5" /></g>)}<circle cx="143" cy="140" r="5" fill={line} /><circle cx="178" cy="140" r="5" fill={line} /></> : <><rect x="45" y="122" width="230" height="13" rx="3" fill="#aeb7af" /><path d="M107 121V65c0-29 67-29 67 0v20" fill="none" stroke={finished ? "#809488" : "#9faaa0"} strokeWidth="13" /><path d="M174 84v13m-51 11h30" stroke={line} strokeWidth="7" strokeLinecap="round" /><path d="M105 139v41h64v-41" fill="none" stroke={line} strokeWidth="7" /></>}
    <rect x="10" y="171" width="146" height="21" rx="3" fill="white" fillOpacity=".9" /><text x="18" y="186" fontSize="11" fontFamily="sans-serif" fill="#0c251d">SAMPLE ILLUSTRATION</text>
    {finished && <><circle cx="285" cy="27" r="15" fill="#326c20" /><path d="m278 27 5 5 9-10" fill="none" stroke="white" strokeWidth="3" /></>}
  </svg>;
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return <div className={styles.field}><label htmlFor={`journey-${id}`}>{label}</label>{children}{hint && <p id={`journey-${id}-hint`} className={styles.hint}>{hint}</p>}{error && <p id={`journey-${id}-error`} className={styles.error}>{error}</p>}</div>;
}

export function JourneySimulator() {
  const [trade, setTrade] = useState<Trade>("Electrical");
  const [journeys, setJourneys] = useState<Record<Trade, Journey>>(() => Object.fromEntries(TRADES.map(item => [item, makeJourney(item)])) as Record<Trade, Journey>);
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [pending, setPending] = useState("");
  const [failNext, setFailNext] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const photoTrigger = useRef<HTMLButtonElement | null>(null);
  const completionHeading = useRef<HTMLHeadingElement>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const job = journeys[trade];
  const sample = SAMPLES[trade];
  const committedPrice = priceWork(previewNumber(job.pricedHours), Math.round(previewNumber(job.pricedMaterials) * 100), SAMPLE_RATES);
  const price = job.stage === 2 ? priceWork(previewNumber(job.priceHours), Math.round(previewNumber(job.priceMaterials) * 100), SAMPLE_RATES) : committedPrice;
  const extra = priceWork(previewNumber(job.variation.hours), Math.round(previewNumber(job.variation.materials) * 100), SAMPLE_RATES, { applyMinimum: false });
  const extraApproved = job.variation.status === "approved";
  const total = committedPrice.totalCents + (extraApproved ? extra.totalCents : 0);
  const expectedRole: Role = job.stage === 6 && job.completionSent ? "Customer" : STAGES[job.stage].role;
  const roleMatches = job.role === expectedRole || (job.stage === 6 && job.completionSent && job.role === "Admin");
  const progress = job.reached === 8 ? "Reviewed" : job.reached >= 7 ? "Complete" : job.completionSent ? "Awaiting sign-off" : job.reached >= 5 ? "Tradie assigned" : job.reached >= 4 ? "Available to claim" : job.reached >= 3 ? "Fixed price ready" : job.reached >= 1 ? "Under review" : "Draft job";

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const previousStep = useRef({ stage: job.stage, trade, completionSent: job.completionSent, reached: job.reached });
  useEffect(() => {
    const previous = previousStep.current;
    if (previous.stage !== job.stage || previous.trade !== trade) heading.current?.focus();
    else if (previous.completionSent !== job.completionSent) {
      (job.completionSent ? completionHeading.current : heading.current)?.focus();
    } else if (previous.reached !== job.reached) {
      (job.stage === 7 && job.reached === 8 ? reviewHeading.current : heading.current)?.focus();
    }
    previousStep.current = { stage: job.stage, trade, completionSent: job.completionSent, reached: job.reached };
  }, [job.stage, trade, job.completionSent, job.reached]);
  useEffect(() => {
    if (photo) {
      if (dialog.current && !dialog.current.open) dialog.current.showModal();
    } else if (photoTrigger.current) {
      const trigger = photoTrigger.current;
      photoTrigger.current = null;
      if (trigger.isConnected) trigger.focus();
      else heading.current?.focus();
    }
  }, [photo]);
  function closePhoto() {
    dialog.current?.close();
    setPhoto(null);
  }

  function update(change: Partial<Journey> | ((previous: Journey) => Journey)) {
    setJourneys(previous => ({ ...previous, [trade]: typeof change === "function" ? change(previous[trade]) : { ...previous[trade], ...change } }));
  }
  function navigate(stage: number) {
    update({ stage }); setErrors({}); setActionError(""); setNotice(""); setResetOpen(false);
  }
  function changeRole(role: Role) { update({ role }); setErrors({}); setActionError(""); setNotice(`Viewing as ${role.toLowerCase()}.`); }
  function validate(next: Errors) {
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) { document.getElementById(`journey-${first}`)?.focus(); return false; }
    return true;
  }
  function run(label: string, change: (previous: Journey) => Journey, success: string) {
    if (inFlight.current) return;
    inFlight.current = true; setPending(label); setActionError(""); setNotice("");
    timer.current = setTimeout(() => {
      inFlight.current = false; setPending("");
      if (failNext) {
        setFailNext(false); setActionError("This sample action failed. Your entries are kept. Try the action again below.");
        return;
      }
      update(change); setNotice(success);
    }, 550);
  }
  function attributes(id: string) {
    return { id: `journey-${id}`, "aria-invalid": !!errors[id], "aria-describedby": [errors[id] ? `journey-${id}-error` : "", FIELDS_WITH_HINTS.has(id) ? `journey-${id}-hint` : ""].filter(Boolean).join(" ") || undefined };
  }
  function numbers(hours: string, materials: string, prefix = "") {
    const next: Errors = {};
    if (!hours.trim() || !Number.isFinite(Number(hours)) || Number(hours) < .25 || Number(hours) > 200 || Number(hours) * 4 % 1 !== 0) next[`${prefix}hours`] = "Enter 0.25–200 hours in quarter-hour steps.";
    if (!materials.trim() || !Number.isFinite(Number(materials)) || Number(materials) < 0 || Number(materials) > 50000) next[`${prefix}materials`] = "Enter a materials cost from $0 to $50,000.";
    return next;
  }
  function action(label: string, secondary = false) {
    return <button className={secondary ? styles.secondary : styles.primary} type="submit" disabled={!!pending}>{pending || (actionError ? `Try again · ${label}` : label)}<span aria-hidden="true">{pending ? "…" : "→"}</span></button>;
  }
  function handoff() {
    return <div className={styles.handoff}><span className={styles.avatar}>{expectedRole === "Customer" ? "CM" : expectedRole === "Admin" ? "TM" : sample.initials}</span><div><strong>{expectedRole}&apos;s next step</strong><p>{job.stage === 6 && job.completionSent ? "Review the finished work and sample evidence." : `Continue as ${expectedRole.toLowerCase()} to ${["describe the job", "send a private estimate", "review and set the fixed price", "record a test payment", "review and claim the job", "manage work and updates", "submit completion evidence", "leave a review"][job.stage]}.`}</p><button type="button" className={styles.textButton} onClick={() => changeRole(expectedRole)}>View as {expectedRole.toLowerCase()} <span aria-hidden="true">→</span></button></div></div>;
  }
  function photoGallery(ids: string[] = job.photos) {
    return <div className={styles.photos}>{ids.map(id => <button type="button" className={styles.photo} key={id} onClick={event => { photoTrigger.current = event.currentTarget; setPhoto(id); }}><SamplePhoto trade={trade} detail={id === "detail"} finished={id === "finished"} /><span>{PHOTO_NAMES[id]} <span aria-hidden="true">↗</span></span></button>)}</div>;
  }
  function scopeSummary() {
    return <div className={styles.scopeSummary}><p>{job.description}</p><dl className={styles.details}><div><dt>Location</dt><dd>{job.suburb}, {job.region}</dd></div><div><dt>Preferred timing</dt><dd>{job.timing}</dd></div></dl>{photoGallery()}</div>;
  }
  function priceSummary() {
    return <div className={styles.pricePanel}><p className={styles.kicker}>Your fixed price · NZD</p><p className={styles.bigPrice}>{formatNZD(price.totalCents)}</p><p className={styles.hint}>Includes GST · sample price</p><dl className={styles.priceLines}><div><dt>Work and materials, ex GST</dt><dd>{formatNZD(price.exGstCents)}</dd></div><div><dt>GST (15%)</dt><dd>{formatNZD(price.gstCents)}</dd></div><div><dt>Total</dt><dd>{formatNZD(price.totalCents)}</dd></div></dl><p className={styles.hint}>{job.scopeNote}</p></div>;
  }
  function numberFields(hours: string, materials: string, set: (key: "hours" | "materials", value: string) => void, prefix = "") {
    return <div className={styles.fieldPair}><Field id={`${prefix}hours`} label="Hours on site" error={errors[`${prefix}hours`]} hint="Quarter-hour steps."><input {...attributes(`${prefix}hours`)} type="number" min="0.25" max="200" step="0.25" inputMode="decimal" value={hours} onChange={event => set("hours", event.target.value)} /></Field><Field id={`${prefix}materials`} label="Materials at cost ($)" error={errors[`${prefix}materials`]} hint="NZD, excluding GST."><input {...attributes(`${prefix}materials`)} type="number" min="0" max="50000" step="0.01" inputMode="decimal" value={materials} onChange={event => set("materials", event.target.value)} /></Field></div>;
  }
  const form = (onSubmit: (event: FormEvent<HTMLFormElement>) => void, children: ReactNode) => <form noValidate onSubmit={event => { event.preventDefault(); if (!pending) onSubmit(event); }} aria-busy={!!pending}><fieldset disabled={!!pending} className={styles.formFields}>{children}</fieldset></form>;

  return <section className={styles.simulator} aria-label="Sample job journey">
    <div className={styles.previewBar}><Link href="/preview">← Preview home</Link><span><span className={styles.liveDot} />Sample journey</span></div>
    <header className={styles.intro}><p className={styles.kicker}>From a small job to a job well done</p><h1>See how it all comes together.</h1><p>Follow a job through every handoff. Choose a trade, then try the customer, tradie and admin views.</p><p className={styles.sampleNote}>Sample data only. No money moves or messages leave this page. Changes reset on refresh.</p></header>

    <div className={styles.tradePicker} aria-label="Choose sample trade">{TRADES.map(item => <button key={item} type="button" aria-pressed={trade === item} disabled={!!pending} onClick={() => { setTrade(item); setErrors({}); setActionError(""); setNotice(""); setResetOpen(false); }}><TradeMark trade={item} /><span>{item}</span>{trade === item && <span className={styles.selectedMark} aria-hidden="true">✓</span>}</button>)}</div>

    <div className={styles.contextBar}><div><span className={styles.kicker}>Viewing as</span><div className={styles.rolePicker} aria-label="Sample role">{ROLES.map(role => <button key={role} type="button" disabled={!!pending} aria-pressed={job.role === role} onClick={() => changeRole(role)}>{role}</button>)}</div></div><div className={styles.demoOptions}><details><summary>Preview options</summary><div><label className={styles.check}><input type="checkbox" checked={failNext} disabled={!!pending} onChange={event => setFailNext(event.target.checked)} /><span>Make the next save fail once<br /><small>Try an error and retry with your entries kept.</small></span></label><button className={styles.textButton} type="button" disabled={!!pending} onClick={() => setResetOpen(true)}>Restart {trade.toLowerCase()} sample</button></div></details></div></div>
    {resetOpen && <div className={styles.resetPanel} role="region" aria-label="Confirm sample restart"><p>Restart this {trade.toLowerCase()} journey? Its edits and sample messages will be cleared.</p><div className={styles.buttonRow}><button type="button" className={styles.secondary} onClick={() => { update(makeJourney(trade)); setResetOpen(false); setErrors({}); setActionError(""); setNotice("Sample restarted."); }}>Restart sample</button><button type="button" className={styles.textButton} onClick={() => setResetOpen(false)}>Keep exploring</button></div></div>}

    <nav className={styles.stageNav} aria-label="Journey stages"><ol>{STAGES.map((stage, index) => <li key={stage.short}><button type="button" aria-current={job.stage === index ? "step" : undefined} disabled={index > job.reached || !!pending} onClick={() => navigate(index)} title={index > job.reached ? "Complete the earlier steps to continue" : stage.label}><span className={styles.stageNumber}>{job.reached > index ? "✓" : index + 1}</span><span>{stage.short}</span></button></li>)}</ol></nav>
    <div className={styles.statusRegion} aria-live="polite" aria-atomic="true">{pending && <p className={styles.notice}>{pending}…</p>}{notice && <p className={styles.notice}>{notice}</p>}</div>
    {actionError && <p role="alert" className={styles.errorPanel}>{actionError}</p>}

    <div className={styles.layout}>
      <article className={styles.mainPanel}>
        <div className={styles.panelHeading}><p className={styles.kicker}>Step {job.stage + 1} of {STAGES.length} <span>· {job.stage === 5 ? "Shared workspace" : expectedRole}</span></p><h2 ref={heading} tabIndex={-1}>{STAGES[job.stage].label}</h2></div>

        {job.stage === 0 && <>
          <p className={styles.lead}>A little detail helps us get your job priced right.</p>
          {!roleMatches ? <>{scopeSummary()}{handoff()}</> : job.scopeReviewed ? <div className={styles.formFields}><div className={styles.reviewHeader}><span className={styles.roundCheck}>✓</span><div><h3>Ready to share your job?</h3><p>Check the scope before we collect private estimates.</p></div></div><h3>{job.title}</h3>{scopeSummary()}<div className={styles.callout}><strong>Sample address</strong><p>{job.address}, {job.suburb}. In this preview, contact and address details are fictional.</p></div>{job.reached > 1 && <p className={styles.hint}>Publishing changes restarts this sample job from the estimate step. Existing field entries remain available.</p>}<div className={styles.buttonRow}><button type="button" className={styles.secondary} disabled={!!pending} onClick={() => update({ scopeReviewed: false })}>Edit details</button><button type="button" className={styles.primary} disabled={!!pending} onClick={() => run("Posting sample job", previous => reopenFrom(previous, 1, "Tradie"), "Job posted. Next, try the tradie’s private estimate.")}>{pending || "Post sample job"}<span aria-hidden="true">→</span></button></div></div> : form(() => {
            const next: Errors = {};
            if (job.title.trim().length < 5) next.title = "Add a title of at least 5 characters.";
            if (job.description.trim().length < 20) next.description = "Describe the work in at least 20 characters.";
            if (job.suburb.trim().length < 2) next.suburb = "Add a suburb or town.";
            if (!job.photos.length) next.photos = "Add at least one sample photo.";
            if (validate(next)) { update({ scopeReviewed: true }); setNotice("Review your job before posting."); heading.current?.focus(); }
          }, <>
            <Field id="title" label="What needs doing?" error={errors.title}><input {...attributes("title")} maxLength={80} value={job.title} onChange={event => update({ title: event.target.value })} /></Field>
            <Field id="description" label="Describe your job" error={errors.description} hint="Include the work, access and anything the tradie should know."><textarea {...attributes("description")} maxLength={4000} rows={5} value={job.description} onChange={event => update({ description: event.target.value })} /></Field>
            <div className={styles.fieldPair}><Field id="suburb" label="Suburb / town" error={errors.suburb}><input {...attributes("suburb")} maxLength={60} value={job.suburb} onChange={event => update({ suburb: event.target.value })} /></Field><Field id="region" label="Region"><select id="journey-region" value={job.region} onChange={event => update({ region: event.target.value })}>{REGIONS.map(region => <option key={region}>{region}</option>)}</select></Field></div>
            <Field id="timing" label="When would suit you?"><select id="journey-timing" value={job.timing} onChange={event => update({ timing: event.target.value })}>{["Within two weeks", "Within a month", "I’m flexible"].map(item => <option key={item}>{item}</option>)}</select></Field>
            <div className={styles.field} role="group" aria-labelledby="journey-photos-label"><p id="journey-photos-label" className={styles.fieldLabel}>Photos of the job</p><p className={styles.hint}>Use the sample illustrations to try adding and removing photos.</p>{photoGallery()}<div className={styles.photoControls}>{["overview", "detail"].map(id => <button key={id} type="button" className={styles.textButton} id={id === "overview" ? "journey-photos" : undefined} onClick={() => update({ photos: job.photos.includes(id) ? job.photos.filter(item => item !== id) : [...job.photos, id] })}>{job.photos.includes(id) ? "Remove" : "+ Add"} {PHOTO_NAMES[id].toLowerCase()}</button>)}</div>{errors.photos && <p role="alert" className={styles.error}>{errors.photos}</p>}</div>
            {action("Review my job")}
          </>)}
        </>}

        {job.stage === 1 && <>
          <p className={styles.lead}>Help us put a fair price on {job.title.toLowerCase()}.</p>{scopeSummary()}
          <div className={styles.callout}><strong>Private to Trade Marketplace</strong><p>Your estimate helps the admin set a fixed price. The customer sees the reviewed price, and sending an estimate doesn’t claim the job.</p></div>
          {!roleMatches ? handoff() : form(() => { if (validate(numbers(job.hours, job.materials))) run("Saving private estimate", previous => ({ ...reopenFrom(previous, 2, "Admin"), priceHours: previous.hours, priceMaterials: previous.materials }), "Private estimate saved. Review it as admin."); }, <>{numberFields(job.hours, job.materials, (key, value) => update({ [key]: value }))}<Field id="estimateNote" label="Assumptions and notes" hint="Keep any exclusions clear."><textarea id="journey-estimateNote" rows={3} maxLength={1000} value={job.estimateNote} onChange={event => update({ estimateNote: event.target.value })} /></Field>{job.reached > 2 && <p className={styles.hint}>Updating the estimate restarts price review for this sample.</p>}{action("Send private estimate")}</>)}
        </>}

        {job.stage === 2 && <>
          <p className={styles.lead}>Review the estimate, confirm the scope and send one clear price.</p>
          {job.role === "Admin" ? <><div className={styles.estimateCard}><span className={styles.avatar}>{sample.initials}</span><div><strong>{sample.tradie}</strong><p>Private estimate · sample tradie</p><p><b>{job.hours} hours</b> · {formatNZD(previewNumber(job.materials) * 100)} materials ex GST</p><p>{job.estimateNote}</p></div></div>{form(() => { if (validate(numbers(job.priceHours, job.priceMaterials, "price-"))) run("Sending fixed price", previous => ({ ...reopenFrom(previous, 3, "Customer"), pricedHours: previous.priceHours, pricedMaterials: previous.priceMaterials }), "Fixed price sent. Review the test payment as customer."); }, <>{numberFields(job.priceHours, job.priceMaterials, (key, value) => update(key === "hours" ? { priceHours: value } : { priceMaterials: value }), "price-")}<Field id="scopeNote" label="What the fixed price includes"><textarea id="journey-scopeNote" rows={3} maxLength={1000} value={job.scopeNote} onChange={event => update({ scopeNote: event.target.value })} /></Field><details className={styles.breakdown}><summary>Sample pricing breakdown</summary><dl className={styles.priceLines}><div><dt>Tradie gross pay + holiday pay</dt><dd>{formatNZD(price.tradieTotalCents)}</dd></div><div><dt>Labour cost including on-costs</dt><dd>{formatNZD(price.labourCostCents)}</dd></div><div><dt>Materials</dt><dd>{formatNZD(price.materialsCents)}</dd></div><div><dt>Marketplace margin (20%)</dt><dd>{formatNZD(price.marginCents)}</dd></div></dl><p className={styles.hint}>Illustrative rates: $45/hour, 8% holiday pay, 15% on-costs and a two-hour minimum. These are sample figures.</p></details>{priceSummary()}{job.reached > 3 && <p className={styles.hint}>Re-pricing starts a fresh test payment and claim for this sample job.</p>}{action("Send fixed price")}</>)}</> : <>{priceSummary()}{handoff()}</>}
        </>}

        {job.stage === 3 && <>
          <p className={styles.lead}>Your price is ready. Review the work and try a test payment.</p>{priceSummary()}
          {!roleMatches ? handoff() : job.reached >= 4 ? <div className={styles.formFields}><div className={styles.successPanel}><span className={styles.roundCheck}>✓</span><div><h3>Test payment recorded</h3><p>{formatNZD(price.totalCents)} · no money moved</p></div></div><button type="button" className={styles.primary} onClick={() => { update({ stage: 4, role: "Tradie" }); setNotice(""); }}>Continue to tradie claim <span aria-hidden="true">→</span></button></div> : form(() => {
            if (validate(job.paymentAccepted ? {} : { paymentAccepted: "Confirm you have reviewed the sample scope and total." })) run("Recording test payment", previous => ({ ...previous, reached: 4, stage: 4, role: "Tradie" }), "Test payment recorded. No money moved. The sample job is ready to claim.");
          }, <><div className={styles.testMethod}><span aria-hidden="true">▤</span><div><strong>Demo payment method</strong><p>Always uses sample funds. No card or bank details needed.</p></div><span className={styles.tag}>TEST</span></div><label className={styles.check}><input id="journey-paymentAccepted" type="checkbox" checked={job.paymentAccepted} aria-describedby={errors.paymentAccepted ? "journey-paymentAccepted-error" : undefined} aria-invalid={!!errors.paymentAccepted} onChange={event => update({ paymentAccepted: event.target.checked })} /><span>I’ve reviewed the sample scope and the {formatNZD(price.totalCents)} total.</span></label>{errors.paymentAccepted && <p id="journey-paymentAccepted-error" className={styles.error}>{errors.paymentAccepted}</p>}{action(`Record ${formatNZD(price.totalCents)} test payment`)}<p className={styles.hint}>This records an example receipt only. It does not book an appointment or transfer money.</p></>)}
        </>}

        {job.stage === 4 && <>
          <p className={styles.lead}>A job that fits your trade. A clear scope and pay upfront.</p>{scopeSummary()}<div className={styles.earnPanel}><p className={styles.kicker}>You earn · sample gross pay</p><p className={styles.bigPrice}>{formatNZD(price.tradieTotalCents)}</p><p>{price.hours} hours × $45 + 8% holiday pay, before deductions</p><p>Materials budget: <strong>{formatNZD(price.materialsCents)} ex GST</strong></p></div>
          {!roleMatches ? handoff() : job.reached >= 5 ? <div className={styles.formFields}><div className={styles.successPanel}><span className={styles.roundCheck}>✓</span><div><h3>You claimed this sample job</h3><p>Agree timing with the customer in the workspace.</p></div></div><button type="button" className={styles.primary} onClick={() => update({ stage: 5 })}>Open job workspace <span aria-hidden="true">→</span></button></div> : !job.claimReview ? <div className={styles.formFields}><p className={styles.hint}>Claiming assigns the sample job to {sample.tradie}. This preview does not check qualifications or availability.</p><button type="button" className={styles.primary} onClick={() => { update({ claimReview: true }); heading.current?.focus(); }}>Review claim <span aria-hidden="true">→</span></button></div> : form(() => {
            if (validate(job.claimAccepted ? {} : { claimAccepted: "Review the scope and gross pay before claiming." })) run("Claiming sample job", previous => ({ ...previous, reached: 5, stage: 5, role: "Tradie" }), "Job assigned. Try messages, timing and extra-work approval in the workspace.");
          }, <><h3>Before you claim</h3><p>Review the scope, materials budget and sample gross pay. A claim assigns the job; the appointment is agreed separately.</p><label className={styles.check}><input id="journey-claimAccepted" type="checkbox" checked={job.claimAccepted} aria-describedby={errors.claimAccepted ? "journey-claimAccepted-error" : undefined} aria-invalid={!!errors.claimAccepted} onChange={event => update({ claimAccepted: event.target.checked })} /><span>I’ve reviewed the scope and gross pay and want to claim this sample job.</span></label>{errors.claimAccepted && <p id="journey-claimAccepted-error" className={styles.error}>{errors.claimAccepted}</p>}<div className={styles.buttonRow}><button type="button" className={styles.secondary} onClick={() => update({ claimReview: false })}>Back to details</button>{action("Confirm sample claim")}</div></>)}
        </>}

        {job.stage === 5 && <>
          <p className={styles.lead}>Everyone on the same page, from the first message to the final detail.</p>
          <div className={styles.peopleRow}><span className={styles.avatar}>{sample.initials}</span><div><strong>{sample.tradie}</strong><p>{trade} · sample assigned tradie</p></div><span className={styles.tag}>Assigned</span></div>
          <section className={styles.workspaceSection} aria-labelledby="timing-heading"><h3 id="timing-heading">Agree a time</h3><p className={styles.hint}>This records a sample preference. Nothing is added to a calendar.</p>{form(() => { if (validate(job.appointment.trim().length < 5 ? { appointment: "Add a timing note of at least 5 characters." } : {})) run("Saving timing note", previous => ({ ...previous, appointmentSaved: true }), "Sample timing note saved for everyone in this journey."); }, <><Field id="appointment" label="Timing note" error={errors.appointment}><input {...attributes("appointment")} maxLength={120} value={job.appointment} onChange={event => update({ appointment: event.target.value, appointmentSaved: false })} /></Field>{action(job.appointmentSaved ? "Update timing note" : "Save timing note", true)}</>)}</section>
          <section className={styles.workspaceSection} aria-labelledby="messages-heading"><h3 id="messages-heading">Messages</h3><p className={styles.hint}>Customer, tradie and Trade Marketplace · sample conversation</p><ol className={styles.messages} aria-label="Sample conversation">{job.messages.map(message => <li key={message.id} className={message.role === job.role ? styles.messageMine : styles.messageOther}><strong>{message.role === "Admin" ? "Trade Marketplace" : message.role === "Tradie" ? sample.tradie : "Casey Martin"}</strong><p>{message.text}</p><small>Sample message</small></li>)}</ol>{form(() => { if (validate(!job.messageDraft.trim() ? { messageDraft: "Write a message before sending." } : {})) run("Adding sample message", previous => ({ ...previous, messages: [...previous.messages, { id: previous.messages.length + 1, role: previous.role, text: previous.messageDraft.trim() }], messageDraft: "" }), "Message added to this sample conversation."); }, <><Field id="messageDraft" label={`Message as ${job.role.toLowerCase()}`} error={errors.messageDraft}><textarea {...attributes("messageDraft")} rows={3} maxLength={1000} placeholder="Ask a question or share an update…" value={job.messageDraft} onChange={event => update({ messageDraft: event.target.value })} /></Field>{action("Add sample message", true)}</>)}</section>
          <section className={styles.workspaceSection} aria-labelledby="variation-heading"><div className={styles.sectionTitle}><h3 id="variation-heading">Extra work</h3><span className={styles.tag}>{({ none: "Optional", draft: "Draft", requested: "Needs pricing", priced: "Needs approval", approved: "Approved", declined: "Declined" })[job.variation.status]}</span></div><p className={styles.hint}>Extra work gets its own price and approval before it’s included.</p>
            {job.variation.status === "none" ? <button type="button" disabled={!!pending} className={styles.secondary} onClick={() => { update(previous => ({ ...previous, reached: 5, role: "Tradie", completionSent: false, completionReviewed: false, variation: { ...previous.variation, status: "draft" } })); setErrors({}); }}>Try an extra-work request <span aria-hidden="true">+</span></button> : job.variation.status === "draft" && job.role === "Tradie" ? form(() => {
              const next = numbers(job.variation.hours, job.variation.materials, "variation-");
              if (job.variation.description.trim().length < 10) next["variation-description"] = "Describe the extra work in at least 10 characters.";
              if (!job.variation.photo) next["variation-photo"] = "Attach the sample photo so the extra work can be reviewed.";
              if (validate(next)) run("Requesting extra-work price", previous => ({ ...previous, role: "Admin", variation: { ...previous.variation, status: "requested" } }), "Extra work requested. Review and price it as admin.");
            }, <><Field id="variation-description" label="What’s extra?" error={errors["variation-description"]}><textarea {...attributes("variation-description")} rows={3} maxLength={2000} value={job.variation.description} onChange={event => update(previous => ({ ...previous, variation: { ...previous.variation, description: event.target.value } }))} /></Field>{numberFields(job.variation.hours, job.variation.materials, (key, value) => update(previous => ({ ...previous, variation: { ...previous.variation, [key]: value } })), "variation-")}<label className={styles.check}><input id="journey-variation-photo" type="checkbox" checked={job.variation.photo} onChange={event => update(previous => ({ ...previous, variation: { ...previous.variation, photo: event.target.checked } }))} /><span>Attach sample close-up illustration</span></label>{errors["variation-photo"] && <p className={styles.error}>{errors["variation-photo"]}</p>}{action("Request extra-work price")}</>) : <div className={styles.formFields}><p>{job.variation.description}</p>{job.variation.photo && photoGallery(["detail"])}{job.variation.status === "draft" && <button type="button" className={styles.textButton} onClick={() => changeRole("Tradie")}>View request as tradie →</button>}{job.variation.status === "requested" && (job.role !== "Admin" ? <button type="button" className={styles.secondary} onClick={() => changeRole("Admin")}>Review as admin →</button> : form(() => { if (validate(numbers(job.variation.hours, job.variation.materials, "variation-"))) run("Sending extra-work price", previous => ({ ...previous, role: "Customer", variation: { ...previous.variation, status: "priced" } }), "Extra-work price sent. Try approving or declining as customer."); }, <>{numberFields(job.variation.hours, job.variation.materials, (key, value) => update(previous => ({ ...previous, variation: { ...previous.variation, [key]: value } })), "variation-")}<p className={styles.subtotal}>Extra-work fixed price <strong>{formatNZD(extra.totalCents)} incl. GST</strong></p>{action("Send extra-work price")}</>))}{job.variation.status === "priced" && <><p className={styles.subtotal}>Extra-work fixed price <strong>{formatNZD(extra.totalCents)} incl. GST</strong></p>{job.role !== "Customer" ? <button type="button" className={styles.secondary} onClick={() => changeRole("Customer")}>Review as customer →</button> : <><p className={styles.hint}>Approve to add a test payment. If declined, the original scope stays in place.</p><div className={styles.buttonRow}><button type="button" disabled={!!pending} className={styles.secondary} onClick={() => run("Declining extra work", previous => ({ ...previous, variation: { ...previous.variation, status: "declined" } }), "Extra work declined. Continue with the original scope.")}>Decline extra work</button><button type="button" disabled={!!pending} className={styles.primary} onClick={() => run("Approving test payment", previous => ({ ...previous, variation: { ...previous.variation, status: "approved" } }), "Extra work approved with a test payment. No money moved.")}>{pending || "Approve & record test payment"}</button></div></>}</>}{["approved", "declined"].includes(job.variation.status) && <div className={styles.callout}><strong>{extraApproved ? "Approved and included" : "Original scope continues"}</strong><p>{extraApproved ? `A ${formatNZD(extra.totalCents)} test payment has been recorded. No money moved.` : "The extra work is excluded. The tradie can finish the original job."}</p></div>}</div>}
            {job.variation.status === "draft" && <button type="button" className={styles.textButton} disabled={!!pending} onClick={() => update(previous => ({ ...previous, variation: { ...previous.variation, status: "none" } }))}>Discard extra-work draft</button>}
          </section>
          {["requested", "priced", "draft"].includes(job.variation.status) ? <p className={styles.callout}>Resolve or discard the extra-work request before completion.</p> : <button type="button" className={styles.primary} disabled={!!pending} onClick={() => { update({ stage: 6, reached: Math.max(job.reached, 6), role: "Tradie" }); setErrors({}); setNotice(""); }}>Prepare completion <span aria-hidden="true">→</span></button>}
        </>}

        {job.stage === 6 && <>
          <p className={styles.lead}>{job.completionSent ? "The work is ready for a final look." : "Record the finished work and prepare the customer handover."}</p>
          <div className={styles.callout}><strong>{trade === "Electrical" ? "Electrical certificate example" : "Completion evidence example"}</strong><p>{trade === "Electrical" ? "The sample certificate is clearly marked as an example and is not a valid Certificate of Compliance." : `Use a work summary and sample photos for this ${trade.toLowerCase()} journey. These do not establish trade-specific compliance or document requirements.`}</p></div>
          {!roleMatches ? handoff() : !job.completionSent ? form(() => {
            const next: Errors = {};
            if (job.completionNote.trim().length < 20) next.completionNote = "Add a work summary of at least 20 characters.";
            if (!job.completionPhoto) next.completionPhoto = "Attach the finished-work sample photo.";
            if (trade === "Electrical" && !job.completionDocument) next.completionDocument = "Attach the clearly marked sample certificate.";
            if (validate(next)) run("Sending sample completion", previous => ({ ...previous, completionSent: true, role: "Customer" }), "Completion shared. Review the sample evidence as customer.");
          }, <><Field id="completionNote" label="Work completed" error={errors.completionNote}><textarea {...attributes("completionNote")} rows={5} maxLength={2000} value={job.completionNote} onChange={event => update({ completionNote: event.target.value })} /></Field><label className={styles.check}><input id="journey-completionPhoto" type="checkbox" checked={job.completionPhoto} onChange={event => update({ completionPhoto: event.target.checked })} /><span>Attach finished-work sample illustration</span></label>{errors.completionPhoto && <p className={styles.error}>{errors.completionPhoto}</p>}{job.completionPhoto && photoGallery(["finished"])}{trade === "Electrical" && <><label className={styles.check}><input id="journey-completionDocument" type="checkbox" checked={job.completionDocument} onChange={event => update({ completionDocument: event.target.checked })} /><span>Attach example certificate · SAMPLE / NOT VALID</span></label>{errors.completionDocument && <p className={styles.error}>{errors.completionDocument}</p>}</>}{action("Send completion for review")}</>) : <div className={styles.formFields}><h3 ref={completionHeading} tabIndex={-1}>Completion summary</h3><p>{job.completionNote}</p>{photoGallery(["finished"])}{trade === "Electrical" && <details className={styles.document}><summary>View example electrical certificate</summary><p className={styles.documentStamp}>SAMPLE / NOT VALID</p><h3>Certificate of Compliance example</h3><p>Reference: SAMPLE-TM-{2101 + TRADES.indexOf(trade)}</p><p>This fixture demonstrates a document review. It contains no inspection, signature or certification and must not be used as evidence of electrical compliance.</p></details>}{job.reached >= 7 ? <button type="button" className={styles.primary} onClick={() => update({ stage: 7, role: "Customer" })}>Continue to review →</button> : form(() => {
            if (validate(job.completionReviewed ? {} : { completionReviewed: "Review the sample work summary and evidence before confirming." })) run("Confirming sample completion", previous => ({ ...previous, reached: 7, stage: 7, role: "Customer" }), "Sample job complete. Leave a review to finish the journey.");
          }, <><label className={styles.check}><input id="journey-completionReviewed" type="checkbox" checked={job.completionReviewed} onChange={event => update({ completionReviewed: event.target.checked })} /><span>I’ve reviewed the sample completion summary and evidence.</span></label>{errors.completionReviewed && <p className={styles.error}>{errors.completionReviewed}</p>}{action(job.role === "Admin" ? "Sign off sample job" : "Confirm sample job is complete")}<button type="button" className={styles.textButton} disabled={!!pending} onClick={() => { update({ completionSent: false, completionReviewed: false, role: "Tradie" }); setErrors({}); }}>Edit completion as tradie</button><p className={styles.hint}>This marks the example job complete. No payroll or money transfer takes place.</p></>)}</div>}
        </>}

        {job.stage === 7 && <>
          <div className={styles.completionHero}><span className={styles.roundCheck}>✓</span><h3>A job well done.</h3><p>{job.title}</p><span className={styles.tag}>Sample job complete</span></div>
          {!roleMatches ? handoff() : job.reached === 8 ? <div className={styles.formFields}><div className={styles.reviewCard}><p aria-label={`${job.rating} out of 5 stars`} className={styles.savedStars}>{"★".repeat(job.rating)}{"☆".repeat(5 - job.rating)}</p><h3 ref={reviewHeading} tabIndex={-1}>Thanks for your review</h3><p>{job.review || "You left a star rating without a comment."}</p><p className={styles.hint}>Saved to this sample journey only.</p></div><button type="button" className={styles.secondary} onClick={() => update({ reached: 7 })}>Edit my sample review</button><div className={styles.callout}><strong>Try the journey in another trade</strong><p>Your progress stays here while you switch between trades at the top.</p></div></div> : form(() => {
            if (validate(job.rating ? {} : { rating: "Choose a rating from 1 to 5 stars." })) run("Saving sample review", previous => ({ ...previous, reached: 8 }), "Review saved. You’ve completed this sample journey.");
          }, <><fieldset className={styles.ratingField}><legend>How did {sample.tradie.split(" ")[0]} do?</legend><div className={styles.rating}>{[1, 2, 3, 4, 5].map(rating => <label key={rating} className={job.rating === rating ? styles.ratingSelected : ""}><input id={rating === 1 ? "journey-rating" : undefined} type="radio" name="rating" value={rating} checked={job.rating === rating} onChange={() => update({ rating })} /><span aria-hidden="true">★</span><span>{rating}</span><span className={styles.srOnly}>out of 5 stars</span></label>)}</div>{errors.rating && <p className={styles.error}>{errors.rating}</p>}</fieldset><Field id="review" label="Your review (optional)" hint="A few words about the work, communication or tidiness."><textarea id="journey-review" rows={4} maxLength={1000} value={job.review} onChange={event => update({ review: event.target.value })} /></Field>{action("Save sample review")}</>)}
        </>}

        {job.stage > 0 && <div className={styles.backRow}><button type="button" className={styles.textButton} disabled={!!pending} onClick={() => navigate(job.stage - 1)}>← Back to {STAGES[job.stage - 1].short.toLowerCase()}</button><span>{job.stage + 1} / {STAGES.length}</span></div>}
      </article>

      <aside className={styles.summaryPanel} aria-label="Sample job summary"><div className={styles.summaryTop}><span className={styles.tradeBadge}><TradeMark trade={trade} size={32} /></span><p className={styles.kicker}>{trade}</p><span className={styles.tag}>{progress}</span></div><h2>{job.title || "Your sample job"}</h2><p className={styles.hint}>TM-{2101 + TRADES.indexOf(trade)} · {job.suburb}, {job.region}</p><dl className={styles.details}><div><dt>Customer</dt><dd>Casey Martin <span>· sample</span></dd></div><div><dt>Timing</dt><dd>{job.appointmentSaved ? job.appointment : job.timing}</dd></div>{job.reached >= 5 && <><div><dt>Assigned tradie</dt><dd>{sample.tradie} <span>· sample</span></dd></div><div><dt>Sample address</dt><dd>{job.address}, {job.suburb}</dd></div></>}{job.reached >= 3 && <div><dt>{extraApproved ? "Total with approved extra work" : "Fixed price incl. GST"}</dt><dd className={styles.summaryTotal}>{formatNZD(total)}</dd></div>}</dl><div className={styles.nextHint}><p className={styles.kicker}>How it works</p><p>Customer describes. Tradie estimates. Admin sets the price. Everyone follows the same job through to completion.</p></div><p className={styles.hint}>Each trade is a separate sample. No profile, qualification or compliance checks are performed here.</p></aside>
    </div>
    {photo && <dialog ref={dialog} className={styles.photoDialog} aria-labelledby="journey-photo-title" aria-describedby="journey-photo-description" onCancel={event => { event.preventDefault(); closePhoto(); }} onClose={() => setPhoto(null)}><div className={styles.dialogHeading}><h2 id="journey-photo-title">{PHOTO_NAMES[photo]}</h2><button type="button" className={styles.secondary} onClick={closePhoto} autoFocus>Close <span aria-hidden="true">×</span></button></div><SamplePhoto trade={trade} detail={photo === "detail"} finished={photo === "finished"} /><p id="journey-photo-description">Sample illustration for this {trade.toLowerCase()} journey. This is not a photo or evidence of actual work.</p></dialog>}
  </section>;
}
