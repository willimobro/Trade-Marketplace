import "server-only";
import { notFound } from "next/navigation";
import { login } from "@/app/actions/auth";
import type { FormState } from "@/app/actions/types";
import { canUseHostedPreview } from "@/lib/hosted-preview";
import { previewAccount } from "../../../scripts/preview-identity.mjs";
import { PreviewRoles } from "./PreviewRoles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Choose preview role", robots: { index: false, follow: false } };

async function requireHostedPreview() {
  if (!(await canUseHostedPreview())) notFound();
}

async function chooseRole(_previous: FormState, form: FormData): Promise<FormState> {
  "use server";
  await requireHostedPreview();
  const account = previewAccount(form.get("role"));
  if (!account) return { error: "Choose one of the listed preview roles." };
  const password = process.env.PREVIEW_ACCOUNT_PASSWORD;
  if (!password || password.length < 32) return { error: "Preview accounts are unavailable." };
  const credentials = new FormData();
  credentials.set("email", account.email);
  credentials.set("password", password);
  credentials.set("next", account.next);
  // Use the unchanged password verification, authorization and session flow.
  return login(undefined, credentials);
}

export default async function PreviewPage() {
  await requireHostedPreview();
  return <section className="mx-auto max-w-sm space-y-6 px-6 py-8">
    <h1 className="text-2xl font-semibold">Choose a preview role</h1>
    <p className="text-sm">Explore the app with sample data. Switching roles changes your current preview session. Payments are simulated and changes reset when the preview restarts.</p>
    <PreviewRoles action={chooseRole} />
  </section>;
}
