import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_BYTES = 5 * 1024 * 1024;

// Identify by magic bytes, never trust the browser's MIME type.
function sniff(buf: Buffer): string | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  if (buf.subarray(0, 5).toString("ascii") === "%PDF-") return "pdf";
  return null;
}

/** Saves uploaded files, returns their URLs. Throws with a user-facing message on bad input. */
export async function saveUploads(
  files: (FormDataEntryValue | null)[],
  max: number,
  { allowPdf = false }: { allowPdf?: boolean } = {},
): Promise<string[]> {
  const real = files.filter((f): f is File => !!f && typeof f !== "string" && f.size > 0);
  if (real.length > max) throw new Error(`Up to ${max} file${max === 1 ? "" : "s"} please.`);
  await mkdir(UPLOAD_DIR, { recursive: true });
  const urls: string[] = [];
  for (const file of real) {
    if (file.size > MAX_BYTES) throw new Error(`${file.name} is over 5 MB.`);
    const buf = Buffer.from(await file.arrayBuffer());
    const ext = sniff(buf);
    if (!ext || (ext === "pdf" && !allowPdf))
      throw new Error(`${file.name} isn't a JPG, PNG or WebP${allowPdf ? " image or a PDF" : " image"}.`);
    const name = `${randomUUID()}.${ext}`;
    await writeFile(path.join(UPLOAD_DIR, name), buf);
    urls.push(`/uploads/${name}`);
  }
  return urls;
}
