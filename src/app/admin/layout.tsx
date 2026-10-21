import Link from "next/link";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 flex flex-wrap gap-2 text-sm">
        {[
          ["/admin", "Queues"],
          ["/admin/tradies", "Tradies"],
          ["/admin/payouts", "Payouts"],
          ["/admin/settings", "Rates & settings"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="btn-ghost">{label}</Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
