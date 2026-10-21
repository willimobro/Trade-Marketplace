"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { supportArticles, supportTopics, validateSupportRequest, type SupportErrors, type SupportRequest, type SupportTopic } from "./support-data";
import styles from "./support.module.css";

function HelpIcon({ kind }: { kind: string }) {
  return <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {kind === "Getting started" && <><path d="m4 15 12-10 12 10M7 13v14h18V13M12 27v-9h8v9" /><path d="M21 5v4" /></>}
    {kind === "Your account" && <><circle cx="16" cy="10" r="5" /><path d="M6 27v-3a10 10 0 0 1 20 0v3H6Z" /></>}
    {kind === "Jobs & quotes" && <><rect x="5" y="9" width="22" height="18" rx="3" /><path d="M11 9V5h10v4M5 16c7 4 15 4 22 0M14 17v4h4v-4" /></>}
    {kind === "Payments" && <><rect x="3" y="7" width="26" height="19" rx="3" /><path d="M3 13h26M8 21h6" /></>}
    {kind === "search" && <><circle cx="14" cy="14" r="9" /><path d="m21 21 7 7" /></>}
    {kind === "message" && <><path d="M27 21a4 4 0 0 1-4 4H12l-7 4V8a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v13Z" /><path d="M11 11h10M11 17h7" /></>}
    {kind === "check" && <path d="m7 16 6 6L26 9" />}
  </svg>;
}

type RequestState = {
  phase: "editing" | "error" | "complete";
  errors: SupportErrors;
  attempt: number;
  request?: SupportRequest;
};

const initialRequest: RequestState = { phase: "editing", errors: {}, attempt: 0 };

