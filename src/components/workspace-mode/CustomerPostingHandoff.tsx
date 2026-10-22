"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { customerPostingDestination } from "@/lib/workspace-mode/customer-model";
import { useWorkspaceMode } from "./WorkspaceMode";

/** Keeps a reserved preview tradie's direct posting link in its existing local
 * composer. The original server-role fallback remains for every other account. */
export function CustomerPostingHandoff({ children }: { children: ReactNode }) {
  const { enabled, ready, mode, actualRole, setMode } = useWorkspaceMode();
  const router = useRouter();
  const destination = ready ? customerPostingDestination(actualRole, enabled, mode) : null;
  useEffect(() => { if (destination) router.replace(destination); }, [destination, router]);

  if (!ready || destination) return <p role="status" className="mx-auto max-w-xl px-4 py-12">Opening customer posting…</p>;
  if (!enabled || actualRole !== "TRADIE") return children;
  return <section className="mx-auto max-w-xl px-4 py-12" aria-labelledby="customer-posting-heading">
    <div className="card p-6" data-mode="customer">
      <h1 id="customer-posting-heading" className="text-2xl font-semibold">Post a job in Customer mode</h1>
      <p className="mt-3 text-sm text-muted">Use the same account to explore the customer sample. Your trade jobs and drafts stay saved. Posting here saves a local sample job; nothing is sent to a tradie.</p>
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" className="btn-ghost" onClick={() => setMode("customer")}>Open Customer posting</button><Link href="/dashboard" className="btn-ghost">Back to trade jobs</Link></div>
    </div>
  </section>;
}
