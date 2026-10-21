import styles from "./admin.module.css";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className={styles.workspace}>
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Trade Marketplace · Operations workspace</p>
      </div>
      {children}
    </div>
  );
}
