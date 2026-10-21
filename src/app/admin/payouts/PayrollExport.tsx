"use client";

import { useRef, useState } from "react";

export function PayrollExport({ count, total }: { count: number; total: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inFlight = useRef(false);

  async function download() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/admin/payouts/export", { cache: "no-store" });
      if (!response.ok || !response.headers.get("content-type")?.includes("text/csv")) {
        throw new Error("Export unavailable");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tm-payouts-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("CSV download requested. Check your downloads before continuing. No payroll records were changed.");
    } catch {
      setError("We couldn’t download the CSV. Check your connection and admin session, then retry. No payroll records were changed.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <section className="card space-y-4 p-4 sm:p-6" aria-labelledby="export-heading">
      <div>
        <h2 id="export-heading" className="text-lg font-bold">Review pending export</h2>
        <p className="mt-2 text-sm text-muted">This page shows {count} pending record{count === 1 ? "" : "s"}, totalling {total} before deductions. The CSV includes the latest pending records at download time, which may differ if another admin updates a record.</p>
      </div>
      <details>
        <summary className="cursor-pointer py-3 font-semibold">Included columns & reconciliation checklist</summary>
        <p className="mt-2 text-sm text-muted">Name, email, registration, job reference, hours, rate, gross pay, holiday pay and total gross. The file contains personal information; use your approved payroll process.</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
          <li>Match each job, electrician, hours and amount against the completed work.</li>
          <li>Check the CSV format and deductions in your payroll system. This is a generic export, not a payroll-provider integration.</li>
          <li>Reconcile payment outside this app, then review each record before marking it paid.</li>
        </ol>
      </details>
      <button type="button" onClick={download} disabled={pending || count === 0} aria-busy={pending} className="btn-primary">{pending ? "Preparing CSV…" : "Download pending records (CSV)"}</button>
      {count === 0 && <p className="text-sm text-muted">There are no pending records to export. Paid records remain below for review.</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">{error}</p>}
      <p role="status" className="text-sm text-muted">{message}</p>
      <p className="text-sm text-muted">Prototype limitation: export history, bank reconciliation, payslips and payment statements are not available. A “paid” label records a manual status update, not bank confirmation.</p>
    </section>
  );
}
