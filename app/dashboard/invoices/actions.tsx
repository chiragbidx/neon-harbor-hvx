"use server";

import { db } from "@/lib/db/client";
import { invoices, invoiceLineItems } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

const CreateInvoiceSchema = z.object({
  projectId: z.string().min(1),
  clientId: z.string().min(1),
  invoiceNumber: z.string().min(1),
  dueDate: z.coerce.date().optional().nullable(),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).default("draft"),
  total: z.coerce.number().min(0),
  lineItems: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.coerce.number().min(1),
      unitPrice: z.coerce.number().min(0),
      subtotal: z.coerce.number().min(0),
    })
  ),
});

export async function createInvoiceAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  // For simplicity, assume line items are sent as JSON in the "lineItems" field
  const data = Object.fromEntries(formData.entries());
  if (data.lineItems && typeof data.lineItems === "string") {
    try {
      data.lineItems = JSON.parse(data.lineItems);
    } catch {
      return { error: { lineItems: ["Invalid line items JSON"] } };
    }
  }

  const parsed = CreateInvoiceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const teamId = session.teamId;
  const now = new Date();
  const [invoice] = await db.insert(invoices).values({
    ...parsed.data,
    teamId,
    createdAt: now,
    updatedAt: now,
  }).returning();

  // Insert line items
  for (const item of parsed.data.lineItems) {
    await db.insert(invoiceLineItems).values({
      ...item,
      invoiceId: invoice.id,
    });
  }

  return { invoice };
}