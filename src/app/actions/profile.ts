"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { saveUploads } from "@/lib/uploads";
import { REGIONS } from "@/lib/constants";
import type { FormState } from "./types";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(60),
  region: z.enum(REGIONS, { message: "Pick your region" }),
  phone: z.string().trim().max(30).optional(),
  bio: z.string().trim().max(1000).optional(),
  registrationNo: z.string().trim().max(30).optional(),
});

export async function updateProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser("/profile");
  const parsed = profileSchema.safeParse({
    name: form.get("name"),
    region: form.get("region"),
    phone: form.get("phone") || undefined,
    bio: form.get("bio") || undefined,
    registrationNo: form.get("registrationNo") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let avatarUrl: string | undefined;
  try {
    [avatarUrl] = await saveUploads([form.get("avatar")], 1);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const current = await db.user.findUniqueOrThrow({ where: { id: user.id } });
  const isTradie = user.role === "TRADIE";
  const newReg = parsed.data.registrationNo ?? null;
  const regChanged = isTradie && newReg !== current.registrationNo;

  await db.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      region: parsed.data.region,
      phone: parsed.data.phone ?? null,
      bio: isTradie ? parsed.data.bio ?? null : null,
      ...(isTradie && { registrationNo: newReg }),
      // A new registration number has to be checked again.
      ...(regChanged && { licenceVerified: false }),
      ...(avatarUrl && { avatarUrl }),
    },
  });
  revalidatePath("/", "layout");
  return { ok: "Profile saved." };
}
