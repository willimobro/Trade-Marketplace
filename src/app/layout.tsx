import { BrandMode } from "@/components/BrandMode";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { ConnectionNotice } from "@/components/ConnectionNotice";
import type { Metadata } from "next";
import { RouteFrame } from "@/components/RouteFrame";
import { SourceAppFrame } from "@/components/SourceAppFrame";
import { getCurrentUser } from "@/lib/session";
import { canUseHostedPreview } from "@/lib/hosted-preview";
import { headers } from "next/headers";
import { allowsLocalDemo } from "@/app/demo/gate";
import { allowsWorkspaceDemo } from "@/lib/workspace-mode/preference";
import { WorkspaceModeProvider } from "@/components/workspace-mode/WorkspaceMode";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Trade Marketplace", template: "%s · Trade Marketplace" },
  description: "Find help across the trades, describe your job and follow its progress with Trade Marketplace.",
};
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  const hostedPreview = await canUseHostedPreview();
  const workspaceDemo = allowsWorkspaceDemo(hostedPreview || allowsLocalDemo(process.env.TRADE_LOCAL_DEMO, (await headers()).get("host")), user);
  return <html lang="en-NZ" data-mode="customer"><body className="flex min-h-screen flex-col font-sans antialiased">
    <WorkspaceModeProvider key={user?.id ?? "guest"} userId={user?.id ?? null} role={user?.role ?? null} enabled={workspaceDemo}>
    <BrandMode role={user?.role ?? null}>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <ConnectionNotice />
    {hostedPreview && <aside className="bg-white px-4 py-2 text-right text-sm"><Link href="/preview" className="font-semibold underline">Switch preview role</Link></aside>}
    <DesktopNavigation role={user?.role ?? null} />
    <RouteFrame reference={children}>
      <SourceAppFrame role={user?.role ?? null}>{children}</SourceAppFrame>
    </RouteFrame>
    </BrandMode>
    </WorkspaceModeProvider>
  </body></html>;
}
