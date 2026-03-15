"use server";

import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

const UpdateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["planned", "active", "completed", "archived"]).optional(),
  budget: z.coerce.number().optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  ownerId: z.string().optional().nullable(),
});

export async function updateProjectAction(projectId: string, formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const teamId = session.teamId;

  const parsed = UpdateProjectSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Make sure the project belongs to the current team
  const project = await db.query.projects.findFirst({
    where: (p, { eq, and }) => and(eq(p.id, projectId), eq(p.teamId, teamId)),
  });
  if (!project) return { error: { id: "Project not found or access denied" } };

  const now = new Date();

  const row = await db
    .update(projects)
    .set({
      ...parsed.data,
      updatedAt: now,
    })
    .where(
      (p, { eq, and }) => and(eq(p.id, projectId), eq(p.teamId, teamId))
    )
    .returning();

  return { project: row[0] };
}

export async function archiveProjectAction(projectId: string) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const teamId = session.teamId;

  const project = await db.query.projects.findFirst({
    where: (p, { eq, and }) => and(eq(p.id, projectId), eq(p.teamId, teamId)),
  });
  if (!project) return { error: { id: "Project not found or access denied" } };

  const now = new Date();

  const row = await db
    .update(projects)
    .set({ status: "archived", archivedAt: now, updatedAt: now })
    .where(
      (p, { eq, and }) => and(eq(p.id, projectId), eq(p.teamId, teamId))
    )
    .returning();

  return { project: row[0] };
}