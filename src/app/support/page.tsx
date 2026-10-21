import type { Metadata } from "next";
import { SupportPreview } from "./SupportPreview";

export const metadata: Metadata = {
  title: "Help & support",
  description: "Find answers about your account, jobs, quotes and payments.",
};

export default async function SupportPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return <SupportPreview initialTopic={topic === "sign-in" ? "Your account" : "Getting started"} />;
}
