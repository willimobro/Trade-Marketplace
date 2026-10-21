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
  ["holidayPayPct", "Holiday pay (%)", "0.1", "Prototype setting for the additional holiday-pay calculation."],
  ["onCostPct", "On-costs (%)", "0.1", "Labour on-cost allowance; must be at least the holiday-pay percentage."],
  ["marginPct", "Trade Marketplace margin (%)", "0.5", "Markup applied to labour cost and materials; not a net-profit forecast."],
  ["gstPct", "GST (%)", "0.5", ""],
  ["minHours", "Minimum hours per job", "0.25", "Minimum billable hours used by the pricing calculation."],
  ["autoReleaseHours", "Auto-release payout after (hrs)", "1", "Threshold after CoC upload when the customer has not confirmed. Release checks run on relevant page loads, not a scheduled timer."],
];

const LIMITS: Record<keyof S, [number, number]> = {
  tradieRate: [23.5, 500], holidayPayPct: [8, 50], onCostPct: [0, 100], marginPct: [0, 200], gstPct: [0, 50], minHours: [0, 24], autoReleaseHours: [1, 720],
};

export function SettingsForm({ settings }: { settings: S }) {
  const [state, action] = useActionState(updateSettings, undefined);
  const [values, setValues] = useState(() => Object.fromEntries(Object.entries(settings).map(([key, value]) => [key, String(value)])) as Record<keyof S, string>);
  const v = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value)])) as S;
  const validPreview = FIELDS.every(([key]) => values[key] !== "" && Number.isFinite(v[key]) && v[key] >= LIMITS[key][0] && v[key] <= LIMITS[key][1]) && v.onCostPct >= v.holidayPayPct;
  const h = hourlyView({ ...v, tradieRateCents: Math.round(v.tradieRate * 100) });

  return (
    <form action={action} className="card mt-6 space-y-6 p-4 sm:p-6">
      {FIELDS.map(([key, label, step, help]) => (
        <div key={key}>
          <label className="label" htmlFor={key}>{label}</label>
          <input
            className="input" id={key} name={key} type="number" step={step} min={LIMITS[key][0]} max={LIMITS[key][1]} required aria-describedby={`${key}-help`}
            value={values[key]} onChange={(e) => setValues({ ...values, [key]: e.target.value })}
          />
          <p id={`${key}-help`} className="mt-2 text-sm text-muted">{help} Allowed range: {LIMITS[key][0]}–{LIMITS[key][1]}.</p>
        </div>
      ))}
      <section aria-label="Hourly pricing preview" className="rounded-xl bg-paper p-4">
        <h2 className="font-bold">Hourly pricing preview</h2><p className="mb-4 mt-1 text-sm text-muted">Illustrative hour of labour. Excludes materials and minimum-job adjustments. Save to apply changes.</p>
        {validPreview ? <div className="grid gap-4 text-sm sm:grid-cols-3">
        <div><p className="text-xs text-muted">Gross + holiday pay</p><p className="font-bold text-leaf-dark">{formatNZD(h.tradiePerHourCents)}/hr</p></div>
        <div><p className="text-xs text-muted">Platform markup</p><p className="font-bold">{formatNZD(h.tmPerHourCents)}/hr</p></div>
        <div><p className="text-xs text-muted">Customer hourly price</p><p className="font-bold">{formatNZD(h.customerPerHourCents)}/hr</p></div>
      </div> : <p className="text-sm text-muted">Enter valid rates to see the preview. On-costs must include the holiday-pay percentage.</p>}
      </section>
      <FormMessage state={state} />
      <SubmitButton>Save rates</SubmitButton>
    </form>
  );
}
