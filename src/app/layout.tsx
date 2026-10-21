import { DesktopNavigation } from "@/components/DesktopNavigation";
import { ConnectionNotice } from "@/components/ConnectionNotice";
import type { Metadata } from "next";
import { RouteFrame } from "@/components/RouteFrame";
import { SourceAppFrame } from "@/components/SourceAppFrame";
import { getCurrentUser } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Trade Marketplace", template: "%s · Trade Marketplace" },
  description: "Describe your electrical job, receive a fixed price from Trade Marketplace, and connect with a verified electrician.",
};
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  return <html lang="en-NZ"><body className="flex min-h-screen flex-col font-sans antialiased">
    <ConnectionNotice />
    <DesktopNavigation role={user?.role ?? null} />
    <RouteFrame reference={children}>
      <SourceAppFrame role={user?.role ?? null}>{children}</SourceAppFrame>
    </RouteFrame>
  </body></html>;
}
