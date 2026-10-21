import { getSettings } from "@/lib/settings";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const s = await getSettings();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Rates &amp; settings</h1>
      <p className="mt-1 text-sm text-muted">
        Prices are built up from the tradie rate. Changes apply to jobs priced from now on - already-priced jobs keep their rates.
      </p>
      <SettingsForm settings={{ ...s, tradieRate: s.tradieRateCents / 100 }} />
    </div>
  );
}
