/** Only electrical verification and completion requirements are configured. */
export function tradeRequirementsPending(trade: string | null): boolean {
  return trade !== "Electrical";
}

export function getTradeActionBlocker(
  user: { trade: string | null; licenceVerified: boolean },
  category: string,
): string | null {
  if (!user.trade) return "Choose your trade before estimating or claiming jobs.";
  if (user.trade !== category) return "Your registered trade must match the job category to estimate or claim it.";
  if (tradeRequirementsPending(category)) return "Verification and completion requirements for this trade are not configured yet. Estimating and claiming are not available.";
  if (!user.licenceVerified) return "Your electrical licence needs to be verified first.";
  return null;
}
