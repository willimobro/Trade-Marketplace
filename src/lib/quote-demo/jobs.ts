import { DEMO_JOB_ASSETS, type DemoJobAssetId } from "../demo-job-assets";

function photo(id: DemoJobAssetId): { image: string; imageAlt: string } {
  const asset = DEMO_JOB_ASSETS.find((item) => item.id === id)!;
  return { image: asset.url, imageAlt: `Illustrative photo: ${asset.title.toLowerCase()}` };
}

export const DEMO_TRADES = ["Electrical", "Plumbing", "Gas Fitting", "Construction"] as const;
export type DemoTrade = (typeof DEMO_TRADES)[number];

export type DemoJob = {
  id: string;
  title: string;
  trade: DemoTrade;
  suburb: string;
  distance: string;
  description: string;
  details: string[];
  image: string;
  imageAlt: string;
  timing: string;
  posted: string;
  stage: "quoting" | "available";
  priceCents?: number;
};

/** All jobs, locations and prices in this workspace are isolated sample data. */
export const DEMO_JOBS: readonly DemoJob[] = [
  {
    id: "demo-electrical-01", title: "A little more light in the kitchen", trade: "Electrical",
    suburb: "Grey Lynn", distance: "3.2 km", timing: "This week", posted: "Just added",
    description: "Replace three tired pendant lights over our kitchen island. The existing wiring and ceiling points are in place; we have the new fittings ready.",
    details: ["3 pendant lights", "Existing ceiling points", "Fittings supplied"],
    ...photo("ceiling-light"), stage: "quoting",
  },
  {
    id: "demo-plumbing-01", title: "A tap that finally stops dripping", trade: "Plumbing",
    suburb: "Mount Eden", distance: "5.1 km", timing: "Flexible", posted: "25 min ago",
    description: "Our kitchen mixer has a slow drip and a stiff handle. Please quote to replace it with a new mixer; we would appreciate advice on a good everyday option.",
    details: ["1 kitchen mixer", "Easy under-sink access", "Supply + installation"],
    ...photo("kitchen-sink"), stage: "quoting",
  },
  {
    id: "demo-construction-01", title: "Give the deck a fresh start", trade: "Construction",
    suburb: "Westmere", distance: "4.4 km", timing: "Next 2 weeks", posted: "40 min ago",
    description: "A few boards on our small back deck have weathered through. Replace the damaged boards and check the surrounding fixings. Access is down the side of the house.",
    details: ["Approx. 12 m² deck", "6–8 boards to replace", "Ground-level access"],
    ...photo("deck-patio"), stage: "quoting",
  },
  {
    id: "demo-gas-01", title: "Ready for a new gas hob", trade: "Gas Fitting",
    suburb: "Kingsland", distance: "3.8 km", timing: "This week", posted: "1 hr ago",
    description: "Swap our existing four-burner gas hob for a new unit in the same cut-out. The replacement is on site. Please include disconnection, connection and required checks.",
    details: ["Like-for-like hob", "Existing gas connection", "New hob supplied"],
    ...photo("kitchen-renovation"), stage: "quoting",
  },
  {
    id: "demo-electrical-02", title: "Power where we need it", trade: "Electrical",
    suburb: "Ponsonby", distance: "2.6 km", timing: "Next week", posted: "2 hrs ago",
    description: "Add two double power points to our home office. It is a single-level timber house, with accessible space beneath the floor and an existing socket on the same wall.",
    details: ["2 double power points", "Home office", "Under-floor access"],
    ...photo("room-renovation"), stage: "quoting",
  },
  {
    id: "demo-plumbing-02", title: "Sort the bathroom basin", trade: "Plumbing",
    suburb: "Sandringham", distance: "6.2 km", timing: "This week", posted: "3 hrs ago",
    description: "The bathroom basin drains slowly and there is a small leak at the waste fitting. Please inspect, clear the blockage and replace the waste seal if needed.",
    details: ["1 bathroom basin", "Slow drain + small leak", "Vanity access"],
    ...photo("bathroom-vanity"), stage: "quoting",
  },
  {
    id: "demo-construction-02", title: "A side gate that closes properly", trade: "Construction",
    suburb: "Point Chevalier", distance: "6.7 km", timing: "Flexible", posted: "4 hrs ago",
    description: "Our timber side gate has dropped and catches on the path. Repair or replace the hinges, adjust the gate and fit a new latch so it closes smoothly.",
    details: ["1 timber side gate", "Hinges + latch", "Approx. 1 m wide"],
    ...photo("timber-fence"), stage: "quoting",
  },
  {
    id: "demo-gas-02", title: "Time for a heater check", trade: "Gas Fitting",
    suburb: "Epsom", distance: "7.5 km", timing: "Next week", posted: "5 hrs ago",
    description: "Service and check our wall-mounted gas heater before winter. It is working, but has not been serviced recently. Please include a safety and ventilation check.",
    details: ["1 wall-mounted gas heater", "Routine service", "Safety checks"],
    ...photo("house-exterior"), stage: "quoting",
  },
  {
    id: "demo-electrical-03", title: "Bathroom fan replacement", trade: "Electrical",
    suburb: "Mount Albert", distance: "6.4 km", timing: "Next week", posted: "Ready to claim",
    description: "Replace a noisy bathroom extractor with a new fan in the existing ceiling position. The scope and sample fixed price have been reviewed.",
    details: ["1 extractor fan", "Existing ducting", "Supply + installation"],
    ...photo("bathroom-vanity"), stage: "available", priceCents: 34500,
  },
  {
    id: "demo-plumbing-03", title: "Replace the laundry tub", trade: "Plumbing",
    suburb: "Avondale", distance: "8.1 km", timing: "Next 2 weeks", posted: "Ready to claim",
    description: "Remove an old laundry tub and connect the supplied replacement to the existing water and waste. The scope and sample fixed price have been reviewed.",
    details: ["1 laundry tub", "Replacement supplied", "Existing connections"],
    ...photo("kitchen-sink"), stage: "available", priceCents: 42000,
  },
  {
    id: "demo-construction-03", title: "New shelves for the study", trade: "Construction",
    suburb: "Newmarket", distance: "5.8 km", timing: "Flexible", posted: "Ready to claim",
    description: "Install three supplied timber floating shelves on a stud wall in our study. The scope and sample fixed price have been reviewed.",
    details: ["3 floating shelves", "Shelves supplied", "Stud wall"],
    ...photo("timber-detail"), stage: "available", priceCents: 28500,
  },
  {
    id: "demo-gas-03", title: "Connect the new gas cooker", trade: "Gas Fitting",
    suburb: "Onehunga", distance: "10.2 km", timing: "This week", posted: "Ready to claim",
    description: "Connect a replacement freestanding gas cooker at an existing connection and complete required checks. The scope and sample fixed price have been reviewed.",
    details: ["1 freestanding cooker", "Existing gas point", "Cooker supplied"],
    ...photo("kitchen-renovation"), stage: "available", priceCents: 36000,
  },
];

export function demoTrade(trade: string | null): DemoTrade | null {
  return DEMO_TRADES.find((item) => item.toLowerCase() === trade?.toLowerCase()) ?? null;
}

export function findDemoJob(id: string): DemoJob | undefined {
  return DEMO_JOBS.find((job) => job.id === id);
}

export function formatDemoMoney(cents: number): string {
  return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD", maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
}

