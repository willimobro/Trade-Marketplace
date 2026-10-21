"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { saveImages } from "@/lib/uploads";
import { CATEGORY_NAMES, REGIONS } from "@/lib/constants";
import type { FormState } from "./types";

const jobSchema = z.object({
  title: z.string().trim().min(5, "Give the job a short title (5+ characters)").max(80),
  category: z.enum(CATEGORY_NAMES as unknown as [string, ...string[]], { message: "Pick a category" }),
  description: z.string().trim().min(20, "Describe the job in a bit more detail (20+ characters)").max(4000),
  region: z.enum(REGIONS, { message: "Pick a region" }),
  suburb: z.string().trim().min(2, "Enter the suburb or town").max(60),
  budget: z.string().trim().max(40).optional(),
});

export async function createJob(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser("/jobs/new");
  if (user.role !== "CUSTOMER") return { error: "Only customer accounts can post jobs." };

  const parsed = jobSchema.safeParse({
    title: form.get("title"),
    category: form.get("category"),
    description: form.get("description"),
    region: form.get("region"),
    suburb: form.get("suburb"),
    budget: form.get("budget") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let urls: string[];
  try {
    urls = await saveImages(form.getAll("photos") as File[], 6);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const job = await db.job.create({
    data: { ...parsed.data, customerId: user.id, photos: { create: urls.map((url) => ({ url })) } },
  });
  redirect(`/jobs/${job.id}`);
}

export async function setJobStatus(jobId: string, status: "COMPLETED" | "CLOSED") {
  const user = await requireUser();
  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job || job.customerId !== user.id) return;
  if (status === "COMPLETED" && job.status !== "ASSIGNED") return;
  if (status === "CLOSED" && job.status !== "OPEN") return;
  await db.job.update({ where: { id: jobId }, data: { status } });
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard");
}
