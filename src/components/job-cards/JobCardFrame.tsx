"use client";

import Link from "next/link";
import { useId, type MouseEvent, type ReactNode, type Ref } from "react";
import { JobPhotoCarousel, type JobOpenHandler, type JobPhoto, type JobQuoteStatus } from "./JobPhotoCarousel";
import styles from "./job-card.module.css";

export type JobCardFrameProps = {
  title: string;
  href: string;
  photos: JobPhoto[];
  quoteStatus?: JobQuoteStatus;
  completed?: boolean;
  meta?: ReactNode;
  status?: ReactNode;
  valueLabel?: ReactNode;
  value?: ReactNode;
  moneyValue?: boolean;
  actions?: ReactNode;
  headingLevel?: 2 | 3;
  headingRef?: Ref<HTMLHeadingElement>;
  focusTarget?: boolean;
  onOpen?: JobOpenHandler;
};

/** Every slot is reserved, including absent data, to keep all job cards equal. */
export function JobCardFrame({ title, href, photos, quoteStatus, completed = false, meta, status, valueLabel, value, moneyValue = false, actions, headingLevel = 3, headingRef, focusTarget = false, onOpen }: JobCardFrameProps) {
  const id = useId();
  const Heading = headingLevel === 2 ? "h2" : "h3";
  function openTitle(event: MouseEvent<HTMLAnchorElement>) {
    if (!onOpen || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onOpen(event.currentTarget);
  }
  return <article className={styles.card} aria-labelledby={id}>
    <JobPhotoCarousel photos={photos} title={title} href={href} quoteStatus={quoteStatus} completed={completed} onOpen={onOpen} />
    <div className={styles.body}>
      <Heading className={styles.title} id={id} ref={headingRef} tabIndex={focusTarget ? -1 : undefined} data-testid={focusTarget ? "quote-feed-focus-target" : undefined}><Link href={href} title={title} aria-haspopup={onOpen ? "dialog" : undefined} onClick={openTitle}>{title}</Link></Heading>
      <div className={styles.meta}>{meta}</div>
      <div className={styles.status}>{status}</div>
      <div className={styles.value}><span className={styles.valueLabel}>{valueLabel}</span><strong className={`${styles.valueAmount} ${moneyValue ? "trade-money" : ""}`}>{value}</strong></div>
      <div className={styles.actions}>{actions}</div>
    </div>
  </article>;
}

export default JobCardFrame;
