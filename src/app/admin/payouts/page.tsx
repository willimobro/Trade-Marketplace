import Link from "next/link";
import { db } from "@/lib/db";
import { markPayoutPaid } from "@/app/actions/admin";
import { formatNZD, jobRef, timeAgo } from "@/lib/constants";
import { StatusChip } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const payouts = await db.payout.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { tradie: { select: { name: true, email: true } }, job: { select: { id: true, jobNumber: true, title: true } } },
  });
  const pending = payouts.filter((p) => p.status === "PENDING");
  const total = pending.reduce((s, p) => s + p.grossCents + p.holidayPayCents, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Payouts</h1>
          <p className="text-sm text-muted">{pending.length} pending · {formatNZD(total)} gross incl. holiday pay</p>
        </div>
        <a href="/admin/payouts/export" className="btn-primary">Export pending for payroll (CSV)</a>
      </div>
      <p className="mt-2 text-xs text-muted">
        Import the CSV into your payroll software to run PAYE, then mark each one paid.
      </p>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.03] text-left text-xs text-muted">
            <tr>
              <th className="p-3 font-medium">Tradie</th>
              <th className="p-3 font-medium">Job</th>
              <th className="p-3 text-right font-medium">Hours</th>
              <th className="p-3 text-right font-medium">Gross</th>
              <th className="p-3 text-right font-medium">Holiday pay</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {payouts.map((p) => (
              <tr key={p.id}>
                <td className="p-3">{p.tradie.name}</td>
                <td className="p-3"><Link href={`/jobs/${p.job.id}`} className="hover:underline">{jobRef(p.job.jobNumber)}</Link> <span className="text-muted">{timeAgo(p.createdAt)}</span></td>
                <td className="p-3 text-right tabular-nums">{p.hours}</td>
                <td className="p-3 text-right tabular-nums">{formatNZD(p.grossCents)}</td>
                <td className="p-3 text-right tabular-nums">{formatNZD(p.holidayPayCents)}</td>
                <td className="p-3"><StatusChip status={p.status} /></td>
                <td className="p-3 text-right">
                  {p.status === "PENDING" && (
                    <form action={markPayoutPaid.bind(null, p.id)}><button className="btn-ghost">Mark paid</button></form>
                  )}
                </td>
              </tr>
            ))}
            {!payouts.length && <tr><td colSpan={7} className="p-4 text-muted">No payouts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
