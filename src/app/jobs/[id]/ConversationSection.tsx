"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Hash navigation can arrive before streamed job content has mounted. */
export function ConversationSection({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    const arrive = () => {
      if (window.location.hash !== "#messages") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = section.current;
        if (cancelled || !target || window.location.hash !== "#messages") return;
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start", behavior: "instant" });
      });
    };
    arrive();
    // Font loading can move content above the thread after the first paint.
    void document.fonts.ready.then(() => {
      if (!cancelled && (!document.activeElement || document.activeElement === document.body || document.activeElement === section.current)) arrive();
    });
    window.addEventListener("hashchange", arrive);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", arrive);
    };
  }, []);
  return <section ref={section} id="messages" tabIndex={-1} aria-labelledby="conversation-heading" className="card p-6">{children}</section>;
}
