import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { activityLogs, users } from "@/lib/db/schema";

type Props = {
  params: { projectId: string };
};

export default async function ProjectActivityLogPage({ params }: Props) {
  const session = await getAuthSession();
  if (!session) {
    return <div className="p-8 text-center">Sign in required.</div>;
  }

  const teamId = session.teamId;
  // Fetch last 50 log entries for this project's entities (tasks, milestones, invoices, etc.)
  const logs = await db.query.activityLogs.findMany({
    where: (log, { eq, and }) => and(eq(log.entityId, params.projectId), eq(log.teamId, teamId)),
    with: { user: true },
    orderBy: (log) => [log.timestamp.desc()],
    limit: 50,
  });

  return (
    <section className="max-w-2xl mx-auto px-2 py-6">
      <h2 className="text-xl font-bold mb-4">Activity Log</h2>
      {logs.length === 0 ? (
        <div className="bg-muted p-4 rounded text-muted-foreground">
          No activity logged for this project yet.
        </div>
      ) : (
        <ul className="divide-y divide-accent">
          {logs.map((log) => (
            <li key={log.id} className="flex justify-between items-center py-2 px-1 text-sm">
              <div>
                <span className="font-medium">{log.user?.firstName} {log.user?.lastName}</span>{" "}
                <span className="text-muted-foreground">
                  {log.action} {log.entityType}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {log.timestamp ? new Date(log.timestamp).toLocaleString() : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}