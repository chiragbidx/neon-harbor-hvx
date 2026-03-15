"use server";

import { db } from "@/lib/db/client";
import { tasks, projects } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

const UpdateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  status: z.enum(["todo", "in progress", "done"]).optional(),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
});

export async function updateTaskAction(taskId: string, formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  // Find the task, project, check permission (project.teamId must match)
  const task = await db.query.tasks.findFirst({
    where: (t, { eq }) => eq(t.id, taskId),
    with: { project: true },
  });
  if (!task || !task.project || task.project.teamId !== session.teamId) {
    return { error: { id: "Task not found or access denied" } };
  }

  const parsed = UpdateTaskSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const now = new Date();

  const row = await db
    .update(tasks)
    .set({
      ...parsed.data,
      updatedAt: now,
    })
    .where((t, { eq }) => eq(t.id, taskId))
    .returning();

  return { task: row[0] };
}

export async function archiveTaskAction(taskId: string) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  // Find the task, project, check permission
  const task = await db.query.tasks.findFirst({
    where: (t, { eq }) => eq(t.id, taskId),
    with: { project: true },
  });
  if (!task || !task.project || task.project.teamId !== session.teamId) {
    return { error: { id: "Task not found or access denied" } };
  }

  const now = new Date();

  const row = await db
    .update(tasks)
    .set({ status: "archived", updatedAt: now })
    .where((t, { eq }) => eq(t.id, taskId))
    .returning();

  return { task: row[0] };
}