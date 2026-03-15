"use server";

import { db } from "@/lib/db/client";
import { clients } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

const UpdateClientSchema = z.object({
  name: z.string().min(1),
  contactName: z.string().optional().default(""),
  contactEmail: z.string().optional().email().or(z.literal("")).default(""),
  phone: z.string().optional().default(""),
  address: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  status: z.enum(["active", "archived"]).optional().default("active"),
  billingInfo: z.any().optional(),
});

export async function updateClientAction(clientId: string, formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const teamId = session.teamId;

  const parsed = UpdateClientSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Make sure the client belongs to the current team
  const client = await db.query.clients.findFirst({
    where: (c, { eq, and }) => and(eq(c.id, clientId), eq(c.teamId, teamId)),
  });
  if (!client) return { error: { id: "Client not found or access denied" } };

  const now = new Date();

  const row = await db
    .update(clients)
    .set({
      ...parsed.data,
      updatedAt: now,
    })
    .where(
      (c, { eq, and }) => and(eq(c.id, clientId), eq(c.teamId, teamId))
    )
    .returning();

  return { client: row[0] };
}

export async function archiveClientAction(clientId: string) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const teamId = session.teamId;

  // Ensure belongs to team
  const client = await db.query.clients.findFirst({
    where: (c, { eq, and }) => and(eq(c.id, clientId), eq(c.teamId, teamId)),
  });
  if (!client) return { error: { id: "Client not found or access denied" } };

  const now = new Date();

  const row = await db
    .update(clients)
    .set({ status: "archived", archivedAt: now, updatedAt: now })
    .where(
      (c, { eq, and }) => and(eq(c.id, clientId), eq(c.teamId, teamId))
    )
    .returning();

  return { client: row[0] };
}