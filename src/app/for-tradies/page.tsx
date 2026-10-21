import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { hourlyView, priceWork } from "@/lib/pricing";
import { formatNZD } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ForTradiesPage() {
  const s = await getSettings();
  const h = hourlyView(s);
  return (
    <>
      <section className="bg-forest text-white"><div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr] md:px-6 md:py-20 lg:px-8">
        <div><p className="text-sm font-semibold uppercase tracking-widest text-lime">For registered electricians</p><h1 className="mt-5 text-[32px] font-bold leading-[40px] sm:text-[40px] sm:leading-[48px]">Good work.<br /><span className="text-lime">On clear terms.</span></h1><p className="mt-6 max-w-xl leading-7 text-white/80">Help estimate jobs, then choose the paid work you want to take. See the scope and gross earnings before you claim. Trade Marketplace manages the customer price.</p><Link href="/signup?role=TRADIE" className="btn-lime mt-8">Create an electrician account →</Link></div>
        <div className="self-center rounded-2xl bg-white p-6 text-ink sm:p-8"><p className="text-sm text-muted">Current configured gross hourly equivalent</p><p className="mt-3 text-4xl font-bold text-forest">{formatNZD(h.tradiePerHourCents)}<span className="text-base font-medium"> / hour</span></p><p className="mt-4 text-sm leading-6 text-muted">Includes {s.holidayPayPct}% holiday pay, before PAYE. Base rate {formatNZD(s.tradieRateCents)}. Minimum {s.minHours} priced hours per job.</p><div className="mt-5 border-t border-black/10 pt-5 text-sm leading-6">Illustrative prototype rates, not an employment offer. Review the earnings shown on each job.</div></div>
      </div></section>
      <section className="mx-auto max-w-[1200px] px-4 py-12 md:px-6 lg:px-8"><h2 className="text-2xl font-bold">Two different ways to participate.</h2><div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="card p-6"><span className="chip bg-lime text-forest">01 · Estimate</span><h3 className="mt-4 text-xl font-semibold">Help work out the scope.</h3><p className="mt-3 leading-7 text-muted">Send your hours and materials estimate privately. Other electricians cannot see it. TM currently reviews the estimates and sets the customer&apos;s fixed price.</p></article>
        <article className="card p-6"><span className="chip bg-lime text-forest">02 · Claim</span><h3 className="mt-4 text-xl font-semibold">Choose a paid job.</h3><p className="mt-3 leading-7 text-muted">Once paid, a job is available to eligible verified electricians. Check the work and gross earnings, then claim it. Estimating does not automatically assign the job to you.</p></article>
      </div><h2 className="mt-12 text-2xl font-bold">From claim to completion.</h2><ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
        ["Coordinate the visit", "After claiming, see the address and contact details. Use the job conversation to coordinate with the customer and TM."],
        ["Track your materials", "Use the job's TM reference and approved materials budget. Record actual spending when you submit the work."],
        ["Get changes approved", "Photograph extra work and request a variation. Wait for it to be priced and approved before doing that extra work."],
        ["Submit your CoC", "Upload the certificate and number. Completion approval queues the payout; queued and paid are separate states."],
      ].map(([title, detail], i) => <li key={title} className="card p-6"><p className="text-sm font-semibold text-muted">Step {i + 1}</p><h3 className="mt-2 font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted">{detail}</p></li>)}</ol>
      <div className="card mt-12 p-6 sm:p-8"><h2 className="text-2xl font-bold">See how the numbers work.</h2><p className="mt-2 text-sm text-muted">Illustrations using current settings. These are not quotes for specific jobs.</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{[2, 4, 8].map(hours => { const p = priceWork(hours, 0, s); return <div key={hours} className="rounded-xl bg-paper p-5"><p className="font-semibold">{p.hours} priced hours</p><p className="mt-3 text-2xl font-bold text-forest">{formatNZD(p.tradieTotalCents)}</p><p className="mt-1 text-sm text-muted">Gross incl. holiday pay, before PAYE</p><p className="mt-4 border-t border-black/10 pt-3 text-sm text-muted">Customer labour total: {formatNZD(p.totalCents)} incl. GST</p></div>; })}</div><p className="mt-5 text-sm leading-6 text-muted">Examples exclude materials. Materials, on-costs, TM margin and GST are included in the job&apos;s customer-price calculation where applicable.</p></div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-lime p-6 text-forest"><div className="max-w-2xl"><h2 className="text-xl font-bold">Start with your registration details.</h2><p className="mt-2 text-sm leading-6">Your registration must be checked before you can estimate or claim. If you are employed elsewhere, check that your agreement allows secondary work.</p></div><Link href="/signup?role=TRADIE" className="btn bg-forest text-white hover:bg-forest-2">Create account →</Link></div>
      <p className="mt-8 text-sm text-muted">Development preview: customer payments are simulated and payroll is currently a manual export. Automatic pricing and estimate-credit rules are planned, not active.</p></section>
    </>
  );
}
