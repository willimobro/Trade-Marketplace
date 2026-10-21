"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import type { FormState } from "./types";

export async function sendMessage(quoteId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const body = String(form.get("body") ?? "").trim();
  if (!body) return { error: "Type a message first." };
  if (body.length > 2000) return { error: "Keep it under 2000 characters." };

  const quote = await db.quote.findUnique({ where: { id: quoteId }, include: { job: true } });
  // Only the job's customer and the quoting tradie can talk in this thread.
  if (!quote || (user.id !== quote.tradieId && user.id !== quote.job.customerId))
    return { error: "You can't message on this quote." };

  await db.message.create({ data: { quoteId, senderId: user.id, body } });
  revalidatePath(`/jobs/${quote.jobId}`);
  return { ok: "sent" };
}
