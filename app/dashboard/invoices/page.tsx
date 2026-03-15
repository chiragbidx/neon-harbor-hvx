import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { invoices, projects, clients } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import InvoicesTableWithModal from "./InvoicesTableWithModal";

export const dynamic = "force-dynamic";

export default async function InvoicesPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to manage invoices</h1>
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

  return <InvoicesTableWithModal rows={rows} searchParams={searchParams} />;
}