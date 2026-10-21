"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import type { FormState } from "./types";

export async function sendMessage(jobId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const body = String(form.get("body") ?? "").trim();
  if (!body) return { error: "Type a message first." };
  if (body.length > 2000) return { error: "Keep it under 2000 characters." };

  const job = await db.job.findUnique({ where: { id: jobId } });
  // The job thread is the customer, the assigned tradie and TM staff.
  const allowed = job && (user.role === "ADMIN" || user.id === job.customerId || user.id === job.tradieId);
  if (!allowed) return { error: "You can't message on this job." };

  await db.message.create({ data: { jobId, senderId: user.id, body } });
  revalidatePath(`/jobs/${jobId}`);
  return { ok: "sent" };
}
