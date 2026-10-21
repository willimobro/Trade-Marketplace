export type RecoveryStage = "request" | "sent" | "expired" | "invalid" | "reset" | "complete";

export const DEMO_EMAIL = "customer@example.com";
export const DEMO_PASSWORD = "TradeDemo!2026";

export function recoveryStage(value?: string): RecoveryStage {
  return value && ["request", "sent", "expired", "invalid", "reset", "complete"].includes(value)
    ? value as RecoveryStage
    : "request";
}

export function emailError(value: string): string | undefined {
  const email = value.trim();
  if (!email) return "Enter an example email address.";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Enter an email address in the format name@example.com.";
}

export function passwordRequirements(value: string) {
  return {
    length: value.length >= 8,
  };
}

export function resetErrors(password: string, confirmation: string) {
  const requirements = passwordRequirements(password);
  return {
    password: !password ? "Enter a made-up password to try the reset." : !Object.values(requirements).every(Boolean) ? "Use at least 8 characters." : undefined,
    confirmation: !confirmation ? "Enter your example password again." : confirmation !== password ? "Your passwords don’t match. Try again." : undefined,
  };
}
