"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import InvoiceModalForm from "./InvoiceModalForm";

export default function InvoicesTableWithModal({
  rows,
  searchParams,
}: {
  rows: { invoice: any; client: any; project: any }[];
  searchParams?: Record<string, string>;
}) {
  const params = useSearchParams();
  const qp = searchParams ?? Object.fromEntries(params.entries());
  const showModal =
    qp && (qp["modal"] === "new" || qp["modal"]?.startsWith("edit-"));
  const editingId =
    qp && qp["modal"]?.startsWith("edit-")
      ? qp["modal"]!.replace("edit-", "")
      : null;
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
                      href={{ pathname: "/dashboard/invoices", query: { modal: `edit-${invoice.id}` } }}
                      className="text-xs underline text-primary"
                      scroll={false}
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
        href={{ pathname: "/dashboard/invoices", query: { modal: "new" } }}
        className="inline-flex items-center px-6 py-2 rounded-md bg-primary text-white mt-6 font-bold hover:bg-primary/80 transition"
        scroll={false}
      >
        + Add Invoice
      </Link>
      {showModal && (
        <InvoiceModalForm invoice={editingInvoice || undefined} />
      )}
    </section>
  );
}