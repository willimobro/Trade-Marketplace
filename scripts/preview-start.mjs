import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { requirePreviewSecrets, protectPreview } from "./preview-security.mjs";
import { initializePreviewIdentity } from "./preview-identity.mjs";

requirePreviewSecrets(process.env);
// Never use an inherited DATABASE_URL, existing database, or checkout uploads.
const dataDir = await mkdtemp(path.join(tmpdir(), "trade-hosted-preview-"));
Object.assign(process.env, {
  NODE_ENV: "production",
  TRADE_HOSTED_PREVIEW: "1",
  TRADE_LOCAL_DEMO: "0",
  DATABASE_URL: "file:" + path.join(dataDir, "preview.db"),
  TRADE_PREVIEW_UPLOAD_DIR: path.join(dataDir, "uploads"),
});
await mkdir(process.env.TRADE_PREVIEW_UPLOAD_DIR);
function run(args) {
  const result = spawnSync(process.execPath, args, { env: process.env, stdio: "inherit" });
  if (result.status !== 0) throw new Error("Preview initialization failed");
}
run(["node_modules/prisma/build/index.js", "migrate", "deploy"]);
run(["--import", "tsx", "prisma/seed.ts"]);
const bootAssertion = initializePreviewIdentity();

const port = Number(process.env.PORT || 10000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
const hostname = process.env.PREVIEW_BIND_HOST === "127.0.0.1" ? "127.0.0.1" : "0.0.0.0";
const { default: next } = await import("next");
const app = next({ dev: false, hostname, port });
await app.prepare();
const server = createServer(protectPreview(app.getRequestHandler(), process.env.PREVIEW_ACCESS_PASSWORD, bootAssertion));
server.on("upgrade", (_req, socket) => socket.destroy());
server.listen(port, hostname, () => console.log("Protected disposable preview ready"));
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  server.close();
  await app.close();
  await rm(dataDir, { recursive: true, force: true });
  process.exit(0);
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
