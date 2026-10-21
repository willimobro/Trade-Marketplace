import type { PrismaClient, Settings } from "@prisma/client";
import { demoJobPhotoUrls, type DemoJobAssetId } from "../src/lib/demo-job-assets";
import { priceWork } from "../src/lib/pricing";

type Actor = "sarah" | "mike" | "jack" | "aroha";
type DemoStatus = "REVIEW" | "PRICED" | "BOOKABLE" | "ASSIGNED" | "SUBMITTED" | "COMPLETED" | "CANCEL_REVIEW" | "CANCELLED";
type DemoFixture = {
  number: number;
  customer: "sarah" | "mike";
  category: "Electrical" | "Plumbing" | "Gas Fitting" | "Construction";
  status: DemoStatus;
  title: string;
  scope: string;
  suburb: string;
  ageDays: number;
  photos: DemoJobAssetId[];
  hours?: number;
  materials?: number;
  tradie?: "jack" | "aroha";
  pricingNote?: string;
  cancelReason?: string;
  estimates?: { by: "jack" | "aroha"; hours: number; materials: number; note: string }[];
  messages?: { by: Actor; body: string }[];
  extraWork?: { scope: string; hours: number; materials: number; photos: DemoJobAssetId[] };
};

// Stable reserved IDs support local QA and explicit demo-only presentation.
// These are fictional requests from the existing demo accounts, never imported real jobs.
// Other trades remain REVIEW while their verification/completion requirements are pending.
export const ADDITIONAL_DEMO_JOBS: readonly DemoFixture[] = [
  {
    number: 1101, customer: "sarah", category: "Electrical", status: "REVIEW", ageDays: 0.15, suburb: "Windsor",
    title: "Swap the lounge light for a new pendant",
    scope: "One existing ceiling fitting to replace with a customer-supplied pendant. Standard ceiling height, existing switch stays. Please check that the support is suitable for the fitting before installation.",
    photos: ["ceiling-light", "room-renovation"],
    estimates: [
      { by: "jack", hours: 2, materials: 22, note: "Allow for fixing, terminals, installation and testing. Customer supplies the pendant." },
      { by: "aroha", hours: 2.5, materials: 30, note: "Includes checking the ceiling support and making good around the rose." },
    ],
  },
  {
    number: 1102, customer: "sarah", category: "Plumbing", status: "REVIEW", ageDays: 0.35, suburb: "Waverley",
    title: "Kitchen mixer tap keeps dripping",
    scope: "The kitchen mixer drips after the handle is fully off. Hoping to repair the cartridge if possible, otherwise quote a replacement mixer. Cupboard beneath the sink is clear for access.",
    photos: ["kitchen-sink"],
  },
  {
    number: 1103, customer: "mike", category: "Gas Fitting", status: "REVIEW", ageDays: 0.6, suburb: "Gladstone",
    title: "Disconnect the old gas hob for kitchen work",
    scope: "Kitchen cabinets are being replaced next month. Need the existing hob safely disconnected and the supply made safe before the cabinet installer starts. Reconnection will be a separate scope after the new unit is chosen.",
    photos: ["kitchen-renovation", "room-renovation"],
  },
  {
    number: 1104, customer: "sarah", category: "Construction", status: "REVIEW", ageDays: 0.8, suburb: "Richmond",
    title: "Replace four worn boards on the back deck",
    scope: "Four boards beside the back step have worn edges. Please inspect the supporting timber and quote matching replacement boards and fixings. Deck is low to the ground with easy side access.",
    photos: ["timber-detail", "deck-patio"],
  },
  {
    number: 1105, customer: "sarah", category: "Electrical", status: "PRICED", ageDays: 2.3, suburb: "Waverley",
    title: "Motion light by the driveway",
    scope: "Replace an existing outdoor light with a sensor floodlight over the driveway. Existing cable is in place. Please aim it onto our drive and keep spill away from the neighbouring window.",
    photos: ["house-exterior", "roof-tiles"], hours: 2.5, materials: 145,
    pricingNote: "Includes one weather-rated sensor light, existing-point installation, aiming and testing. Subject to the existing cable being serviceable.",
  },
  {
    number: 1106, customer: "mike", category: "Electrical", status: "BOOKABLE", ageDays: 3.1, suburb: "Grasmere",
    title: "Two LED battens for the garage workshop",
    scope: "Replace two old fluorescent fittings in the garage with LED battens on the same switch. Clear space below each fitting and a standard-height ceiling. Old fittings to be taken away.",
    photos: ["room-renovation", "ceiling-light"], hours: 3, materials: 170,
    pricingNote: "Includes two LED battens, removal of the old fittings and testing of the existing circuit.",
  },
  {
    number: 1107, customer: "sarah", category: "Electrical", status: "ASSIGNED", ageDays: 7, suburb: "Windsor", tradie: "jack",
    title: "Light the side path and garden gate",
    scope: "Replace the side-door fitting and add one sensor light above the path to the gate. Cable can follow the accessible wall. Please keep the existing indoor switch for isolation.",
    photos: ["timber-fence", "house-exterior"], hours: 4, materials: 240,
    pricingNote: "Two weather-rated fittings, accessible surface cable route, testing and electrical documentation.",
    extraWork: { scope: "The old side-door fitting has left a larger opening than expected. Add a suitable weather-rated mounting block before installing the new light.", hours: 0.5, materials: 32, photos: ["house-exterior"] },
    messages: [
      { by: "sarah", body: "The side path is clear now. Could we check the sensor range together before you finish?" },
      { by: "jack", body: "Of course. I have allowed time to set the range and timer with you once both lights are fitted." },
      { by: "jack", body: "I have added a small mounting-block variation with the extra price. I will wait for approval before doing that part." },
    ],
  },
  {
    number: 1108, customer: "sarah", category: "Electrical", status: "SUBMITTED", ageDays: 9, suburb: "Waverley", tradie: "jack",
    title: "Replace the noisy bathroom extractor fan",
    scope: "Replace the bathroom fan using the existing ceiling opening and duct route. Check the exterior grille and run-on timer. A quieter model is preferred.",
    photos: ["bathroom-vanity", "ceiling-light"], hours: 3, materials: 195,
    pricingNote: "Includes a replacement extractor fan, minor duct connection adjustments and testing.",
    messages: [
      { by: "jack", body: "The fan replacement is finished. The timer runs for seven minutes after the light is switched off." },
      { by: "sarah", body: "Thanks, it is much quieter. I will check the airflow this evening and review the completion details." },
    ],
  },
  {
    number: 1109, customer: "sarah", category: "Electrical", status: "COMPLETED", ageDays: 23, suburb: "Richmond", tradie: "jack",
    title: "Warm LED lighting over the dining table",
    scope: "Install a customer-supplied dining pendant at the existing point and fit a compatible dimmer. Test the dimming range with the supplied LED lamp.",
    photos: ["ceiling-light", "kitchen-renovation"], hours: 2.5, materials: 95,
    pricingNote: "Customer supplies the pendant; price includes a compatible dimmer and electrical testing.",
    messages: [
      { by: "sarah", body: "The warm light is just right for the table. The dimmer is working well too." },
      { by: "jack", body: "Great to hear. The completion details and sample document are available in the job." },
    ],
  },
  {
    number: 1110, customer: "sarah", category: "Electrical", status: "CANCEL_REVIEW", ageDays: 6.5, suburb: "Waverley", tradie: "jack",
    title: "Extra power point in the spare room",
    scope: "Add one double power point beside the desk in the spare room, using the accessible underfloor route. Placement to be marked before the work starts.",
    photos: ["room-renovation"], hours: 3, materials: 80,
    cancelReason: "The desk layout has changed. Customer requested a pause before any site work while the scope is reviewed.",
    messages: [
      { by: "sarah", body: "Could you pause this please? We are moving the desk to another room and may not need this point." },
      { by: "jack", body: "I have paused the visit and have not started site work. Trade Marketplace can review the cancellation request." },
    ],
  },
  {
    number: 1111, customer: "sarah", category: "Electrical", status: "CANCELLED", ageDays: 15, suburb: "Richmond",
    title: "Power supply planning for a garden cabin",
    scope: "Initial request to assess a power supply route for a planned garden cabin. The cabin project has since been postponed, so the request was cancelled before pricing or payment.",
    photos: ["garden-shed", "house-exterior"], cancelReason: "Customer postponed the cabin project before pricing.",
  },
  {
    number: 1112, customer: "mike", category: "Plumbing", status: "REVIEW", ageDays: 1.2, suburb: "Gladstone",
    title: "Replace the bathroom basin waste",
    scope: "The basin waste is corroded and the plug no longer seals. Looking for a new pop-up waste and a check of the trap connection. Basin and vanity will stay in place.",
    photos: ["bathroom-vanity"],
  },
  {
    number: 1113, customer: "sarah", category: "Gas Fitting", status: "REVIEW", ageDays: 1.5, suburb: "Windsor",
    title: "Check the gas bayonet before winter",
    scope: "Would like the existing gas bayonet and appliance connection inspected before the portable heater is used again. Please confirm the appliance details needed before arranging a visit.",
    photos: ["house-exterior", "room-renovation"],
  },
  {
    number: 1114, customer: "mike", category: "Construction", status: "REVIEW", ageDays: 1.8, suburb: "Glengarry",
    title: "Side gate catches on the fence post",
    scope: "Timber side gate has dropped and rubs on the latch post. Please inspect the hinges and post, then quote a repair. We would prefer to keep the existing gate if it is sound.",
    photos: ["timber-fence", "timber-detail"],
  },
  {
    number: 1115, customer: "sarah", category: "Construction", status: "REVIEW", ageDays: 0.5, suburb: "Waikiwi",
    title: "Tidy the shed doorway and weatherboards",
    scope: "A small garden shed needs a door adjustment and two short weatherboard repairs near the threshold. Please inspect for any soft supporting timber before confirming the repair scope.",
    photos: ["garden-shed", "paint-roller"],
  },
  {
    number: 1116, customer: "sarah", category: "Electrical", status: "REVIEW", ageDays: 0.45, suburb: "Waverley",
    title: "Separate outlets for the laundry appliances",
    scope: "There is one double outlet behind the washer and dryer. Please assess adding another suitable point so each appliance can be plugged in without an extension lead. Switchboard and underfloor access available.",
    photos: ["kitchen-renovation", "room-renovation"],
    estimates: [{ by: "jack", hours: 4, materials: 145, note: "Initial estimate allows for an additional point and cable route. Confirm circuit loading and protection during assessment." }],
  },
  {
    number: 1117, customer: "mike", category: "Electrical", status: "PRICED", ageDays: 4.4, suburb: "Gladstone",
    title: "Bathroom heater replacement above the door",
    scope: "Replace an old wall heater with a new bathroom-rated unit at the same location. Existing pull switch and supply to be checked before fitting. The ceiling hatch is in the hallway.",
    photos: ["bathroom-vanity", "ceiling-light"], hours: 3.5, materials: 260,
    pricingNote: "Includes a bathroom-rated replacement heater, existing-point installation and safety testing.",
  },
  {
    number: 1118, customer: "sarah", category: "Electrical", status: "BOOKABLE", ageDays: 4, suburb: "Waikiwi",
    title: "A brighter work light in the garden shed",
    scope: "Replace the existing shed light with an LED batten and check the switch. The shed already has a power supply. Garden tools will be moved before the visit.",
    photos: ["garden-shed", "ceiling-light"], hours: 2, materials: 90,
    pricingNote: "Includes one LED batten, replacement at the existing point and circuit testing.",
  },
  {
    number: 1119, customer: "mike", category: "Electrical", status: "ASSIGNED", ageDays: 8, suburb: "Glengarry", tradie: "jack",
    title: "Hallway lights with a switch at each end",
    scope: "Replace two hallway light fittings and add two-way switching so the lights can be controlled from either end. Ceiling access is available; switch positions to be confirmed on arrival.",
    photos: ["ceiling-light", "room-renovation"], hours: 5, materials: 225,
    pricingNote: "Includes two LED fittings, two-way switching, accessible cable route and testing.",
    messages: [
      { by: "mike", body: "Tuesday afternoon works for us. The hallway has been cleared and the ceiling hatch is easy to reach." },
      { by: "jack", body: "Booked for 1 pm Tuesday. We can confirm the second switch height before I start." },
    ],
  },
  {
    number: 1120, customer: "sarah", category: "Electrical", status: "REVIEW", ageDays: 0.08, suburb: "Richmond",
    title: "Refresh the smoke alarms in our hallway",
    scope: "Three older smoke alarms need assessment and replacement. Please advise suitable locations and interconnection options after reviewing the layout. Single-storey home with an accessible ceiling hatch.",
    photos: ["house-exterior", "ceiling-light"],
  },
];

