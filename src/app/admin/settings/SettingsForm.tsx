"use client";

import { useActionState, useState } from "react";
import { updateSettings } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/ui";
import { formatNZD } from "@/lib/constants";
import { hourlyView } from "@/lib/pricing";

type S = {
  tradieRate: number; holidayPayPct: number; onCostPct: number; marginPct: number; gstPct: number; minHours: number; autoReleaseHours: number;
};

const FIELDS: [keyof S, string, string, string][] = [
  ["tradieRate", "Tradie rate ($/hr, gross)", "0.50", "What the electrician is paid per hour before PAYE. Set this first."],
  ["holidayPayPct", "Holiday pay (%)", "0.1", "Paid on top to casuals each job. Minimum 8%."],
  ["onCostPct", "On-costs (%)", "0.1", "Holiday pay + employer KiwiSaver (3%) + ACC levy. Must include holiday pay."],
  ["marginPct", "Trade Marketplace margin (%)", "0.5", "Added on labour cost + materials. This is your cut."],
  ["gstPct", "GST (%)", "0.5", ""],
  ["minHours", "Minimum hours per job", "0.25", "Stops tiny call-outs being not worth it."],
  ["autoReleaseHours", "Auto-release payout after (hrs)", "1", "If the customer doesn't confirm after the CoC upload."],
];

export function SettingsForm({ settings }: { settings: S }) {
  const [state, action] = useActionState(updateSettings, undefined);
  const [v, setV] = useState(settings);
  const h = hourlyView({ ...v, tradieRateCents: Math.round(v.tradieRate * 100) });

  return (
    <form action={action} className="card mt-6 space-y-4 p-6">
      {FIELDS.map(([key, label, step, help]) => (
        <div key={key}>
          <label className="label" htmlFor={key}>{label}</label>
          <input
            className="input" id={key} name={key} type="number" step={step} min="0" required
            defaultValue={settings[key]} onChange={(e) => setV({ ...v, [key]: Number(e.target.value) || 0 })}
          />
          {help && <p className="mt-1 text-xs text-muted">{help}</p>}
        </div>
      ))}
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-paper p-4 text-center text-sm">
        <div><p className="text-xs text-muted">Tradie earns</p><p className="font-bold text-leaf-dark">{formatNZD(h.tradiePerHourCents)}/hr</p></div>
        <div><p className="text-xs text-muted">TM keeps</p><p className="font-bold">{formatNZD(h.tmPerHourCents)}/hr</p></div>
        <div><p className="text-xs text-muted">Customer pays</p><p className="font-bold">{formatNZD(h.customerPerHourCents)}/hr</p></div>
      </div>
      <FormMessage state={state} />
      <SubmitButton>Save rates</SubmitButton>
    </form>
  );
}
