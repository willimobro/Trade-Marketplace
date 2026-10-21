"use client";

import { useEffect, useRef, useState } from "react";

export function SupportPreview() {
  const [topic, setTopic] = useState("Account access");
  const [review, setReview] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const topicRef = useRef<HTMLSelectElement>(null);
  const moveFocus = useRef(false);
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    if (review) headingRef.current?.focus();
    else topicRef.current?.focus();
  }, [review]);
  return <section className="card mt-6 p-6 sm:p-8">
    <p className="text-sm font-semibold text-muted">Support request · Preview only</p>
    <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-xl font-semibold">{review ? "Example request review" : "Explore a support request"}</h2>
    <p className="mt-3 text-sm leading-6 text-muted">Nothing is submitted and no ticket is created. Choose a sample topic to preview the review step. Do not provide personal or job details.</p>
    {!review ? <form onSubmit={event => { event.preventDefault(); moveFocus.current = true; setReview(true); }} className="mt-5 space-y-4"><div><label className="label" htmlFor="support-topic">Example topic</label><select ref={topicRef} id="support-topic" className="input" value={topic} onChange={event => setTopic(event.target.value)}><option>Account access</option><option>Job status</option><option>Connection problem</option></select></div><button className="btn-primary" type="submit">Preview request review</button></form> : <div className="mt-5" role="status"><dl className="rounded-xl bg-paper p-4"><dt className="text-sm text-muted">Example topic</dt><dd className="mt-1 font-semibold">{topic}</dd><dt className="mt-4 text-sm text-muted">Delivery status</dt><dd className="mt-1">Not sent — support backend unavailable</dd></dl><button type="button" className="btn-ghost mt-4" onClick={() => { moveFocus.current = true; setReview(false); }}>Change example topic</button></div>}
  </section>;
}
