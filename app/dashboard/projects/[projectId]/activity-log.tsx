import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { activityLogs, users } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

type Props = {
  params: { projectId: string };
};

export default async function ProjectActivityLogPage({ params }: Props) {
  const session = await getAuthSession();
  if (!session) {
    return <div className="p-8 text-center">Sign in required.</div>;
  }

  const teamId = session.teamId;
  // Fetch last 50 log entries for this project (by entityId/projectId)
  const logs = await db
    .select({
      log: activityLogs,
      user: users,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(and(eq(activityLogs.entityId, params.projectId), eq(activityLogs.teamId, teamId)))
    .orderBy(desc(activityLogs.timestamp))
    .limit(50);

  return (
    <section className="max-w-2xl mx-auto px-2 py-6">
      <h2 className="text-xl font-bold mb-4">Activity Log</h2>
      {logs.length === 0 ? (
        <div className="bg-muted p-4 rounded text-muted-foreground">
          No activity logged for this project yet.
        </div>
      ) : (
        <ul className="divide-y divide-accent">
          {logs.map(({ log, user }) => (
            <li key={log.id} className="flex justify-between items-center py-2 px-1 text-sm">
              <div>
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>{" "}
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