import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects, clients, tasks, milestones } from "@/lib/db/schema";
import Link from "next/link";
import { eq, desc, asc, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Props = {
  params: { projectId: string };
};

export default async function ProjectDetailPage({ params }: Props) {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to view project details</h1>
        <Link href="/auth#signin" className="text-primary underline">
          Sign in
        </Link>
      </div>
    );
  }

  const teamId = session.teamId;
  // Get project & client with join
  const projRes = await db
    .select({
      project: projects,
      client: clients,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .where(and(eq(projects.id, params.projectId), eq(projects.teamId, teamId)));

  const project = projRes[0]?.project;
  const client = projRes[0]?.client;

  if (!project) {
    return (
      <section className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Project not found or access denied</h2>
        <Link href="/dashboard/projects" className="text-primary underline">
          Back to projects
        </Link>
      </section>
    );
  }

  // Associated tasks and milestones
  const taskRows = await db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, project.id))
    .orderBy(desc(tasks.createdAt));

  const milestoneRows = await db
    .select()
    .from(milestones)
    .where(eq(milestones.projectId, project.id))
    .orderBy(asc(milestones.createdAt));

  return (
    <section className="px-6 py-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <div className="text-sm text-muted-foreground mb-2">Status: {project.status}</div>
        <div className="mb-4">
          <strong>Client:</strong>{" "}
          {client ? (
            <Link className="underline" href={`/dashboard/clients/${client.id}`}>
              {client.name}
            </Link>
          ) : (
            "-"
          )}
          <br />
          <strong>Budget:</strong> {project.budget ? "$" + project.budget : "-"}
          <br />
          <strong>Dates:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"} —{" "}
          {project.endDate ? new Date(project.endDate).toLocaleDateString() : "-"}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Tasks</h2>
        {taskRows.length === 0 ? (
          <div className="bg-muted p-4 rounded text-muted-foreground">No tasks yet. <Link href={`/dashboard/tasks/new?projectId=${project.id}`} className="underline ml-2">+ Add one</Link></div>
        ) : (
          <ul className="space-y-2">
            {taskRows.map((task) => (
              <li key={task.id}>
                <span className="font-semibold">{task.title}</span> <span className="text-muted-foreground">({task.status})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Milestones</h2>
        {milestoneRows.length === 0 ? (
          <div className="bg-muted p-4 rounded text-muted-foreground">No milestones yet.</div>
        ) : (
          <ul className="space-y-2">
            {milestoneRows.map((m) => (
              <li key={m.id}>
                <span className="font-semibold">{m.name}</span>{" "}
                <span className="text-muted-foreground">({m.status}) — Due: {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "-"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link href="/dashboard/projects" className="text-primary underline text-sm mt-6 block">
        ← Back to Projects
      </Link>
    </section>
  );
}