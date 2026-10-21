export const TRADES = ["Electrical", "Plumbing", "Gas Fitting", "Construction"] as const;
export type Trade = typeof TRADES[number];
export const ROLES = ["Customer", "Tradie", "Admin"] as const;
export type Role = typeof ROLES[number];
export const STAGES = [
  { label: "Your job", role: "Customer", short: "Scope" },
  { label: "Private estimate", role: "Tradie", short: "Estimate" },
  { label: "Fixed price", role: "Admin", short: "Price" },
  { label: "Test payment", role: "Customer", short: "Payment" },
  { label: "Claim the job", role: "Tradie", short: "Claim" },
  { label: "Job workspace", role: "Tradie", short: "Workspace" },
  { label: "Completion", role: "Tradie", short: "Complete" },
  { label: "Your review", role: "Customer", short: "Review" },
] as const;

export type Variation = {
  status: "none" | "draft" | "requested" | "priced" | "approved" | "declined";
  description: string;
  hours: string;
  materials: string;
  photo: boolean;
};
export type Journey = {
  stage: number;
  reached: number;
  role: Role;
  title: string;
  description: string;
  suburb: string;
  address: string;
  region: string;
  timing: string;
  photos: string[];
  scopeReviewed: boolean;
  hours: string;
  materials: string;
  estimateNote: string;
  priceHours: string;
  priceMaterials: string;
  pricedHours: string;
  pricedMaterials: string;
  scopeNote: string;
  paymentAccepted: boolean;
  claimReview: boolean;
  claimAccepted: boolean;
  messages: { id: number; role: Role; text: string }[];
  messageDraft: string;
  appointment: string;
  appointmentSaved: boolean;
  variation: Variation;
  completionNote: string;
  completionPhoto: boolean;
  completionDocument: boolean;
  completionSent: boolean;
  completionReviewed: boolean;
  rating: number;
  review: string;
};

export const SAMPLES: Record<Trade, {
  title: string; description: string; tradie: string; initials: string;
  hours: string; materials: string; note: string; variation: string; completion: string;
}> = {
  Electrical: {
    title: "Move two kitchen power points",
    description: "Move two existing power points along the kitchen wall and add a dishwasher outlet. The wall lining is open and the switchboard is accessible. Please leave the work area tidy.",
    tradie: "Jamie Wilson", initials: "JW", hours: "4", materials: "145",
    note: "Allow for accessible cable routes. Includes standard white fittings; confirm positions before starting.",
    variation: "Customer requested an additional double power point beside the pantry, outside the original scope.",
    completion: "The two power points have been relocated and the dishwasher outlet installed. Final positions were confirmed with the customer and the area was tidied.",
  },
  Plumbing: {
    title: "Replace the kitchen mixer tap",
    description: "Replace the existing kitchen mixer with a similar standard tap. The sink stays in place and the cupboard below is clear. Include the replacement tap and remove the old fitting.",
    tradie: "Alex Morgan", initials: "AM", hours: "2", materials: "210",
    note: "Includes a standard mixer and accessible connections. Check fitting size before ordering materials.",
    variation: "Customer requested replacement of the adjacent filter tap, which is outside the original mixer-tap scope.",
    completion: "The mixer tap was replaced, the old fitting removed and the cupboard cleaned. The customer was shown the finished work.",
  },
  "Gas Fitting": {
    title: "Replace an existing gas hob",
    description: "Replace an existing gas hob with a customer-supplied equivalent in the same kitchen position. The bench cut-out stays the same and the cupboard below is accessible. Review the exact appliance before confirming the scope.",
    tradie: "Taylor Lee", initials: "TL", hours: "3", materials: "180",
    note: "Sample allowance assumes a compatible replacement appliance and accessible existing connections. Review the scope before work.",
    variation: "Customer requested removal of an additional unused appliance fitting outside the original hob-replacement scope.",
    completion: "The agreed hob-replacement scope is recorded as finished in this sample. The work area was tidied and a handover summary added for customer review.",
  },
  Construction: {
    title: "Repair the garden gate and latch",
    description: "Repair the timber garden gate so it opens freely and fits the existing opening. Replace the latch and two damaged boards. Keep the existing posts and match the timber profile where possible.",
    tradie: "Sam Patel", initials: "SP", hours: "5", materials: "260",
    note: "Allow for two replacement boards and standard gate hardware. Posts assumed sound; finish is natural timber.",
    variation: "Customer requested a third replacement board and matching hardware on the side gate, outside the agreed scope.",
    completion: "The damaged boards and latch were replaced, the gate adjusted and offcuts removed. The gate now opens and closes within the agreed scope.",
  },
};

export function makeJourney(trade: Trade): Journey {
  const sample = SAMPLES[trade];
  return {
    stage: 0, reached: 0, role: "Customer", title: sample.title, description: sample.description,
    suburb: "Waverley", address: "12 Example Lane", region: "Otago", timing: "Within two weeks",
    photos: ["overview", "detail"], scopeReviewed: false,
    hours: sample.hours, materials: sample.materials, estimateNote: sample.note,
    priceHours: sample.hours, priceMaterials: sample.materials,
    pricedHours: sample.hours, pricedMaterials: sample.materials,
    scopeNote: "Includes the work described above and standard materials. Extra work needs a separate price and approval.",
    paymentAccepted: false, claimReview: false, claimAccepted: false,
    messages: [{ id: 1, role: "Admin", text: "Welcome! Your job details and updates will stay together here." }],
    messageDraft: "", appointment: "Weekday morning, to be agreed", appointmentSaved: false,
    variation: { status: "none", description: sample.variation, hours: "1", materials: "45", photo: true },
    completionNote: sample.completion, completionPhoto: true, completionDocument: false,
    completionSent: false, completionReviewed: false, rating: 0, review: "",
  };
}

// Purely presentational sample rates. This does not load or write application settings.
export const SAMPLE_RATES = {
  tradieRateCents: 4500, holidayPayPct: 8, onCostPct: 15, marginPct: 20, gstPct: 15, minHours: 2,
};
