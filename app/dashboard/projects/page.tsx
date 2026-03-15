import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects, clients } from "@/lib/db/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to manage projects</h1>
        <Link href="/auth#signin" className="text-primary underline">
          Sign in
        </Link>
      </div>
    );
  }

  const teamId = session.teamId;
  const rows = await db.query.projects.findMany({
    where: (p, { eq }) => eq(p.teamId, teamId),
    with: { client: true },
    orderBy: (p) => [p.createdAt.desc()],
  });

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
              {rows.map((project) => (
                <tr key={project.id} className="hover:bg-accent transition">
                  <td className="px-3 py-2 font-semibold">
                    <Link href={`/dashboard/projects/${project.id}`} className="underline">{project.name}</Link>
                  </td>
                  <td className="px-3 py-2">{project.client?.name || '-'}</td>
                  <td className="px-3 py-2">{project.status}</td>
                  <td className="px-3 py-2">{project.budget ? `$${project.budget}` : '-'}</td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={`/dashboard/projects/${project.id}/edit`}
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
        href="/dashboard/projects/new"
        className="inline-flex items-center px-6 py-2 rounded-md bg-primary text-white mt-6 font-bold hover:bg-primary/80 transition"
      >
        + Add Project
      </Link>
    </section>
  );
}