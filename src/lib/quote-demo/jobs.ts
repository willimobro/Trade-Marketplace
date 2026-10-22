import { DEMO_JOB_ASSETS, type DemoJobAssetId } from "../demo-job-assets";

function photo(...ids: DemoJobAssetId[]): { image: string; imageAlt: string; photos: { url: string; alt: string }[] } {
  const photos = ids.map((id) => {
    const asset = DEMO_JOB_ASSETS.find((item) => item.id === id)!;
    return { url: asset.url, alt: `Illustrative photo: ${asset.title.toLowerCase()}` };
  });
  return { image: photos[0].url, imageAlt: photos[0].alt, photos };
}

export const DEMO_TRADES = ["Electrical", "Plumbing", "Gas Fitting", "Construction"] as const;
export type DemoTrade = (typeof DEMO_TRADES)[number];
export type DemoJobDiscussion = { id: string; author: string; role: "Customer" | "Tradie"; body: string; posted: string };

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
  photos: { url: string; alt: string }[];
  customer: { name: string; property: string; availability: string };
  scope: string[];
  siteNotes: string[];
  quoteGuidance: string[];
  comments: DemoJobDiscussion[];
  timing: string;
  posted: string;
  stage: "quoting" | "available";
  priceCents?: number;
};

/** All jobs, locations and prices in this workspace are isolated sample data. */
const JOB_SUMMARIES: readonly Omit<DemoJob, "customer" | "scope" | "siteNotes" | "quoteGuidance" | "comments">[] = [
  {
    id: "demo-electrical-01", title: "A little more light in the kitchen", trade: "Electrical",
    suburb: "Grey Lynn", distance: "3.2 km", timing: "This week", posted: "Just added",
    description: "Replace three tired pendant lights over our kitchen island. The existing wiring and ceiling points are in place; we have the new fittings ready.",
    details: ["3 pendant lights", "Existing ceiling points", "Fittings supplied"],
    ...photo("ceiling-light", "kitchen-renovation", "house-exterior"), stage: "quoting",
  },
  {
    id: "demo-plumbing-01", title: "A tap that finally stops dripping", trade: "Plumbing",
    suburb: "Mount Eden", distance: "5.1 km", timing: "Flexible", posted: "25 min ago",
    description: "Our kitchen mixer has a slow drip and a stiff handle. Please quote to replace it with a new mixer; we would appreciate advice on a good everyday option.",
    details: ["1 kitchen mixer", "Easy under-sink access", "Supply + installation"],
    ...photo("kitchen-sink", "kitchen-renovation", "house-exterior"), stage: "quoting",
  },
  {
    id: "demo-construction-01", title: "Give the deck a fresh start", trade: "Construction",
    suburb: "Westmere", distance: "4.4 km", timing: "Next 2 weeks", posted: "40 min ago",
    description: "A few boards on our small back deck have weathered through. Replace the damaged boards and check the surrounding fixings. Access is down the side of the house.",
    details: ["Approx. 12 m² deck", "6–8 boards to replace", "Ground-level access"],
    ...photo("deck-patio", "timber-detail", "house-exterior"), stage: "quoting",
  },
  {
    id: "demo-gas-01", title: "Ready for a new gas hob", trade: "Gas Fitting",
    suburb: "Kingsland", distance: "3.8 km", timing: "This week", posted: "1 hr ago",
    description: "Swap our existing four-burner gas hob for a new unit in the same cut-out. The replacement is on site. Please include disconnection, connection and required checks.",
    details: ["Like-for-like hob", "Existing gas connection", "New hob supplied"],
    ...photo("kitchen-renovation", "kitchen-sink", "house-exterior"), stage: "quoting",
  },
  {
    id: "demo-electrical-02", title: "Power where we need it", trade: "Electrical",
    suburb: "Ponsonby", distance: "2.6 km", timing: "Next week", posted: "2 hrs ago",
    description: "Add two double power points to our home office. It is a single-level timber house, with accessible space beneath the floor and an existing socket on the same wall.",
    details: ["2 double power points", "Home office", "Under-floor access"],
    ...photo("room-renovation", "house-exterior", "timber-detail"), stage: "quoting",
  },
  {
    id: "demo-plumbing-02", title: "Sort the bathroom basin", trade: "Plumbing",
    suburb: "Sandringham", distance: "6.2 km", timing: "This week", posted: "3 hrs ago",
    description: "The bathroom basin drains slowly and there is a small leak at the waste fitting. Please inspect, clear the blockage and replace the waste seal if needed.",
    details: ["1 bathroom basin", "Slow drain + small leak", "Vanity access"],
    ...photo("bathroom-vanity", "kitchen-sink", "house-exterior"), stage: "quoting",
  },
  {
    id: "demo-construction-02", title: "A side gate that closes properly", trade: "Construction",
    suburb: "Point Chevalier", distance: "6.7 km", timing: "Flexible", posted: "4 hrs ago",
    description: "Our timber side gate has dropped and catches on the path. Repair or replace the hinges, adjust the gate and fit a new latch so it closes smoothly.",
    details: ["1 timber side gate", "Hinges + latch", "Approx. 1 m wide"],
    ...photo("timber-fence", "timber-detail", "house-exterior"), stage: "quoting",
  },
  {
    id: "demo-gas-02", title: "Time for a heater check", trade: "Gas Fitting",
    suburb: "Epsom", distance: "7.5 km", timing: "Next week", posted: "5 hrs ago",
    description: "Service and check our wall-mounted gas heater before winter. It is working, but has not been serviced recently. Please include a safety and ventilation check.",
    details: ["1 wall-mounted gas heater", "Routine service", "Safety checks"],
    ...photo("house-exterior", "room-renovation", "roof-tiles"), stage: "quoting",
  },
  {
    id: "demo-electrical-03", title: "Bathroom fan replacement", trade: "Electrical",
    suburb: "Mount Albert", distance: "6.4 km", timing: "Next week", posted: "Ready to claim",
    description: "Replace a noisy bathroom extractor with a new fan in the existing ceiling position. The scope and sample fixed price have been reviewed.",
    details: ["1 extractor fan", "Existing ducting", "Supply + installation"],
    ...photo("bathroom-vanity", "ceiling-light", "house-exterior"), stage: "available", priceCents: 34500,
  },
  {
    id: "demo-plumbing-03", title: "Replace the laundry tub", trade: "Plumbing",
    suburb: "Avondale", distance: "8.1 km", timing: "Next 2 weeks", posted: "Ready to claim",
    description: "Remove an old laundry tub and connect the supplied replacement to the existing water and waste. The scope and sample fixed price have been reviewed.",
    details: ["1 laundry tub", "Replacement supplied", "Existing connections"],
    ...photo("kitchen-sink", "room-renovation", "house-exterior"), stage: "available", priceCents: 42000,
  },
  {
    id: "demo-construction-03", title: "New shelves for the study", trade: "Construction",
    suburb: "Newmarket", distance: "5.8 km", timing: "Flexible", posted: "Ready to claim",
    description: "Install three supplied timber floating shelves on a stud wall in our study. The scope and sample fixed price have been reviewed.",
    details: ["3 floating shelves", "Shelves supplied", "Stud wall"],
    ...photo("timber-detail", "room-renovation", "house-exterior"), stage: "available", priceCents: 28500,
  },
  {
    id: "demo-gas-03", title: "Connect the new gas cooker", trade: "Gas Fitting",
    suburb: "Onehunga", distance: "10.2 km", timing: "This week", posted: "Ready to claim",
    description: "Connect a replacement freestanding gas cooker at an existing connection and complete required checks. The scope and sample fixed price have been reviewed.",
    details: ["1 freestanding cooker", "Existing gas point", "Cooker supplied"],
    ...photo("kitchen-renovation", "kitchen-sink", "house-exterior"), stage: "available", priceCents: 36000,
  },
];

