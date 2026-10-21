import "server-only";
import { notFound } from "next/navigation";
import { canUseHostedPreview } from "@/lib/hosted-preview";
import { JourneySimulator } from "./JourneySimulator";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Explore a job journey",
  robots: { index: false, follow: false },
};

export default async function JourneyPage() {
  if (!(await canUseHostedPreview())) notFound();
  return <JourneySimulator />;
}
