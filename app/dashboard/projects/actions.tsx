"use server";

import { db } from "@/lib/db/client";
import { projects, clients } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

const CreateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  clientId: z.string().min(1),
  status: z.enum(["planned", "active", "completed", "archived"]).optional().default("planned"),
  budget: z.coerce.number().optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  ownerId: z.string().optional().nullable(),
});

export async function createProjectAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = CreateProjectSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const teamId = session.teamId;
  const now = new Date();

  const row = await db.insert(projects).values({
    ...parsed.data,
    teamId,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return { project: row[0] };
}