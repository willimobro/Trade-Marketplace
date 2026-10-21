import { DesktopNavigation } from "@/components/DesktopNavigation";
import { ConnectionNotice } from "@/components/ConnectionNotice";
import type { Metadata } from "next";
import { RouteFrame } from "@/components/RouteFrame";
import { SourceAppFrame } from "@/components/SourceAppFrame";
import { getCurrentUser } from "@/lib/session";
import { canUseHostedPreview } from "@/lib/hosted-preview";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Trade Marketplace", template: "%s · Trade Marketplace" },
  description: "Find help across the trades, describe your job and follow its progress with Trade Marketplace.",
};
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  const hostedPreview = await canUseHostedPreview();
  return <html lang="en-NZ" data-mode={user?.role === "TRADIE" ? "trade" : "customer"}><body className="flex min-h-screen flex-col font-sans antialiased">
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <ConnectionNotice />
    {hostedPreview && <aside className="bg-white px-4 py-2 text-right text-sm"><Link href="/preview" className="font-semibold underline">Switch preview role</Link></aside>}
    <DesktopNavigation role={user?.role ?? null} />
    <RouteFrame reference={children}>
      <SourceAppFrame role={user?.role ?? null}>{children}</SourceAppFrame>
    </RouteFrame>
  </body></html>;
}
