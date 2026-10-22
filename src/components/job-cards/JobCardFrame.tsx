"use client";

import Link from "next/link";
import { useId, type ReactNode, type Ref } from "react";
import { JobPhotoCarousel, type JobPhoto, type JobQuoteStatus } from "./JobPhotoCarousel";
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
  actions?: ReactNode;
  headingLevel?: 2 | 3;
  headingRef?: Ref<HTMLHeadingElement>;
  focusTarget?: boolean;
};

/** Every slot is reserved, including absent data, to keep all job cards equal. */
export function JobCardFrame({ title, href, photos, quoteStatus, completed = false, meta, status, valueLabel, value, actions, headingLevel = 3, headingRef, focusTarget = false }: JobCardFrameProps) {
  const id = useId();
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return <article className={styles.card} aria-labelledby={id}>
    <JobPhotoCarousel photos={photos} title={title} href={href} quoteStatus={quoteStatus} completed={completed} />
    <div className={styles.body}>
      <Heading className={styles.title} id={id} ref={headingRef} tabIndex={focusTarget ? -1 : undefined} data-testid={focusTarget ? "quote-feed-focus-target" : undefined}><Link href={href} title={title}>{title}</Link></Heading>
      <div className={styles.meta}>{meta}</div>
      <div className={styles.status}>{status}</div>
      <div className={styles.value}><span className={styles.valueLabel}>{valueLabel}</span><strong className={styles.valueAmount}>{value}</strong></div>
      <div className={styles.actions}>{actions}</div>
    </div>
  </article>;
}

export default JobCardFrame;
