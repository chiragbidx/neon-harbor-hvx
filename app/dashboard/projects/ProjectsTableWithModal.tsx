"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProjectModalForm from "./ProjectModalForm";

export default function ProjectsTableWithModal({
  rows,
  searchParams,
}: {
  rows: { project: any; client: any }[];
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
  const editingProject = editingId ? rows.find((p) => p.project.id === editingId)?.project : null;
  return (
    <section className="px-6 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Project Board</h1>
      {rows.length === 0 ? (
        <div className="bg-muted p-10 rounded-lg text-muted-foreground text-center">
          No projects yet — add your first project to start tracking client work.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm mb-8">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 border-b font-semibold">Project Name</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Client</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Status</th>
                <th className="text-left px-3 py-2 border-b font-semibold">Budget</th>
                <th className="text-right px-3 py-2 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ project, client }) => (
                <tr key={project.id} className="hover:bg-accent transition">
                  <td className="px-3 py-2 font-semibold">
                    <Link href={`/dashboard/projects/${project.id}`} className="underline">{project.name}</Link>
                  </td>
                  <td className="px-3 py-2">{client?.name || '-'}</td>
                  <td className="px-3 py-2">{project.status}</td>
                  <td className="px-3 py-2">{project.budget ? `$${project.budget}` : '-'}</td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={{ pathname: "/dashboard/projects", query: { modal: `edit-${project.id}` } }}
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
        href={{ pathname: "/dashboard/projects", query: { modal: "new" } }}
        className="inline-flex items-center px-6 py-2 rounded-md bg-primary text-white mt-6 font-bold hover:bg-primary/80 transition"
        scroll={false}
      >
        + Add Project
      </Link>
      {showModal && (
        <ProjectModalForm project={editingProject || undefined} />
      )}
    </section>
  );
}