// Prices are built UP from the tradie's rate, never cut down from what the customer pays:
//   tradie gross = hours x tradie rate
//   labour cost  = tradie gross + on-costs (holiday pay, employer KiwiSaver, ACC)
//   ex GST       = (labour cost + materials at cost) + TM margin
//   customer pays = ex GST + GST
// So the tradie's pay is fixed first and TM's cut comes out of the margin only.

export type Rates = {
  tradieRateCents: number;
  holidayPayPct: number;
  onCostPct: number;
  marginPct: number;
  gstPct: number;
  minHours: number;
};

export type PriceBreakdown = {
  hours: number;
  tradieGrossCents: number;
  holidayPayCents: number;
  tradieTotalCents: number; // what the tradie sees: gross + holiday pay, before PAYE
  onCostCents: number;
  labourCostCents: number;
  materialsCents: number;
  marginCents: number; // TM's cut
  exGstCents: number;
  gstCents: number;
  totalCents: number; // customer pays
};

const r = Math.round;

export function priceWork(
  hoursIn: number,
  materialsCents: number,
  rates: Rates,
  { applyMinimum = true }: { applyMinimum?: boolean } = {},
): PriceBreakdown {
  const hours = applyMinimum ? Math.max(hoursIn, rates.minHours) : hoursIn;
  const tradieGrossCents = r(hours * rates.tradieRateCents);
  const holidayPayCents = r((tradieGrossCents * rates.holidayPayPct) / 100);
  const onCostCents = r((tradieGrossCents * rates.onCostPct) / 100);
  const labourCostCents = tradieGrossCents + onCostCents;
  const marginCents = r(((labourCostCents + materialsCents) * rates.marginPct) / 100);
  const exGstCents = labourCostCents + materialsCents + marginCents;
  const gstCents = r((exGstCents * rates.gstPct) / 100);
  return {
    hours,
    tradieGrossCents,
    holidayPayCents,
    tradieTotalCents: tradieGrossCents + holidayPayCents,
    onCostCents,
    labourCostCents,
    materialsCents,
    marginCents,
    exGstCents,
    gstCents,
    totalCents: exGstCents + gstCents,
  };
}

/** Effective hourly figures for the "is it worth it" pitch. */
export function hourlyView(rates: Rates) {
  const one = priceWork(1, 0, rates, { applyMinimum: false });
  return {
    tradiePerHourCents: one.tradieTotalCents,
    customerPerHourCents: one.totalCents,
    tmPerHourCents: one.marginCents,
  };
}

/** Rates frozen onto a job when it was priced. */
export function jobRates(job: {
  tradieRateCents: number | null;
  onCostPct: number | null;
  marginPct: number | null;
  gstPct: number | null;
}, settings: Rates): Rates {
  return {
    ...settings,
    tradieRateCents: job.tradieRateCents ?? settings.tradieRateCents,
    onCostPct: job.onCostPct ?? settings.onCostPct,
    marginPct: job.marginPct ?? settings.marginPct,
    gstPct: job.gstPct ?? settings.gstPct,
  };
}
