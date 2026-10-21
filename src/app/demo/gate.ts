/** Host header only. Forwarded headers and suffix matches are deliberately excluded. */
export function allowsLocalDemo(enabled: string | undefined, host: string | null): boolean {
  if (enabled !== "1" || !host) return false;
  const match = /^(localhost|127\.0\.0\.1|\[::1\])(?::([0-9]{1,5}))?$/i.exec(host);
  if (!match) return false;
  return !match[2] || (Number(match[2]) >= 1 && Number(match[2]) <= 65535);
}
