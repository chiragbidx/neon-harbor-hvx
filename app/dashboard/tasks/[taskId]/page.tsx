import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { tasks, projects } from "@/lib/db/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  params: { taskId: string };
};

export default async function TaskDetailPage({ params }: Props) {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to view task details</h1>
        <Link href="/auth#signin" className="text-primary underline">
          Sign in
        </Link>
      </div>
    );
  }

  // Find the task, project, check permission (project.teamId must match)
  const task = await db.query.tasks.findFirst({
    where: (t, { eq }) => eq(t.id, params.taskId),
    with: { project: true },
  });

  if (!task || !task.project || task.project.teamId !== session.teamId) {
    return (
      <section className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Task not found or access denied</h2>
        <Link href="/dashboard/tasks" className="text-primary underline">
          Back to tasks
        </Link>
      </section>
    );
  }

  return (
    <section className="px-6 py-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{task.title}</h1>
      <div className="mb-4">
        <strong>Status:</strong> {task.status}
        <br />
        <strong>Project:</strong>{" "}
        <Link href={`/dashboard/projects/${task.projectId}`} className="underline">
          {task.project.name}
        </Link>
        <br />
        <strong>Assignee:</strong> {task.assigneeId || "-"}
        <br />
        <strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
      </div>
      <div className="mb-4">
        <strong>Description:</strong>
        <div className="border p-2 rounded bg-muted min-h-[36px]">{task.description || <span className="italic text-muted">No description</span>}</div>
      </div>
      <Link href="/dashboard/tasks" className="text-primary underline text-sm mt-6 block">
        ← Back to Tasks
      </Link>
    </section>
  );
}