import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const dir = await mkdtemp(path.join(tmpdir(), "trade-preview-build-"));
const env = { ...process.env, DATABASE_URL: "file:" + path.join(dir, "build.db"), TRADE_LOCAL_DEMO: "0" };
try {
  for (const args of [
    ["node_modules/prisma/build/index.js", "generate"],
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    ["node_modules/next/dist/bin/next", "build"],
  ]) {
    const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
    if (result.status !== 0) throw new Error("Preview build failed");
  }
} finally {
  await rm(dir, { recursive: true, force: true });
}
