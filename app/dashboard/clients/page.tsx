import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { clients } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import ClientsTableWithModal from "./ClientsTableWithModal";

export const dynamic = "force-dynamic";

export default async function ClientsPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to manage clients</h1>
        <Link href="/auth#signin" className="text-primary underline">
          Sign in
        </Link>
      </div>
    );
  }

  const teamId = session.teamId;
  const rows = await db
    .select()
    .from(clients)
    .where(eq(clients.teamId, teamId))
    .orderBy(desc(clients.createdAt));

  return <ClientsTableWithModal rows={rows} searchParams={searchParams} />;
}