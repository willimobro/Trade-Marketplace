import { requireAdmin } from "@/lib/session";
import { AdminNav } from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6 lg:px-8 lg:py-10">
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Trade Marketplace · Operations workspace</p>
        <AdminNav />
      </div>
      <aside aria-label="Demo environment" className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <strong>Demo environment.</strong> Payments and refunds update test records only. Payroll is a CSV export and a manual record; this app does not transfer money.
      </aside>
      {children}
    </div>
  );
}
