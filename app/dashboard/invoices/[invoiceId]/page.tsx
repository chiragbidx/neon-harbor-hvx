import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { invoices, invoiceLineItems, projects, clients } from "@/lib/db/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  params: { invoiceId: string };
};

export default async function InvoiceDetailPage({ params }: Props) {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to view invoice details</h1>
        <Link href="/auth#signin" className="text-primary underline">
          Sign in
        </Link>
      </div>
    );
  }

  const teamId = session.teamId;
  const invoice = await db.query.invoices.findFirst({
    where: (inv, { eq, and }) => and(eq(inv.id, params.invoiceId), eq(inv.teamId, teamId)),
    with: {
      project: true,
      client: true,
    },
  });

  if (!invoice) {
    return (
      <section className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Invoice not found or access denied</h2>
        <Link href="/dashboard/invoices" className="text-primary underline">
          Back to invoices
        </Link>
      </section>
    );
  }

  // Find line items for this invoice
  const lineItems = await db.query.invoiceLineItems.findMany({
    where: (item, { eq }) => eq(item.invoiceId, invoice.id),
  });

  return (
    <section className="px-6 py-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
        <div className="text-sm text-muted-foreground mb-2">
          Status: {invoice.status} | Due: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
        </div>
        <div className="mb-4">
          <strong>Client:</strong>{" "}
          {invoice.client ? (
            <Link className="underline" href={`/dashboard/clients/${invoice.clientId}`}>
              {invoice.client.name}
            </Link>
          ) : (
            "-"
          )}
          <br />
          <strong>Project:</strong>{" "}
          {invoice.project ? (
            <Link className="underline" href={`/dashboard/projects/${invoice.projectId}`}>
              {invoice.project.name}
            </Link>
          ) : (
            "-"
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Line Items</h2>
        {lineItems.length === 0 ? (
          <div className="bg-muted p-4 rounded text-muted-foreground">No line items for this invoice.</div>
        ) : (
          <table className="w-full text-sm border-collapse mb-4">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 border-b font-semibold">Description</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Quantity</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Unit Price</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((li) => (
                <tr key={li.id}>
                  <td className="px-3 py-2">{li.description}</td>
                  <td className="px-3 py-2">{li.quantity}</td>
                  <td className="px-3 py-2">${li.unitPrice}</td>
                  <td className="px-3 py-2">${li.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mb-4 text-xl font-semibold">
        Amount Due: {invoice.total ? "$" + invoice.total : "-"}
      </div>

      <Link href="/dashboard/invoices" className="text-primary underline text-sm mt-6 block">
        ← Back to Invoices
      </Link>
    </section>
  );
}