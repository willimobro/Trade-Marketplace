import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { getCurrentUser } from "@/lib/session";
import "./globals.css";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
export const metadata: Metadata = {
  title: { default: "Trade Marketplace", template: "%s · Trade Marketplace" },
  description: "Describe your electrical job, receive a fixed price from Trade Marketplace, and connect with a verified electrician.",
};
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  return <html lang="en-NZ"><body className={`${poppins.variable} flex min-h-screen flex-col font-sans antialiased`}>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <Header user={user} />
    <div className="border-b border-border bg-white px-4 py-2 text-center text-xs text-muted">Development preview · Payments are simulated. No money is charged.</div>
    <div className={`mx-auto w-full flex-1 ${user ? "grid max-w-[1440px] lg:grid-cols-[264px_minmax(0,1fr)]" : ""}`}>
      {user && <aside className="hidden border-r border-forest-2 bg-forest p-6 text-white lg:block">
        <p className="mb-5 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-lime">{user.role === "ADMIN" ? "Team workspace" : user.role === "TRADIE" ? "Electrician workspace" : "Your workspace"}</p>
        <Navigation role={user.role} />
        <div className="mt-10 rounded-2xl border border-white/15 p-4 text-sm text-white/80"><p className="font-semibold text-white">One job. One clear price.</p><p className="mt-2">Private estimates help TM price the work. Paid jobs are available for verified electricians to claim.</p></div>
      </aside>}
      <main id="main-content" tabIndex={-1} className="min-w-0 outline-none">{children}</main>
    </div>
    <footer className="bg-forest text-white/80"><div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-4 py-6 text-xs sm:px-6"><span>© {new Date().getFullYear()} Trade Marketplace · Made in Invercargill</span><span>Electrical jobs, with a clear scope and fixed price from TM.</span></div></footer>
  </body></html>;
}
