"use server";

import { db } from "@/lib/db/client";
import { tasks, projects } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  projectId: z.string().min(1),
  assigneeId: z.string().optional().nullable(),
  status: z.enum(["todo", "in progress", "done"]).optional().default("todo"),
  dueDate: z.coerce.date().optional().nullable(),
});

export async function createTaskAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = CreateTaskSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Ensure the project belongs to the current team
  const project = await db.query.projects.findFirst({
    where: (p, { eq }) => eq(p.id, parsed.data.projectId),
  });
  if (!project || project.teamId !== session.teamId) {
    return { error: { projectId: ["Project not found or access denied"] } };
  }

  const now = new Date();
  const row = await db.insert(tasks).values({
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return { task: row[0] };
}