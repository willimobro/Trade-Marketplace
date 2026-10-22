"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";
import { createPasswordSession } from "@/lib/password-session";
import { CATEGORY_NAMES, REGIONS } from "@/lib/constants";
import type { FormState } from "./types";

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name"),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    password: z.string().min(8, "Password needs at least 8 characters"),
    role: z.enum(["CUSTOMER", "TRADIE"], { message: "Pick an account type" }),
    region: z.enum(REGIONS, { message: "Pick your region" }),
    trade: z.string().trim().optional(),
    registrationNo: z.string().trim().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.role !== "TRADIE") return;
    if (!v.trade || !(CATEGORY_NAMES as readonly string[]).includes(v.trade))
      ctx.addIssue({ code: "custom", message: "Pick your trade", path: ["trade"] });
    if (v.trade === "Electrical" && !v.registrationNo)
      ctx.addIssue({ code: "custom", message: "Enter your Electrical registration number", path: ["registrationNo"] });
  });

function safeNext(next: FormDataEntryValue | null) {
  const s = typeof next === "string" ? next : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/dashboard";
}

export async function signup(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const v = parsed.data;

  if (await db.user.findUnique({ where: { email: v.email } }))
    return { error: "There's already an account with that email." };

  const user = await db.user.create({
    data: {
      name: v.name,
      email: v.email,
      passwordHash: await bcrypt.hash(v.password, 10),
      role: v.role,
      region: v.region,
      trade: v.role === "TRADIE" ? v.trade : null,
      registrationNo: v.role === "TRADIE" ? v.registrationNo || null : null,
      licenceVerified: false,
    },
  });
  await createSession(user.id);
  redirect(safeNext(form.get("next")));
}

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!(await createPasswordSession(email, password)))
    return { error: "Wrong email or password." };
  redirect(safeNext(form.get("next")));
}

export async function logout() {
  await destroySession();
  redirect("/");
}
