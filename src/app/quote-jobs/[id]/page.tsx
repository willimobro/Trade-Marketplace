import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { allowsLocalDemo } from "@/app/demo/gate";
import { QuoteJobDetail } from "@/components/quote-detail/QuoteJobDetail";
import { DashboardMobileNavigation } from "@/components/DashboardMobileNavigation";
import { quoteDetailBackHref, type QuoteDetailOrigin } from "@/components/quote-detail/navigation";
import { canUseHostedPreview } from "@/lib/hosted-preview";
import { allowsWorkspaceDemo } from "@/lib/workspace-mode/preference";
import { findDemoJob } from "@/lib/quote-demo/jobs";
import { requireUser } from "@/lib/session";
import { TradeModeView } from "@/components/workspace-mode/TradeModeView";

export const dynamic = "force-dynamic";

export default async function QuoteJobPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<QuoteDetailOrigin> }) {
  const { id } = await params;
  const user = await requireUser(`/quote-jobs/${id}`);
  const runtimeAllowed = await canUseHostedPreview() || allowsLocalDemo(process.env.TRADE_LOCAL_DEMO, (await headers()).get("host"));
  if (!allowsWorkspaceDemo(runtimeAllowed, user)) notFound();
  const job = findDemoJob(id);
  if (!job) notFound();
  return <><TradeModeView><QuoteJobDetail key={`${user.id}:${job.id}`} userId={user.id} job={job} backHref={quoteDetailBackHref(await searchParams)} /></TradeModeView><DashboardMobileNavigation customer={false} /></>;
}
