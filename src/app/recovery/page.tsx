import type { Metadata } from "next";
import { RecoveryFlow } from "./RecoveryFlow";
import { recoveryStage } from "./recovery-state";

export const metadata: Metadata = { title: "Reset your password" };

export default async function RecoveryPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <RecoveryFlow initialStage={recoveryStage(state)} />;
}
