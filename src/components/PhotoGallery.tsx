"use client";

import { useEffect, useId, useRef, useState } from "react";

export function PhotoGallery({ photos, label }: { photos: { id?: string; url: string }[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const photoViewport = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const active = photos[index];
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    function restore() { setZoom(false); opener.current?.focus(); }
    el.addEventListener("close", restore);
    return () => el.removeEventListener("close", restore);
  }, []);
  function move(delta: number) { setIndex((current) => (current + delta + photos.length) % photos.length); setZoom(false); }
  if (!photos.length) return null;
  return <section aria-label={`${label} photos`} className="p-4">
    <p className="mb-3 text-sm font-medium">{label} photos · {photos.length}</p>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{photos.map((photo, i) => <button key={photo.id ?? `${photo.url}-${i}`} type="button" className="overflow-hidden rounded-xl border border-border text-left hover:border-forest" aria-label={`Open ${label.toLowerCase()} photo ${i + 1} of ${photos.length}`} onClick={(event) => { opener.current = event.currentTarget; setIndex(i); setZoom(false); dialog.current?.showModal(); }}>
      {failed.includes(photo.url) ? <span className="grid aspect-square place-items-center bg-paper p-3 text-center text-sm">Photo unavailable<br />Open for options</span> : <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt={`${label} photo ${i + 1}`} className="aspect-square w-full object-cover" onError={() => setFailed((all) => all.includes(photo.url) ? all : [...all, photo.url])} />
      </>}
      <span className="block px-3 py-2 text-sm">Photo {i + 1} · View</span>
    </button>)}</div>
    <dialog ref={dialog} aria-labelledby={titleId} className="m-auto max-h-[95dvh] w-[min(960px,95vw)] overflow-auto rounded-2xl border border-border bg-white p-4 text-ink shadow-xl backdrop:bg-black/70 sm:p-6" onKeyDown={(event) => {
      // Preserve native scrolling while keyboard focus is in the zoomed photo.
      if (zoom && photoViewport.current?.contains(event.target as Node)) return;
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }}>
      <div className="flex items-center justify-between gap-3"><h2 id={titleId} className="text-lg font-semibold">{label} photo {index + 1} of {photos.length}</h2><button type="button" className="btn-ghost" autoFocus onClick={() => dialog.current?.close()}>Close</button></div>
      <p className="mb-4 text-sm text-muted">{zoom ? "Focus the zoomed photo to scroll with arrow keys. Use Previous and Next to change photos." : "Use left and right arrow keys to browse."} Press Escape to close.</p>
      {active && (failed.includes(active.url) ? <div role="status" className="rounded-xl bg-paper p-8 text-center"><p className="font-semibold">This photo could not be loaded.</p><p className="mt-2 text-sm">It may be unavailable or your connection may have changed. You can try opening the original.</p></div> : <div ref={photoViewport} className="max-h-[60dvh] overflow-auto rounded-xl bg-paper" tabIndex={zoom ? 0 : undefined} aria-label={zoom ? "Zoomed photo, scroll to explore" : undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={active.url} alt={`${label} photo ${index + 1}`} className={zoom ? "w-[150%] max-w-none" : "max-h-[60dvh] w-full object-contain"} onError={() => setFailed((all) => all.includes(active.url) ? all : [...all, active.url])} />
      </div>)}
      <div className="mt-4 flex flex-wrap gap-2">{photos.length > 1 && <><button type="button" className="btn-ghost" onClick={() => move(-1)}>Previous</button><button type="button" className="btn-ghost" onClick={() => move(1)}>Next</button></>}
        <button type="button" className="btn-ghost" aria-pressed={zoom} disabled={!active || failed.includes(active.url)} onClick={() => setZoom(!zoom)}>{zoom ? "Fit photo" : "Zoom photo"}</button>
        {active && <a href={active.url} target="_blank" rel="noreferrer" className="btn-ghost">Open original <span className="sr-only">in a new tab</span></a>}
      </div>
      <p className="sr-only" role="status">Photo {index + 1} of {photos.length}{zoom ? ", zoomed" : ""}</p>
    </dialog>
  </section>;
}