type JobDetail = Pick<DemoJob, "customer" | "scope" | "siteNotes" | "quoteGuidance" | "comments">;

const JOB_DETAILS: Record<string, JobDetail> = {
  "demo-electrical-01": {
    customer: { name: "Mia R.", property: "Owner-occupied, single-level bungalow", availability: "Tuesday or Thursday, 9 am–2 pm; please suggest a 2-hour arrival window." },
    scope: ["Remove and dispose of the three existing pendants above a 2.4 m kitchen island.", "Install three customer-supplied pendant fittings at the existing ceiling points; agree the drop height before installation.", "Check the existing switch and dimmer are compatible with the new fittings, and test the completed installation.", "Include making the work area tidy and the applicable electrical certification in your scope."],
    siteNotes: ["Ceiling height is approximately 2.7 m. The kitchen island cannot be moved.", "There is a driveway space for a van and level access through the front door.", "Fittings are boxed on site. No new wiring routes or ceiling repairs are requested."],
    quoteGuidance: ["Separate labour and any small consumables; the pendant fittings are already supplied.", "State whether a compatible dimmer is included or priced as an option.", "Flag any assumptions that would need checking on a site visit."],
    comments: [
      { id: "light-q-1", author: "Alex · sample tradie", role: "Tradie", body: "Are the new pendants dimmable, and are the existing ceiling points staying in the same positions?", posted: "20 min ago" },
      { id: "light-a-1", author: "Mia R.", role: "Customer", body: "Yes to both. The fittings use dimmable LED bulbs and the three points are already evenly spaced. We can share the model label before the visit.", posted: "12 min ago" },
      { id: "light-a-2", author: "Mia R.", role: "Customer", body: "Please allow for taking away the old fittings. We would like the pendants at the same height as each other.", posted: "8 min ago" },
    ],
  },
  "demo-plumbing-01": {
    customer: { name: "Sam T.", property: "Owner-occupied townhouse, ground-floor kitchen", availability: "Weekday mornings before noon, or Friday after 2 pm." },
    scope: ["Inspect the existing single-hole kitchen mixer and confirm the replacement connection sizes.", "Supply a durable chrome mixer with a standard spout; please include a product option and warranty information.", "Remove the existing mixer, fit the replacement and reconnect to the existing isolation valves.", "Check hot and cold operation, test for leaks and take away the old tap and packaging."],
    siteNotes: ["The under-sink cupboard will be emptied before arrival; the waste unit can stay in place.", "The customer reports working hot and cold isolation valves beneath the sink.", "Visitor parking is at the front of the building, with no stairs to the kitchen."],
    quoteGuidance: ["Show the mixer supply allowance separately from labour.", "State any allowance for replacement hoses or valves if the existing parts are unsuitable.", "An inspection can be arranged if a firm quote requires measurements."],
    comments: [
      { id: "mixer-q-1", author: "Jordan · sample tradie", role: "Tradie", body: "Is this a standard single-hole mixer, and would you prefer a pull-out spray?", posted: "35 min ago" },
      { id: "mixer-a-1", author: "Sam T.", role: "Customer", body: "A standard single-hole mixer, please. A fixed spout is fine; easy maintenance matters more than extra features.", posted: "28 min ago" },
    ],
  },
  "demo-construction-01": {
    customer: { name: "Hannah W.", property: "Single-level timber home with rear deck", availability: "Any weekday after 9 am. Someone can be home for a site measure." },
    scope: ["Inspect an approximately 12 m² ground-level deck and identify the damaged boards and loose fixings.", "Allow for replacing 6–8 boards, each approximately 2.4 m long, with a close match to the existing timber.", "Check the exposed support and adjacent fixings while boards are removed; quote additional structural work separately.", "Remove old boards and debris and leave edges and fixings safe. Whole-deck sanding or staining is outside the requested scope."],
    siteNotes: ["Access is via a 900 mm side path. There are no stairs to the work area.", "The deck is approximately 300 mm above the ground, with outdoor power available.", "The customer can move the outdoor furniture before work begins."],
    quoteGuidance: ["Include timber, fixings, labour and removal of the damaged boards.", "Confirm the timber profile and condition of the support before ordering materials.", "List staining or finishing as an optional extra if recommended."],
    comments: [
      { id: "deck-q-1", author: "Casey · sample tradie", role: "Tradie", body: "Is it only the boards that need attention, or have you noticed movement in the deck framing?", posted: "50 min ago" },
      { id: "deck-a-1", author: "Hannah W.", role: "Customer", body: "It feels firm underfoot, but two boards have soft ends and several are splitting. Please check the support once those boards are up.", posted: "42 min ago" },
      { id: "deck-a-2", author: "Hannah W.", role: "Customer", body: "We are happy with a close timber match. We plan to stain the whole deck ourselves later.", posted: "37 min ago" },
    ],
  },
  "demo-gas-01": {
    customer: { name: "Oliver P.", property: "Owner-occupied villa, renovated kitchen", availability: "Wednesday or Friday from 10 am. Please allow time for a handover." },
    scope: ["Disconnect and remove the existing four-burner gas hob.", "Fit a customer-supplied replacement into the existing benchtop cut-out; confirm dimensions before the visit.", "Connect to the existing gas supply, complete the required checks and provide the applicable certification.", "Demonstrate operation and leave the work area tidy. Benchtop alterations are not included in the requested work."],
    siteNotes: ["The customer reports a natural-gas connection and an accessible shut-off valve in the cupboard below.", "The new hob is boxed on site; installation instructions and model details are available.", "There is driveway parking. The kitchen is on the ground floor."],
    quoteGuidance: ["Include standard connection parts, testing and certification in the quote.", "Confirm supply type, model compatibility and clearance requirements before agreeing a fixed scope.", "Identify any exclusion for benchtop, cabinetry or electrical work."],
    comments: [
      { id: "hob-q-1", author: "Taylor · sample tradie", role: "Tradie", body: "Can you confirm the gas supply and whether the new model fits the existing cut-out?", posted: "1 hr ago" },
      { id: "hob-a-1", author: "Oliver P.", role: "Customer", body: "It is mains natural gas. The retailer confirmed the same cut-out dimensions, and we have both model numbers ready for you to check.", posted: "52 min ago" },
    ],
  },
  "demo-electrical-02": {
    customer: { name: "Aroha K.", property: "Single-level timber house, spare-room office", availability: "Monday or Wednesday, 8:30 am–3 pm. Desk equipment can be unplugged." },
    scope: ["Add two white double power points to the home office, approximately 2 m and 4 m from the existing socket.", "Locate the outlets above the skirting; agree exact positions before work starts.", "Assess the existing circuit and protection, run wiring through the accessible under-floor space and test the finished work.", "Include faceplates, standard materials and applicable certification. Quote any required circuit upgrade separately."],
    siteNotes: ["The subfloor hatch is outside beside the office wall; the customer reports approximately 700 mm clearance.", "The room is approximately 3 m × 3.5 m. Desks will be moved clear of the wall.", "A driveway space and an external power outlet are available."],
    quoteGuidance: ["Include a clear assumption about the existing circuit capacity and access.", "State whether patching or painting is excluded if unexpected wall access is needed.", "Give an indicative time on site and any planned power interruption."],
    comments: [
      { id: "power-q-1", author: "Alex · sample tradie", role: "Tradie", body: "Will both points serve normal office equipment, or is there a heater or other high-load appliance?", posted: "2 hrs ago" },
      { id: "power-a-1", author: "Aroha K.", role: "Customer", body: "Two monitors, a laptop dock and a printer. We do not plan to use an electric heater on these points.", posted: "1 hr ago" },
    ],
  },
  "demo-plumbing-02": {
    customer: { name: "Jess M.", property: "Owner-occupied unit, ground-floor bathroom", availability: "Tuesday–Thursday after 1 pm; the bathroom is available throughout the visit." },
    scope: ["Inspect a slow-draining bathroom basin and a small leak around the waste fitting.", "Clear and clean the accessible trap and basin waste; test the flow after reassembly.", "Replace the waste seal or standard fitting as needed and check for leaks under normal use.", "Explain any further work if the blockage is beyond the accessible pipework. Wall or floor opening is outside this initial scope."],
    siteNotes: ["The trap is accessible inside a two-door vanity cupboard, which will be emptied.", "No other fixtures are reported to be draining slowly.", "Parking is on the street. The front entrance has two shallow steps."],
    quoteGuidance: ["Include a call-out, labour and standard seal allowance.", "State what is included for clearing the accessible waste and what would require a follow-up quote.", "Please give an arrival window and an estimated visit length."],
    comments: [
      { id: "basin-q-1", author: "Jordan · sample tradie", role: "Tradie", body: "Is the leak continuous or only when the basin is emptied? Have any other drains slowed down?", posted: "3 hrs ago" },
      { id: "basin-a-1", author: "Jess M.", role: "Customer", body: "Only when the basin empties. We have put a bowl below the waste. The shower and kitchen drains are working normally.", posted: "2 hrs ago" },
    ],
  },
  "demo-construction-02": {
    customer: { name: "Ben L.", property: "Detached house with timber side gate", availability: "Flexible weekdays, with the dog kept inside during the visit." },
    scope: ["Assess a timber gate approximately 1 m wide × 1.8 m high that is catching on the concrete path.", "Rehang and adjust the gate; allow for replacing the two hinges and fitting a weather-resistant latch.", "Check the gate and post fixings and leave the latch easy to operate from both sides.", "A replacement gate or post can be quoted as an option if repair is not practical."],
    siteNotes: ["Access is directly from the driveway. Both faces of the gate are accessible.", "The existing posts appear upright; the customer has not checked below ground.", "There is power outside and room to work beside the gate."],
    quoteGuidance: ["Separate the repair price from any optional replacement work.", "Include hinges, latch, fixings and disposal of replaced hardware.", "Explain any assumption about the condition of the existing timber and posts."],
    comments: [
      { id: "gate-q-1", author: "Casey · sample tradie", role: "Tradie", body: "Has the post moved, or is the gate sagging on the hinges?", posted: "4 hrs ago" },
      { id: "gate-a-1", author: "Ben L.", role: "Customer", body: "The post looks straight. The top hinge screws are loose and the far corner of the gate drags. A repair would be our first choice.", posted: "3 hrs ago" },
    ],
  },
  "demo-gas-02": {
    customer: { name: "Priya S.", property: "Owner-occupied single-level home", availability: "Weekday mornings; please allow time to explain the service findings." },
    scope: ["Service one wall-mounted gas heater in the living room according to the applicable manufacturer requirements.", "Inspect accessible components, ventilation and flue condition and complete the required safety checks.", "Clean and test the unit, report findings and explain any recommended follow-up work.", "Replacement parts or repairs beyond a routine service should be quoted before proceeding."],
    siteNotes: ["The heater is operating but its last service date is unknown.", "The model plate is accessible and can be checked before booking.", "There is clear working space in front of the heater and driveway parking."],
    quoteGuidance: ["Include the routine service, testing and a written record of findings.", "State whether your quote includes a call-out and any standard consumables.", "Confirm the model and gas type before finalising the service scope."],
    comments: [
      { id: "heater-q-1", author: "Taylor · sample tradie", role: "Tradie", body: "Are there any faults or unusual smells, and can you provide the make and model?", posted: "5 hrs ago" },
      { id: "heater-a-1", author: "Priya S.", role: "Customer", body: "No faults or smells that we have noticed. This is a routine service before we use it more often. We can send the model details before arranging a visit.", posted: "4 hrs ago" },
    ],
  },
  "demo-electrical-03": {
    customer: { name: "Max D.", property: "Single-level home with ceiling access", availability: "Next week, Tuesday–Friday between 9 am and 3 pm." },
    scope: ["Remove the noisy ceiling-mounted bathroom extractor and supply a like-for-like replacement.", "Reuse the existing ducting and exterior outlet after confirming they are serviceable.", "Reconnect at the existing position, test operation and include applicable electrical certification.", "Dispose of the old fan and packaging. New duct routes, painting and ceiling repairs are outside this fixed sample scope."],
    siteNotes: ["The customer reports a 150 mm duct and a standard switched connection.", "The ceiling hatch is in the hallway, with approximately 2.4 m ceilings.", "The bathroom will be clear for the visit; a driveway space is available."],
    quoteGuidance: ["The sample fixed price includes a standard fan, labour, consumables and testing.", "Review the described access and replacement assumptions before using points to claim.", "Any change discovered on site would need to be agreed before additional work."],
    comments: [
      { id: "fan-q-1", author: "Alex · sample tradie", role: "Tradie", body: "Does the fan run from the light switch or a separate switch?", posted: "Yesterday" },
      { id: "fan-a-1", author: "Max D.", role: "Customer", body: "It has a separate wall switch. The existing duct goes straight to an outside grille; we would like the same setup.", posted: "Yesterday" },
    ],
  },
  "demo-plumbing-03": {
    customer: { name: "Leah N.", property: "Ground-floor laundry in a detached house", availability: "Monday, Thursday or Friday; an adult can be home all morning." },
    scope: ["Disconnect and remove the existing freestanding laundry tub.", "Position and connect the customer-supplied replacement to existing hot, cold and waste connections.", "Use standard connection parts, secure the tub as required and test for leaks and drainage.", "Remove the old tub and packaging. New pipe routes or flooring alterations are outside the sample fixed scope."],
    siteNotes: ["The replacement tub is assembled on site and is approximately the same width as the old one.", "The external laundry door provides level access directly from the driveway.", "The washing machine can be moved clear before arrival."],
    quoteGuidance: ["The sample fixed price includes labour, standard connection parts and removal.", "The customer supplies the tub and mixer; confirm compatibility before the visit.", "Please flag any mismatch with the existing waste position before starting work."],
    comments: [
      { id: "tub-q-1", author: "Jordan · sample tradie", role: "Tradie", body: "Does the supplied tub include its mixer and waste kit?", posted: "Yesterday" },
      { id: "tub-a-1", author: "Leah N.", role: "Customer", body: "Yes, both are in the box. The laundry will be cleared and the washing machine moved to make room.", posted: "Yesterday" },
    ],
  },
  "demo-construction-03": {
    customer: { name: "Theo C.", property: "Apartment study with timber stud wall", availability: "Weekdays, 10 am–4 pm. Lift access can be arranged." },
    scope: ["Install three customer-supplied floating timber shelves, each approximately 900 mm wide.", "Agree the layout and spacing and locate suitable fixing positions in the study wall.", "Fit the supplied brackets with suitable fixings, level each shelf and explain the supported load.", "Leave the area tidy. Painting, wall repair and custom shelving fabrication are outside this sample fixed scope."],
    siteNotes: ["The customer reports a plasterboard wall over timber studs.", "Shelves and concealed brackets are boxed on site, with installation instructions.", "There is lift access from visitor parking; the study desk will be moved."],
    quoteGuidance: ["The sample fixed price includes labour and standard fixings.", "Confirm the bracket design, stud positions and intended load before installation.", "Discuss a suitable alternative if the supplied brackets cannot be fixed safely."],
    comments: [
      { id: "shelf-q-1", author: "Casey · sample tradie", role: "Tradie", body: "What will the shelves hold, and are the concealed brackets supplied?", posted: "Yesterday" },
      { id: "shelf-a-1", author: "Theo C.", role: "Customer", body: "A few small plants and framed photos. The brackets came with the shelves. We can be flexible on the spacing to suit the studs.", posted: "Yesterday" },
    ],
  },
  "demo-gas-03": {
    customer: { name: "Grace F.", property: "Single-level home, ground-floor kitchen", availability: "This week, Wednesday or Thursday after 10 am." },
    scope: ["Disconnect the old freestanding cooker and connect the customer-supplied replacement at the existing gas point.", "Check the new cooker matches the gas supply and confirm required clearances and restraints.", "Complete the required connection, operation and safety checks, provide applicable certification and demonstrate use.", "The customer will arrange removal of the old cooker. Gas-line relocation and cabinetry work are outside this sample fixed scope."],
    siteNotes: ["The cooker is delivered and unpacked in the kitchen; model information is available.", "The customer reports an existing accessible isolation valve and level kitchen access.", "There is driveway parking and room to move the appliances safely."],
    quoteGuidance: ["The sample fixed price includes labour, standard connection materials, checks and certification.", "Confirm gas type, appliance compatibility and site clearances before work.", "Flag any additional connection or restraint requirements before proceeding."],
    comments: [
      { id: "cooker-q-1", author: "Taylor · sample tradie", role: "Tradie", body: "Will the old cooker need to be taken away as part of the visit?", posted: "Yesterday" },
      { id: "cooker-a-1", author: "Grace F.", role: "Customer", body: "No, we have booked a separate collection. We need the disconnection, new connection and checks only.", posted: "Yesterday" },
    ],
  },
};

export const DEMO_JOBS: readonly DemoJob[] = JOB_SUMMARIES.map((job) => ({ ...job, ...JOB_DETAILS[job.id] }));

export function demoTrade(trade: string | null): DemoTrade | null {
  return DEMO_TRADES.find((item) => item.toLowerCase() === trade?.toLowerCase()) ?? null;
}

export function findDemoJob(id: string): DemoJob | undefined {
  return DEMO_JOBS.find((job) => job.id === id);
}

export function formatDemoMoney(cents: number): string {
  return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD", maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
}

