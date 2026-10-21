import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { jobRef } from "@/lib/constants";

const csvCell = (v: string | number) => {
  const s = String(v);
  // Quote everything and neutralise spreadsheet formula injection.
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return new Response("Not found", { status: 404 });

  const payouts = await db.payout.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { tradie: { select: { name: true, email: true, registrationNo: true } }, job: { select: { jobNumber: true } } },
  });
  const rows = [
    ["Name", "Email", "Registration", "Job", "Hours", "Rate", "Gross", "Holiday pay (8%)", "Total gross"],
    ...payouts.map((p) => [
      p.tradie.name, p.tradie.email, p.tradie.registrationNo ?? "", jobRef(p.job.jobNumber), p.hours,
      (p.rateCents / 100).toFixed(2), (p.grossCents / 100).toFixed(2), (p.holidayPayCents / 100).toFixed(2),
      ((p.grossCents + p.holidayPayCents) / 100).toFixed(2),
    ]),
  ];
  const body = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tm-payouts-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
