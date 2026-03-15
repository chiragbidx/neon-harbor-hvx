import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { clients, projects } from "@/lib/db/schema";
import Link from "next/link";
import { eq, desc, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Props = {
  params: { clientId: string };
};

export default async function ClientDetailPage({ params }: Props) {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to view client details</h1>
        <Link href="/auth#signin" className="text-primary underline">
          Sign in
        </Link>
      </div>
    );
  }

  const teamId = session.teamId;
  const client = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, params.clientId), eq(clients.teamId, teamId)))
    .then(res => res[0]);

  if (!client) {
    return (
      <section className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Client not found or access denied</h2>
        <Link href="/dashboard/clients" className="text-primary underline">
          Back to clients
        </Link>
      </section>
    );
  }

  // Projects for this client
  const projectRows = await db
    .select()
    .from(projects)
    .where(eq(projects.clientId, client.id))
    .orderBy(desc(projects.createdAt));

  return (
    <section className="px-6 py-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{client.name}</h1>
        <div className="text-sm text-muted-foreground mb-2">{client.status === "archived" ? "Archived" : "Active"}</div>
        <div className="mb-4">
          <p>
            <strong>Contact:</strong> {client.contactName || "-"}
            <br />
            <strong>Email:</strong> {client.contactEmail || "-"}
            <br />
            <strong>Phone:</strong> {client.phone || "-"}
            <br />
            <strong>Address:</strong> {client.address || "-"}
          </p>
        </div>
        <div className="mb-2">
          <strong>Notes:</strong>
          <div className="border p-2 rounded bg-muted">{client.notes || <span className="italic text-muted">None</span>}</div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Projects for {client.name}</h2>
        {projectRows.length === 0 ? (
          <div className="bg-muted p-4 rounded text-muted-foreground">No projects for this client yet.</div>
        ) : (
          <ul className="space-y-2">
            {projectRows.map((project) => (
              <li key={project.id}>
                <Link href={`/dashboard/projects/${project.id}`} className="underline">
                  {project.name} ({project.status})
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link href={`/dashboard/projects/new?clientId=${client.id}`} className="text-primary underline text-sm mt-4 inline-block">
          + Add Project
        </Link>
      </div>

      <Link href="/dashboard/clients" className="text-primary underline text-sm mt-6 block">
        ← Back to Clients
      </Link>
    </section>
  );
}