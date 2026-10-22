"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import styles from "./job-card.module.css";

export type JobPhoto = { url: string; alt?: string };
export type JobQuoteStatus = "quoted" | "accepted";

export type JobPhotoCarouselProps = {
  photos: JobPhoto[];
  title: string;
  href?: string;
  quoteStatus?: JobQuoteStatus;
  completed?: boolean;
  compact?: boolean;
};

/** The photo link and carousel controls are siblings, never nested controls. */
export function JobPhotoCarousel({ photos, title, href, quoteStatus, completed = false, compact = false }: JobPhotoCarouselProps) {
  const [position, setPosition] = useState(0);
  const [failedPhotos, setFailedPhotos] = useState<string[]>([]);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const id = useId();
  const items = photos.filter((photo) => photo.url);
  const index = items.length ? position % items.length : 0;
  const photo = items[index];
  const multiple = items.length > 1;
  const description = photo?.alt || `${title}, photo ${index + 1} of ${items.length}`;
  const overlayClass = completed ? styles.completedOverlay : quoteStatus === "accepted" ? styles.acceptedOverlay : styles.quotedOverlay;
  const overlayLabel = completed ? "COMPLETE" : quoteStatus === "accepted" ? "Accepted" : "Quoted";

  function change(next: number) {
    setPosition(items.length ? (next + items.length) % items.length : 0);
  }

  function control(event: MouseEvent<HTMLButtonElement>, next: number) {
    event.preventDefault();
    event.stopPropagation();
    change(next);
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (!multiple || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    change(index + (event.key === "ArrowRight" ? 1 : -1));
  }

  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (!gesture.current || !multiple) return;
    const dx = event.clientX - gesture.current.x;
    const dy = event.clientY - gesture.current.y;
    gesture.current = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      suppressClick.current = true;
      change(index + (dx < 0 ? 1 : -1));
    }
  }

  const visual = photo && !failedPhotos.includes(photo.url) ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo.url} alt={description} draggable={false} onError={() => setFailedPhotos((failed) => [...failed, photo.url])} />
  ) : <span className={styles.photoFallback}><svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 3-3 6 6" /></svg><span>{photo ? "Photo unavailable" : "No photo yet"}</span></span>;

  return <div className={`${styles.carousel} ${compact ? styles.compact : ""} ${completed ? styles.completed : ""}`} role={multiple ? "group" : undefined} aria-label={multiple ? `${title} photos` : undefined} aria-roledescription={multiple ? "carousel" : undefined} onKeyDown={keyboard} onPointerDown={(event) => { suppressClick.current = false; if (event.isPrimary && event.pointerType !== "mouse" && !(event.target as HTMLElement).closest("button")) gesture.current = { x: event.clientX, y: event.clientY }; }} onPointerUp={pointerEnd} onPointerCancel={() => { gesture.current = null; }} onClickCapture={(event) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>
    {href ? <Link className={styles.photoLink} href={href} aria-label={`View ${title}`}>{visual}</Link> : <div className={styles.photoLink} tabIndex={multiple ? 0 : undefined}>{visual}</div>}
    {(completed || quoteStatus) && <div className={`${styles.quoteOverlay} ${overlayClass}`}><span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg>{overlayLabel}</span></div>}
    {multiple && <>
      <button className={`${styles.photoArrow} ${styles.photoPrevious}`} type="button" aria-label={`Previous photo of ${title}`} aria-controls={id} onClick={(event) => control(event, index - 1)}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6" /></svg></button>
      <button className={`${styles.photoArrow} ${styles.photoNext}`} type="button" aria-label={`Next photo of ${title}`} aria-controls={id} onClick={(event) => control(event, index + 1)}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 6 6 6-6 6" /></svg></button>
      <div className={styles.photoDots} aria-label="Choose a photo">{items.map((item, itemIndex) => <button key={`${item.url}-${itemIndex}`} type="button" aria-label={`Photo ${itemIndex + 1} of ${items.length} for ${title}`} aria-current={itemIndex === index ? "true" : undefined} onClick={(event) => control(event, itemIndex)}><span /></button>)}</div>
      <span className={styles.srOnly} id={id} role="status" aria-live="polite">Photo {index + 1} of {items.length}</span>
    </>}
  </div>;
}

export default JobPhotoCarousel;
