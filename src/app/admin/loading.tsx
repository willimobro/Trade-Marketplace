import styles from "./admin.module.css";
export default function AdminLoading() {
  return <div role="status" aria-live="polite" className="space-y-5">
    <p className="font-semibold text-forest">Loading operations…</p>
    <div aria-hidden="true" className={styles.metricGrid}>{[1, 2, 3].map((n) => <div key={n} className="card h-28 bg-white" />)}</div>
    <div aria-hidden="true" className="card h-64" />
  </div>;
}
