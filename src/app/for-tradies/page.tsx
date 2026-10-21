import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { hourlyView, priceWork } from "@/lib/pricing";
import { formatNZD } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ForTradiesPage() {
  const s = await getSettings();
  const h = hourlyView(s);
  const examples = [
    ["Add a double plug", 2],
    ["3 downlights in a hallway", 3],
    ["Heat pump circuit", 4],
    ["Kitchen reno (gib off)", 8],
  ] as const;

  return (
    <>
      <section className="bg-forest text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
          <p className="chip bg-lime/15 text-lime">For registered electricians</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Side jobs at <span className="text-lime">{formatNZD(h.tradiePerHourCents)}/hr</span>. Zero paperwork.
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            We find the customer, set the price, take the payment and run your tax through payroll. You pick a job,
            charge materials to our Telfer account, do the work, upload the CoC and get paid.
          </p>
          <Link href="/signup?role=TRADIE" className="btn-lime mt-8 px-6 py-3 text-base">Sign up as a sparky</Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["💸", "Paid properly", `${formatNZD(s.tradieRateCents)}/hr + ${s.holidayPayPct}% holiday pay, minimum ${s.minHours} hrs per job. Your rate is set first - our cut never comes out of it.`],
            ["🧾", "Tax sorted", "Paid per job through payroll. Give us your tax code once - no GST returns, no invoices, no IR3 headaches."],
            ["🛡️", "No risk", "Customer pays before you turn up. Materials go on our account. Extra work is priced with photos and paid before you do it."],
          ].map(([icon, t, d]) => (
            <div key={t} className="card p-5">
              <p className="text-2xl" aria-hidden>{icon}</p>
              <p className="mt-2 font-semibold">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-xl font-bold">What you&apos;d earn</h2>
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.03] text-left text-xs text-muted">
              <tr>
                <th className="p-3 font-medium">Job</th>
                <th className="p-3 font-medium">Hours</th>
                <th className="p-3 text-right font-medium">You earn*</th>
                <th className="p-3 text-right font-medium">Customer pays**</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {examples.map(([name, hrs]) => {
                const p = priceWork(hrs, 0, s);
                return (
                  <tr key={name}>
                    <td className="p-3">{name}</td>
                    <td className="p-3">{p.hours}</td>
                    <td className="p-3 text-right font-semibold text-leaf-dark">{formatNZD(p.tradieTotalCents)}</td>
                    <td className="p-3 text-right text-muted">{formatNZD(p.totalCents)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">
          * Gross incl. holiday pay, before PAYE. ** Labour only, incl GST - materials are charged to the customer at cost on top.
        </p>

        <h2 className="mt-12 text-xl font-bold">How a job works</h2>
        <ol className="mt-4 space-y-3 text-sm">
          {[
            "Help price jobs: send a quick estimate (hours + materials) on jobs under review. Estimates are blind - nobody sees anyone else's.",
            "Claim a job: once the customer has paid, it shows on the board with exactly what you'll earn. First in gets it.",
            "Do the work: charge materials to the Trade Marketplace Telfer account under the job number (TM-1234).",
            "Something extra? Upload photos of the variation. We price it, the customer pays, then you carry on.",
            "Upload your CoC: once the customer confirms (or 48 hrs pass), your pay is queued for the next pay run.",
          ].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-leaf text-xs font-bold text-white">{i + 1}</span>
              <span className="pt-1">{t}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-xs text-muted">
          You need a current EWRB registration and practising licence - we check it before you can claim jobs. If you&apos;re
          employed elsewhere, check your employment agreement allows secondary work.
        </p>
      </section>
    </>
  );
}
