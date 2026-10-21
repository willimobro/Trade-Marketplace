import { createHash, timingSafeEqual } from "node:crypto";
import { PREVIEW_ASSERTION_HEADER } from "./preview-identity.mjs";

export function requirePreviewSecrets(env) {
  const keys = ["PREVIEW_ACCESS_PASSWORD", "PREVIEW_ACCOUNT_PASSWORD", "SESSION_SECRET"];
  for (const key of keys) {
    if (typeof env[key] !== "string" || env[key].length < 32)
      throw new Error(key + " must be supplied as a secret of at least 32 characters");
  }
  if (new Set(keys.map(key => env[key])).size !== keys.length)
    throw new Error("Preview secrets must be distinct");
}

export function authorized(header, password) {
  if (typeof header !== "string" || !header.startsWith("Basic ") || !password) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const hash = value => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(decoded), hash("preview:" + password));
}

// Runs outside Next: even framework assets, uploads, actions and internal headers
// cannot skip this check. Only a constant health response is public.
export function protectPreview(handler, password, bootAssertion) {
  return async (req, res) => {
    // Never trust an assertion supplied by an HTTP client, even an authenticated one.
    for (const key of Object.keys(req.headers))
      if (key.toLowerCase() === PREVIEW_ASSERTION_HEADER) delete req.headers[key];
    if (req.rawHeaders) {
      const filtered = [];
      for (let i = 0; i < req.rawHeaders.length; i += 2)
        if (String(req.rawHeaders[i]).toLowerCase() !== PREVIEW_ASSERTION_HEADER)
          filtered.push(req.rawHeaders[i], req.rawHeaders[i + 1]);
      req.rawHeaders = filtered;
    }
    const writeHead = res.writeHead.bind(res);
    res.writeHead = (...args) => {
      const index = typeof args[1] === "string" ? 2 : 1;
      const headers = args[index];
      // Next may set public caching on assets/uploads. Enforce private caching
      // at final header emission as well as at entry.
      if (Array.isArray(headers)) {
        const filtered = [];
        for (let i = 0; i < headers.length; i += 2)
          if (String(headers[i]).toLowerCase() !== "cache-control") filtered.push(headers[i], headers[i + 1]);
        args[index] = [...filtered, "Cache-Control", "private, no-store"];
      } else if (headers) {
        args[index] = Object.fromEntries(Object.entries(headers).filter(([key]) => key.toLowerCase() !== "cache-control"));
        args[index]["Cache-Control"] = "private, no-store";
      }
      res.setHeader("Cache-Control", "private, no-store");
      return writeHead(...args);
    };
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    if (req.url === "/preview-health" && (req.method === "GET" || req.method === "HEAD")) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("ok");
      return;
    }
    if (!authorized(req.headers.authorization, password)) {
      res.writeHead(401, { "WWW-Authenticate": 'Basic realm="Trade Marketplace private preview", charset="UTF-8"', "Content-Type": "text/plain" });
      res.end("Private preview. Sign in with the preview access credentials.");
      return;
    }
    // The gate credential is not an application credential.
    delete req.headers.authorization;
    if (bootAssertion) req.headers[PREVIEW_ASSERTION_HEADER] = bootAssertion;
    try {
      await handler(req, res);
    } catch {
      if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Preview request failed.");
    }
  };
}