export async function seedAdditionalDemoJobs(
  db: PrismaClient,
  settings: Settings,
  actors: Record<Actor, { id: string }>,
) {
  const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000);
  const frozen = { tradieRateCents: settings.tradieRateCents, onCostPct: settings.onCostPct, marginPct: settings.marginPct, gstPct: settings.gstPct };

  for (const fixture of ADDITIONAL_DEMO_JOBS) {
    const cost = fixture.hours === undefined ? undefined : priceWork(fixture.hours, (fixture.materials ?? 0) * 100, settings);
    const isPaid = ["BOOKABLE", "ASSIGNED", "SUBMITTED", "COMPLETED", "CANCEL_REVIEW"].includes(fixture.status);
    const job = await db.job.create({
      data: {
        id: `demo-job-${fixture.number}`, jobNumber: fixture.number,
        customerId: actors[fixture.customer].id,
        tradieId: fixture.tradie ? actors[fixture.tradie].id : undefined,
        category: fixture.category, status: fixture.status, title: fixture.title,
        description: `DEMO JOB — fictional request; photographs are illustrative licensed stock images, not this property or evidence of this work. ${fixture.scope}`,
        region: "Southland", suburb: fixture.suburb,
        address: `${fixture.number - 1090} Example ${fixture.customer === "sarah" ? "Lane" : "Close"}`,
        createdAt: daysAgo(fixture.ageDays),
        ...(cost ? { ...frozen, hours: cost.hours, materialsCents: cost.materialsCents, priceCents: cost.totalCents, pricedAt: daysAgo(fixture.ageDays * 0.8), pricingNote: fixture.pricingNote } : {}),
        ...(isPaid ? { paidAt: daysAgo(fixture.ageDays * 0.6) } : {}),
        ...(fixture.tradie ? { assignedAt: daysAgo(fixture.ageDays * 0.5) } : {}),
        ...(fixture.status === "COMPLETED" ? { completedAt: daysAgo(fixture.ageDays * 0.25) } : {}),
        cancelReason: fixture.cancelReason,
        photos: { create: demoJobPhotoUrls(...fixture.photos).map((url) => ({ url })) },
      },
    });

    if (cost) {
      await db.payment.create({ data: {
        jobId: job.id, kind: "JOB", amountCents: cost.totalCents,
        status: isPaid ? "PAID" : "PENDING", createdAt: daysAgo(fixture.ageDays * 0.8),
        ...(isPaid ? { paidAt: daysAgo(fixture.ageDays * 0.6) } : {}),
      } });
    }
    if (fixture.estimates) {
      await db.estimate.createMany({ data: fixture.estimates.map((estimate, i) => ({
        jobId: job.id, tradieId: actors[estimate.by].id, hours: estimate.hours,
        materialsCents: estimate.materials * 100, note: estimate.note,
        createdAt: daysAgo(fixture.ageDays * (0.7 - i * 0.1)),
      })) });
    }
    if (fixture.messages) {
      await db.message.createMany({ data: fixture.messages.map((message, i) => ({
        jobId: job.id, senderId: actors[message.by].id, body: message.body,
        createdAt: daysAgo(fixture.ageDays * (0.4 - i * 0.05)),
      })) });
    }
    if (fixture.extraWork && fixture.tradie) {
      const extra = priceWork(fixture.extraWork.hours, fixture.extraWork.materials * 100, settings, { applyMinimum: false });
      const variation = await db.variation.create({ data: {
        jobId: job.id, tradieId: actors[fixture.tradie].id, status: "PRICED",
        description: `DEMO EXTRA WORK — illustrative stock image. ${fixture.extraWork.scope}`,
        hoursRequested: fixture.extraWork.hours, hours: extra.hours, materialsCents: extra.materialsCents,
        priceCents: extra.totalCents, createdAt: daysAgo(0.2),
        photos: { create: demoJobPhotoUrls(...fixture.extraWork.photos).map((url) => ({ url, jobId: job.id })) },
      } });
      await db.payment.create({ data: { jobId: job.id, variationId: variation.id, kind: "VARIATION", amountCents: extra.totalCents } });
    }
    if (["SUBMITTED", "COMPLETED"].includes(fixture.status) && cost && fixture.tradie) {
      // Keep the submitted example inside the real automatic-release window.
      // Completed examples retain their historical document date.
      const uploadedAt = fixture.status === "SUBMITTED"
        ? new Date(Date.now() - Math.min(1, settings.autoReleaseHours / 2) * 3_600_000)
        : daysAgo(fixture.ageDays * 0.3);
      await db.coc.create({ data: {
        jobId: job.id, cocNumber: `DEMO-NOT-A-CERTIFICATE-${fixture.number}`,
        fileUrl: "/demo/not-a-certificate.pdf", materialsSpentCents: Math.round(cost.materialsCents * 0.92),
        uploadedAt,
      } });
      if (fixture.status === "COMPLETED") {
        const pay = priceWork(cost.hours, 0, settings, { applyMinimum: false });
        await db.payout.create({ data: {
          jobId: job.id, tradieId: actors[fixture.tradie].id, hours: cost.hours, rateCents: settings.tradieRateCents,
          grossCents: pay.tradieGrossCents, holidayPayCents: pay.holidayPayCents, status: "PAID",
          createdAt: daysAgo(fixture.ageDays * 0.25), paidAt: daysAgo(fixture.ageDays * 0.2),
        } });
        await db.review.create({ data: {
          jobId: job.id, authorId: actors[fixture.customer].id, tradieId: actors[fixture.tradie].id,
          rating: 5, comment: "Demo review: clear arrival time, careful fitting and a tidy finish.", createdAt: daysAgo(fixture.ageDays * 0.15),
        } });
      }
    }
  }
}
