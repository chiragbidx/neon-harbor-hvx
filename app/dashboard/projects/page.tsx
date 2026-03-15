import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects, clients } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import ProjectsTableWithModal from "./ProjectsTableWithModal";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to manage projects</h1>
        {/* No link to prevent bypass */}
      </div>
    );
  }

  const teamId = session.teamId;
  const rows = await db
    .select({
      project: projects,
      client: clients,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.teamId, teamId))
    .orderBy(desc(projects.createdAt));

  return <ProjectsTableWithModal rows={rows} searchParams={searchParams} />;
}