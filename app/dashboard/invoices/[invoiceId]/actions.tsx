"use server";

import { db } from "@/lib/db/client";
import { invoices, invoiceLineItems } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

const UpdateInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1),
  dueDate: z.coerce.date().optional().nullable(),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).default("draft"),
  total: z.coerce.number().min(0),
  lineItems: z.array(
    z.object({
      id: z.string().optional(),
      description: z.string().min(1),
      quantity: z.coerce.number().min(1),
      unitPrice: z.coerce.number().min(0),
      subtotal: z.coerce.number().min(0),
    })
  ),
});

export async function updateInvoiceAction(invoiceId: string, formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const teamId = session.teamId;

  // For simplicity, assume line items are sent as JSON in the "lineItems" field
  const data = Object.fromEntries(formData.entries());
  if (data.lineItems && typeof data.lineItems === "string") {
    try {
      data.lineItems = JSON.parse(data.lineItems);
    } catch {
      return { error: { lineItems: ["Invalid line items JSON"] } };
    }
  }

  const parsed = UpdateInvoiceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Make sure invoice belongs to current team
  const invoice = await db.query.invoices.findFirst({
    where: (inv, { eq, and }) => and(eq(inv.id, invoiceId), eq(inv.teamId, teamId)),
  });
  if (!invoice) return { error: { id: "Invoice not found or access denied" } };

  const now = new Date();
  const [updated] = await db
    .update(invoices)
    .set({
      invoiceNumber: parsed.data.invoiceNumber,
      dueDate: parsed.data.dueDate,
      status: parsed.data.status,
      total: parsed.data.total,
      updatedAt: now,
    })
    .where(
      (inv, { eq, and }) => and(eq(inv.id, invoiceId), eq(inv.teamId, teamId))
    )
    .returning();

  // Update line items (simplified: remove all then re-add)
  await db.delete(invoiceLineItems).where((li, { eq }) => eq(li.invoiceId, invoiceId));
  for (const item of parsed.data.lineItems) {
    await db.insert(invoiceLineItems).values({
      ...item,
      invoiceId,
    });
  }

  return { invoice: updated };
}