"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export function DocumentPanel({ url }: { url: string }) {
  const [state, setState] = useState<"idle" | "checking" | "ready" | "error">("idle");
  const inFlight = useRef(false);

  async function check() {
    if (inFlight.current) return;
    inFlight.current = true;
    setState("checking");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { method: "HEAD", cache: "no-store", signal: controller.signal });
      const type = response.headers.get("content-type") ?? "";
      if (!response.ok || !/^(application\/pdf|image\/(jpeg|png|webp))(;|$)/i.test(type)) throw new Error("Document unavailable");
      setState("ready");
    } catch {
      setState("error");
    } finally {
      clearTimeout(timeout);
      inFlight.current = false;
    }
  }

  return <section aria-label="CoC document access" className="mt-3 space-y-3 rounded-xl border border-border p-4">
    <p className="text-sm text-muted">Check the uploaded document before opening it. This checks availability only; it does not verify the certificate’s contents.</p>
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn-ghost" disabled={state === "checking"} onClick={check}>{state === "checking" ? "Checking document…" : state === "error" ? "Retry document check" : state === "ready" ? "Check again" : "Check CoC document"}</button>
      {<a href={url} target="_blank" rel="noreferrer" className="btn-ghost">Open original document <span className="sr-only">in a new tab</span></a>}
    </div>
    <p role="status" className="text-sm">{state === "checking" ? "Checking whether the document is available." : state === "ready" ? "Document is available. Open it in a new tab to view or download. Availability can change; retry the check if opening fails." : ""}</p>
    {state === "error" && <div role="alert" className="text-sm text-red-800">We couldn’t access this document. It may be missing, your access may have changed, or the connection may have failed. Retry, or use the job conversation to ask Trade Marketplace to check the upload. <Link href="/support" className="underline">Help and support</Link>.</div>}
  </section>;
}