function RequestForm({ topic, onTopicChange, onRestart, focusOnMount }: { topic: SupportTopic; onTopicChange: (topic: SupportTopic) => void; onRestart: () => void; focusOnMount: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [outcome, setOutcome] = useState("complete");
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const [state, submit, pending] = useActionState<RequestState, FormData>(async (previous, data) => {
    const request = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      topic: String(data.get("topic") ?? ""),
      message: String(data.get("message") ?? "").trim(),
    };
    const errors = validateSupportRequest(request);
    if (Object.keys(errors).length) return { phase: "editing", errors, attempt: previous.attempt + 1 };
    // Local, in-memory demonstration. No fetch, server action or persistence.
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (data.get("outcome") === "interrupted" && previous.phase !== "error") {
      return { phase: "error", errors: {}, attempt: previous.attempt + 1 };
    }
    return { phase: "complete", errors: {}, attempt: previous.attempt + 1, request };
  }, initialRequest);

  const currentErrors = validateSupportRequest({ name, email, topic, message });
  const errors: SupportErrors = {};
  for (const field of ["name", "email", "topic", "message"] as const) {
    if (state.errors[field] && currentErrors[field]) errors[field] = currentErrors[field];
  }

  useEffect(() => {
    if (focusOnMount) formRef.current?.querySelector<HTMLInputElement>("input")?.focus();
  }, [focusOnMount]);

  useEffect(() => {
    if (state.phase === "complete" || state.phase === "error") resultRef.current?.focus();
    else if (state.attempt) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  if (state.phase === "complete") return <div className={styles.confirmation}>
    <span className={styles.successIcon}><HelpIcon kind="check" /></span>
    <p className={styles.eyebrow}>Request preview complete</p>
    <h2 ref={resultRef} tabIndex={-1}>You’ve tried the next step.</h2>
    <p className={styles.outcomeNotice} role="status"><strong>Demo request only. No message was sent.</strong></p>
    <p className={styles.formIntro}>Here’s how your request would look. You can keep exploring the help centre or start another example.</p>
    <dl className={styles.requestSummary}>
      <div><dt>Demo reference</dt><dd>DEMO-1048</dd></div>
      <div><dt>Topic</dt><dd>{state.request?.topic}</dd></div>
      <div><dt>Example email</dt><dd>{state.request?.email}</dd></div>
    </dl>
    <button type="button" className={styles.primary} onClick={onRestart}>Try another request <span aria-hidden="true">↗</span></button>
    <a href="#support-answers" className={styles.textLink}>Back to help articles <span aria-hidden="true">↑</span></a>
  </div>;

  const errorFor = (field: keyof SupportRequest) => errors[field] ? <p className={styles.fieldError} id={`support-${field}-error`}>{errors[field]}</p> : null;
  return <>
    <div className={styles.formHeading}><span className={styles.messageIcon}><HelpIcon kind="message" /></span><div><p className={styles.eyebrow}>A little more help</p><h2>Tell us what’s going on.</h2></div></div>
    <p className={styles.formIntro}>Choose a topic and add a few details to try a support request.</p>
    <form ref={formRef} action={submit} noValidate aria-busy={pending}>
      {Object.keys(errors).length > 0 && <p className={styles.errorSummary} role="alert">Check the highlighted fields to continue.</p>}
      {state.phase === "error" && <div className={styles.retryNotice} role="alert"><h3 ref={resultRef} tabIndex={-1}>Let’s try that again.</h3><p>The demo connection was interrupted. Your details are still here. Retry to finish the example.</p><p><strong>No message was sent.</strong></p></div>}
      <fieldset disabled={pending} className={styles.formFields}>
        <legend className={styles.visuallyHidden}>Support request details</legend>
        <div className={styles.fieldPair}>
          <div className={styles.field}><label htmlFor="support-name">Your name</label><input id="support-name" name="name" value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Alex" autoComplete="off" maxLength={100} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "support-name-error" : undefined} />{errorFor("name")}</div>
          <div className={styles.field}><label htmlFor="support-email">Email address</label><input id="support-email" name="email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="alex@example.com" autoComplete="off" maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "support-email-error" : undefined} />{errorFor("email")}</div>
        </div>
        <div className={styles.field}><label htmlFor="support-topic">What do you need help with?</label><select id="support-topic" name="topic" value={topic} onChange={event => onTopicChange(event.target.value as SupportTopic)} required aria-invalid={Boolean(errors.topic)} aria-describedby={errors.topic ? "support-topic-error" : undefined}>{supportTopics.map(item => <option key={item}>{item}</option>)}</select>{errorFor("topic")}</div>
        <div className={styles.field}><label htmlFor="support-message">Your message</label><textarea id="support-message" name="message" value={message} onChange={event => setMessage(event.target.value)} placeholder="Tell us what you were trying to do and where you got stuck…" rows={5} maxLength={2000} required minLength={20} aria-invalid={Boolean(errors.message)} aria-describedby={`support-message-help${errors.message ? " support-message-error" : ""}`} /><div className={styles.messageHelp}><p id="support-message-help">At least 20 characters. Use sample details and leave out private information.</p><span aria-label={`${message.length} of 2000 characters`}>{message.length}/2000</span></div>{errorFor("message")}</div>
        <input type="hidden" name="outcome" value={outcome} />
      </fieldset>
      <SubmitButton pending="Preparing your demo…" className={styles.primary}>{state.phase === "error" ? "Try again" : "Preview support request"}<span aria-hidden="true">↗</span></SubmitButton>
      <p className={styles.demoNote}>Demo only. This form doesn’t send a message.</p>
      <details className={styles.demoOptions}><summary>Try a different outcome</summary><label htmlFor="support-outcome">Example result</label><select id="support-outcome" value={outcome} onChange={event => setOutcome(event.target.value)} disabled={pending}><option value="complete">Request confirmation</option><option value="interrupted">Connection interruption, then retry</option></select></details>
    </form>
  </>;
}

export function SupportPreview({ initialTopic = "Getting started" }: { initialTopic?: SupportTopic }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SupportTopic | "All topics">("All topics");
  const [topic, setTopic] = useState<SupportTopic>(initialTopic);
  const [requestNumber, setRequestNumber] = useState(0);
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const articles = supportArticles.filter(article => (category === "All topics" || article.topic === category) && `${article.question} ${article.answer} ${article.topic}`.toLocaleLowerCase().includes(normalizedQuery));

  function selectCategory(next: SupportTopic) {
    setCategory(category === next ? "All topics" : next);
    setTopic(next);
    setOpenArticle(null);
  }

  function restartRequest() {
    setRequestNumber(number => number + 1);
  }

  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="support-title">
      <div className={styles.heroText}><p className={styles.eyebrow}>Help centre</p><h1 id="support-title">How can<br /> we help?</h1><p>A clear answer. A little guidance.<br /> Let’s find your next step.</p></div>
      <div className={styles.heroGraphic} aria-hidden="true"><HelpIcon kind="message" /><span>?</span></div>
      <a className={styles.heroLink} href="#contact-support">Ask a question <span aria-hidden="true">↘</span></a>
    </section>

    <div className={styles.content}>
      <section className={styles.findHelp} aria-labelledby="help-topics-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Start here</p><h2 id="help-topics-title">Find your answer.</h2></div></div>
        <div className={styles.search}><HelpIcon kind="search" /><label htmlFor="support-search" className={styles.visuallyHidden}>Search help articles</label><input id="support-search" type="search" value={query} onChange={event => { setQuery(event.target.value); setOpenArticle(null); }} placeholder="Search help articles" autoComplete="off" /></div>
        <div className={styles.categories} aria-label="Filter help by topic">{supportTopics.map(item => <button key={item} type="button" className={styles.category} aria-pressed={category === item} onClick={() => selectCategory(item)}><HelpIcon kind={item} /><span>{item}</span><span className={styles.categoryMeta}>{supportArticles.filter(article => article.topic === item).length} articles <span aria-hidden="true">↗</span></span></button>)}</div>
      </section>

      <div className={styles.helpColumns}>
        <section id="support-answers" className={styles.answers} aria-labelledby="support-answers-title">
          <div className={styles.answersHeading}><div><p className={styles.eyebrow}>Useful things to know</p><h2 id="support-answers-title">{category === "All topics" ? "Popular questions" : category}</h2></div>{(category !== "All topics" || query) && <button type="button" className={styles.clearFilter} onClick={() => { setCategory("All topics"); setQuery(""); setOpenArticle(null); }}>Clear filters</button>}</div>
          <p className={styles.resultCount} role="status" aria-live="polite">{normalizedQuery ? `${articles.length} ${articles.length === 1 ? "answer" : "answers"} for “${query.trim()}”` : `${articles.length} helpful answers`}</p>
          {articles.length ? <div className={styles.articleList}>{articles.map(article => <article className={styles.article} key={article.id}><h3><button type="button" id={`question-${article.id}`} aria-expanded={openArticle === article.id} aria-controls={`answer-${article.id}`} onClick={() => setOpenArticle(openArticle === article.id ? null : article.id)}>{article.question}<span aria-hidden="true">{openArticle === article.id ? "−" : "+"}</span></button></h3><div id={`answer-${article.id}`} aria-labelledby={`question-${article.id}`} hidden={openArticle !== article.id} className={styles.answer}><p>{article.answer}</p>{article.link && <Link href={article.link.href} className={styles.textLink}>{article.link.label} <span aria-hidden="true">→</span></Link>}</div></article>)}</div> : <div className={styles.emptyState}><span className={styles.emptyIcon}><HelpIcon kind="search" /></span><h3>No answers found just yet.</h3><p>Try another word, browse a different topic or ask a question below.</p><button type="button" className={styles.secondary} onClick={() => { setQuery(""); setCategory("All topics"); }}>Show all articles</button><a href="#contact-support" className={styles.textLink}>Ask a question <span aria-hidden="true">↓</span></a></div>}
          <aside className={styles.quickHelp}><h3>Looking for your job?</h3><p>See its latest progress and find your conversation in one place.</p><Link href="/dashboard" className={styles.textLink}>Go to My jobs <span aria-hidden="true">→</span></Link></aside>
        </section>
        <section id="contact-support" className={styles.contact} aria-label="Support request"><RequestForm key={requestNumber} topic={topic} onTopicChange={setTopic} onRestart={restartRequest} focusOnMount={requestNumber > 0} /></section>
      </div>
      <div className={styles.bottomLink}><Link href="/">← Back to home</Link><span>Here to help you move forward.</span></div>
    </div>
  </div>;
}
