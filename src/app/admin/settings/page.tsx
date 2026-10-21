import { getSettings } from "@/lib/settings";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const s = await getSettings();
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold sm:text-4xl">Rates &amp; settings</h1>
      <p className="mt-1 text-sm text-muted">
        Review the labour-rate model before saving. New prices use these settings; some later calculations, including holiday pay, also use current settings. Check active jobs before changing rates.
      </p>
      <SettingsForm settings={{ ...s, tradieRate: s.tradieRateCents / 100 }} />
    </div>
  );
}
