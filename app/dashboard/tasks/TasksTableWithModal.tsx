"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import TaskModalForm from "./TaskModalForm";

export default function TasksTableWithModal({
  rows,
  searchParams,
}: {
  rows: { task: any; project: any }[];
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
  const editingTask = editingId ? rows.find((t) => t.task.id === editingId)?.task : null;

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
                      href={{ pathname: "/dashboard/tasks", query: { modal: `edit-${task.id}` } }}
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
        href={{ pathname: "/dashboard/tasks", query: { modal: "new" } }}
        className="inline-flex items-center px-6 py-2 rounded-md bg-primary text-white mt-6 font-bold hover:bg-primary/80 transition"
        scroll={false}
      >
        + Add Task
      </Link>
      {showModal && (
        <TaskModalForm task={editingTask || undefined} />
      )}
    </section>
  );
}