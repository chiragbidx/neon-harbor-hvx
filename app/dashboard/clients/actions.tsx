"use server";

import { db } from "@/lib/db/client";
import { clients } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

const CreateClientSchema = z.object({
  name: z.string().min(1),
  contactName: z.string().optional().default(""),
  contactEmail: z.string().optional().email().or(z.literal("")).default(""),
  phone: z.string().optional().default(""),
  address: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  status: z.enum(["active", "archived"]).optional().default("active"),
  billingInfo: z.any().optional(),
});

export async function createClientAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = CreateClientSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const teamId = session.teamId;
  const now = new Date();

  const row = await db.insert(clients).values({
    ...parsed.data,
    teamId,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return { client: row[0] };
}