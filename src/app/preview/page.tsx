import "server-only";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPasswordSession } from "@/lib/password-session";
import { canUseHostedPreview } from "@/lib/hosted-preview";
import { previewAccount } from "../../../scripts/preview-identity.mjs";
import { PreviewRoles, type PreviewRoleState } from "./PreviewRoles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Choose preview role", robots: { index: false, follow: false } };

async function requireHostedPreview() {
  if (!(await canUseHostedPreview())) notFound();
}

async function chooseRole(_previous: PreviewRoleState, form: FormData): Promise<PreviewRoleState> {
  "use server";
  await requireHostedPreview();
  const account = previewAccount(form.get("role"));
  if (!account) return { error: "Choose one of the listed preview roles." };
  const password = process.env.PREVIEW_ACCOUNT_PASSWORD;
  if (!password || password.length < 32) return { error: "Preview accounts are unavailable." };
  if (!(await createPasswordSession(account.email, password))) return { error: "Preview accounts are unavailable." };
  // Let the browser open the destination. Next's server-action redirect tries
  // an HTTPS self-fetch against the custom server's HTTP listener behind Render.
  return { destination: account.next };
}

export default async function PreviewPage() {
  await requireHostedPreview();
  return <section className="mx-auto max-w-sm space-y-6 px-6 py-8">
    <h1 className="text-2xl font-semibold">Choose a preview role</h1>
    <p className="text-sm">Explore the app with sample data. Switching roles changes your current preview session. Payments are simulated and changes reset when the preview restarts.</p>
    <PreviewRoles action={chooseRole} />
    <div className="border-t border-line pt-6"><h2 className="text-xl font-semibold">Explore every trade</h2><p className="mt-3 text-sm text-muted">Try a complete sample job from first estimate to review.</p><Link href="/preview/journey" className="btn-primary mt-4">Open sample journey</Link></div>
  </section>;
}
