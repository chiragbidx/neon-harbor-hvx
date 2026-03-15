import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { invoices, projects, clients } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import of invoice form modal
const InvoiceModalForm = dynamic(() => import("./InvoiceModalForm"), { ssr: false });

export const dynamic = "force-dynamic";

export default async function InvoicesPage({ searchParams }: { searchParams?: Record<string, string> }) {
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
  const rows = await db
    .select({
      invoice: invoices,
      client: clients,
      project: projects,
    })
    .from(invoices)
    .leftJoin(projects, eq(invoices.projectId, projects.id))
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .where(eq(invoices.teamId, teamId))
    .orderBy(desc(invoices.createdAt));

  const showModal = searchParams && (searchParams["modal"] === "new" || searchParams["modal"]?.startsWith("edit-"));
  const editingId = searchParams && searchParams["modal"]?.startsWith("edit-") ? searchParams["modal"]!.replace("edit-", "") : null;
  const editingInvoice = editingId ? rows.find((i) => i.invoice.id === editingId)?.invoice : null;

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
              {rows.map(({ invoice, client, project }) => (
                <tr key={invoice.id} className="hover:bg-accent transition">
                  <td className="px-3 py-2">
                    <Link href={`/dashboard/invoices/${invoice.id}`} className="font-semibold underline">{invoice.invoiceNumber}</Link>
                  </td>
                  <td className="px-3 py-2">{client?.name || "-"}</td>
                  <td className="px-3 py-2">{project?.name || "-"}</td>
                  <td className="px-3 py-2">{invoice.status}</td>
                  <td className="px-3 py-2">{invoice.total ? `$${invoice.total}` : "-"}</td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={{
                        pathname: "/dashboard/invoices",
                        query: { modal: `edit-${invoice.id}` }
                      }}
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
        href={{
          pathname: "/dashboard/invoices",
          query: { modal: "new" }
        }}
        className="inline-flex items-center px-6 py-2 rounded-md bg-primary text-white mt-6 font-bold hover:bg-primary/80 transition"
      >
        + Add Invoice
      </Link>
      {showModal && (
        <InvoiceModalForm invoice={editingInvoice || undefined} />
      )}
    </section>
  );
}