import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { tasks, projects } from "@/lib/db/schema";
import Link from "next/link";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to manage tasks</h1>
        <Link href="/auth#signin" className="text-primary underline">
          Sign in
        </Link>
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

  return (
    <section className="px-6 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      {rows.length === 0 ? (
        <div className="bg-muted p-10 rounded-lg text-muted-foreground text-center">
          No tasks yet — add your first task for a project.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm mb-8">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 border-b font-semibold">Title</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Project</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Status</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Assignee</th>
                <th className="text-right px-3 py-2 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ task, project }) => (
                <tr key={task.id} className="hover:bg-accent transition">
                  <td className="px-3 py-2 font-semibold">
                    <Link href={`/dashboard/tasks/${task.id}`} className="underline">{task.title}</Link>
                  </td>
                  <td className="px-3 py-2">{project?.name || "-"}</td>
                  <td className="px-3 py-2">{task.status}</td>
                  <td className="px-3 py-2">{task.assigneeId || "-"}</td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={`/dashboard/tasks/${task.id}/edit`}
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
        href="/dashboard/tasks/new"
        className="inline-flex items-center px-6 py-2 rounded-md bg-primary text-white mt-6 font-bold hover:bg-primary/80 transition"
      >
        + Add Task
      </Link>
    </section>
  );
}