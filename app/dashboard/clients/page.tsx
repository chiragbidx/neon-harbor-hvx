import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { clients } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import modal form as client component
const ClientModalForm = dynamic(() => import("./ClientModalForm"), { ssr: false });

export const dynamic = "force-dynamic";

export default async function ClientsPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to manage clients</h1>
        <Link href="/auth#signin" className="text-primary underline">
          Sign in
        </Link>
      </div>
    );
  }

  const teamId = session.teamId;
  const rows = await db
    .select()
    .from(clients)
    .where(eq(clients.teamId, teamId))
    .orderBy(desc(clients.createdAt));

  // Determine modal state by route param
  const showModal = searchParams && (searchParams["modal"] === "new" || searchParams["modal"]?.startsWith("edit-"));
  const editingId = searchParams && searchParams["modal"]?.startsWith("edit-") ? searchParams["modal"]!.replace("edit-", "") : null;
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
                      href={{
                        pathname: "/dashboard/clients",
                        query: { modal: `edit-${client.id}` }
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
      {/* Show "Add Client" as modal trigger */}
      <Link
        href={{
          pathname: "/dashboard/clients",
          query: { modal: "new" }
        }}
        className="inline-flex items-center px-6 py-2 rounded-md bg-primary text-white mt-6 font-bold hover:bg-primary/80 transition"
      >
        + Add Client
      </Link>

      {/* Modal rendered here conditionally */}
      {showModal && (
        <ClientModalForm client={editingClient || undefined} />
      )}
    </section>
  );
}