"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import ClientModalForm from "./ClientModalForm";

export default function ClientsTableWithModal({
  rows,
  searchParams,
}: {
  rows: any[];
  searchParams?: Record<string, string>;
}) {
  const params = useSearchParams();
  const router = useRouter();

  // Accept server or client-side searchParams for SSR/CSR
  const qp = searchParams ?? Object.fromEntries(params.entries());

  // Compute modal trigger
  const showModal =
    qp && (qp["modal"] === "new" || qp["modal"]?.startsWith("edit-"));
  const editingId =
    qp && qp["modal"]?.startsWith("edit-")
      ? qp["modal"]!.replace("edit-", "")
      : null;
  const editingClient = editingId ? rows.find((c) => c.id === editingId) : null;

  return (
    <section className="px-6 py-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Clients</h1>
      {rows.length === 0 ? (
        <div className="bg-muted p-10 rounded-lg text-muted-foreground text-center">
          No clients yet — add your first client to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm mb-8">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 border-b font-semibold">Client Name</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Contact</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Email</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Status</th>
                <th className="text-right px-3 py-2 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((client) => (
                <tr key={client.id} className="hover:bg-accent transition">
                  <td className="px-3 py-2">
                    <Link href={`/dashboard/clients/${client.id}`} className="font-semibold underline">{client.name}</Link>
                  </td>
                  <td className="px-3 py-2">{client.contactName || '-'}</td>
                  <td className="px-3 py-2">{client.contactEmail || '-'}</td>
                  <td className="px-3 py-2">{client.status}</td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={{ pathname: "/dashboard/clients", query: { modal: `edit-${client.id}` } }}
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
        href={{ pathname: "/dashboard/clients", query: { modal: "new" } }}
        className="inline-flex items-center px-6 py-2 rounded-md bg-primary text-white mt-6 font-bold hover:bg-primary/80 transition"
        scroll={false}
      >
        + Add Client
      </Link>
      {showModal && <ClientModalForm client={editingClient || undefined} />}
    </section>
  );
}