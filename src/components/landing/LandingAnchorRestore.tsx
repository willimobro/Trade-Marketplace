"use client";

import { useEffect } from "react";

/** The initial document can stream before the browser's fragment target exists. */
export function LandingAnchorRestore() {
  useEffect(() => {
    if (window.location.hash !== "#how-it-works") return;
    let active = true;
    let frame = 0;
    void document.fonts.ready.then(() => {
      if (!active) return;
      frame = requestAnimationFrame(() => {
        if (window.location.hash === "#how-it-works") {
          document.getElementById("how-it-works")?.scrollIntoView({ block: "start" });
        }
      });
    });
    return () => { active = false; cancelAnimationFrame(frame); };
  }, []);
  return null;
}
