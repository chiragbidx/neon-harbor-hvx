import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { tasks, projects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import TasksTableWithModal from "./TasksTableWithModal";

export const dynamic = "force-dynamic";

export default async function TasksPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to manage tasks</h1>
      </div>
    );
  }

  const teamId = session.teamId;
  // Get all tasks for all projects by this team
  const rows = await db
    .select({
      task: tasks,
      project: projects,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .where(eq(projects.teamId, teamId))
    .orderBy(desc(tasks.createdAt));

  return <TasksTableWithModal rows={rows} searchParams={searchParams} />;
}