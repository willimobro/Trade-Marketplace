import "server-only";
import { headers } from "next/headers";
import { hasPreviewIdentity, PREVIEW_ASSERTION_HEADER } from "../../scripts/preview-identity.mjs";

export async function canUseHostedPreview() {
  const requestHeaders = await headers();
  return hasPreviewIdentity(process.env.TRADE_HOSTED_PREVIEW, requestHeaders.get(PREVIEW_ASSERTION_HEADER));
}
