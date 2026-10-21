import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  const destination = user?.role === "ADMIN" ? "/admin" : user?.role === "TRADIE" ? "/jobs" : user ? "/jobs/new" : "/signup?role=CUSTOMER";
  const label = user?.role === "ADMIN" ? "Open operations" : user?.role === "TRADIE" ? "Explore the job board" : "Get a fixed price";
  return (
    <>
      <section className="overflow-hidden bg-forest text-white">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-6 md:py-20 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-lime">Trade Marketplace · Electrical first</p>
            <h1 className="mt-5 text-[32px] font-bold leading-[40px] sm:text-[40px] sm:leading-[48px]">Small jobs.<br />A clear price.<br /><span className="text-lime">A better way to get it done.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/80">Tell us what needs doing. Electricians send private estimates, then Trade Marketplace sets one fixed price for you to review.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={destination} className="btn-lime px-6">{label} <span aria-hidden>→</span></Link>
              <Link href="/for-tradies" className="btn border border-white/40 text-white hover:bg-white/10">I&apos;m an electrician</Link>
            </div>
            <p className="mt-4 text-sm text-white/70">Requesting a price is free. You decide whether to go ahead.</p>
          </div>
          <div className="relative rounded-[32px] bg-white/5 p-4 sm:p-8">
            <Image src="/brand/green-van.png" alt="Trade Marketplace's green van and electrician mascot" width={720} height={540} priority className="h-auto w-full object-contain" />
            <div className="relative mx-auto max-w-sm rounded-2xl bg-lime p-5 text-forest">
              <p className="font-semibold">Your job. One agreed scope.</p>
              <p className="mt-1 text-sm leading-6">Extra work is priced separately and needs your approval before it goes ahead.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1200px] px-4 py-12 md:px-6 lg:px-8">
        <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-widest text-muted">From request to done</p><h2 className="mt-3 text-2xl font-bold sm:text-3xl">Know what happens next.</h2></div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Describe the job", "Add photos and tell us about the space, access and work you need."],
            ["Review your fixed price", "Electricians estimate privately. TM reviews the scope and sends you one price."],
            ["Make it available to claim", "After payment, a verified electrician can claim the job. You can then coordinate the visit."],
            ["Review the completed work", "Your electrician uploads the Certificate of Compliance. Review the work and confirm completion."],
          ].map(([title, detail], i) => <li key={title} className="card p-6"><span className="grid h-10 w-10 place-items-center rounded-full bg-lime font-bold text-forest">{i + 1}</span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{detail}</p></li>)}
        </ol>
      </section>
      <section className="mx-auto grid max-w-[1200px] gap-6 px-4 pb-16 md:grid-cols-2 md:px-6 lg:px-8">
        <div className="card p-6 sm:p-8"><h2 className="text-2xl font-bold">A price you can review.</h2><p className="mt-4 leading-7 text-muted">See the scope and total before accepting. You won&apos;t need to choose between competing bids. If the work changes, you&apos;ll receive a separate variation to approve or decline.</p><Link href={destination} className="mt-6 inline-flex min-h-12 items-center font-semibold text-forest underline underline-offset-4">{label} →</Link></div>
        <div className="rounded-2xl bg-forest p-6 text-white sm:p-8"><p className="text-sm font-semibold text-lime">For electricians</p><h2 className="mt-2 text-2xl font-bold">Help price jobs.<br />Choose the work you take.</h2><p className="mt-4 leading-7 text-white/80">Submit blind estimates and browse paid jobs with the scope, materials budget and gross earnings shown before you claim.</p><Link href="/for-tradies" className="btn-lime mt-6">How it works for sparkies →</Link></div>
      </section>
      <div className="border-t border-black/10 bg-white px-4 py-5 text-center text-sm text-muted">Development preview: payments are simulated. This site is not accepting real payments.</div>
    </>
  );
}
