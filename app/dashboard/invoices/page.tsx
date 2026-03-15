import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { invoices, clients, projects } from "@/lib/db/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to manage invoices</h1>
        <Link href="/auth#signin" className="text-primary underline">
          Sign in
        </Link>
      </div>
    );
  }

  const teamId = session.teamId;
  const rows = await db.query.invoices.findMany({
    where: (inv, { eq }) => eq(inv.teamId, teamId),
    with: { project: true, client: true },
    orderBy: (inv) => [inv.createdAt.desc()],
  });

  return (
    <section className="px-6 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>
      {rows.length === 0 ? (
        <div className="bg-muted p-10 rounded-lg text-muted-foreground text-center">
          No invoices yet — once you add projects and clients, invoices live here.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm mb-8">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 border-b font-semibold">Invoice #</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Client</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Project</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Status</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Amount</th>
                <th className="text-right px-3 py-2 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((inv) => (
                <tr key={inv.id} className="hover:bg-accent transition">
                  <td className="px-3 py-2">
                    <Link href={`/dashboard/invoices/${inv.id}`} className="font-semibold underline">{inv.invoiceNumber}</Link>
                  </td>
                  <td className="px-3 py-2">{inv.client?.name || "-"}</td>
                  <td className="px-3 py-2">{inv.project?.name || "-"}</td>
                  <td className="px-3 py-2">{inv.status}</td>
                  <td className="px-3 py-2">{inv.total ? `$${inv.total}` : "-"}</td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={`/dashboard/invoices/${inv.id}/edit`}
                      className="text-xs underline text-primary"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link
        href="/dashboard/invoices/new"
        className="inline-flex items-center px-6 py-2 rounded-md bg-primary text-white mt-6 font-bold hover:bg-primary/80 transition"
      >
        + Add Invoice
      </Link>
    </section>
  );
}