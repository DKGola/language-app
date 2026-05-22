import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTodaySession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DUMMY_USER_ID = "cmpcpfzjh0000e961l4alnl3w";

export default async function HomePage() {
  const user = await prisma.user.findUnique({
    where: {
      id: DUMMY_USER_ID,
    },
  });

  const session = await getTodaySession(DUMMY_USER_ID);

  return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <p className="text-sm text-gray-500">Language Learning</p>
            <h1 className="text-4xl font-bold mt-2">
              Willkommen zurück{user?.name ? `, ${user.name}` : ""} 👋
            </h1>
            <p className="mt-3 text-gray-600">
              Erledige deine heutige Session und halte deinen Streak am Leben.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-gray-500">Streak</p>
              <p className="mt-2 text-3xl font-bold">🔥 {user?.streak ?? 0}</p>
            </div>

            <div className="rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-gray-500">XP</p>
              <p className="mt-2 text-3xl font-bold">⭐ {user?.xp ?? 0}</p>
            </div>

            <div className="rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-gray-500">Heute</p>
              <p className="mt-2 text-3xl font-bold">{session.progress}%</p>
            </div>
          </div>

          <div className="rounded-2xl border p-6 shadow-sm mb-8">
            <div className="mb-3 flex justify-between text-sm text-gray-500">
            <span>
              {session.reviewedTodayCount} / {session.totalTodayCount} erledigt
            </span>
              <span>{session.remainingCount} offen</span>
            </div>

            <div className="h-3 rounded-full bg-gray-200">
              <div
                  className="h-3 rounded-full bg-black"
                  style={{ width: `${session.progress}%` }}
              />
            </div>
          </div>

          <Link
              href="/learn"
              className="block w-full rounded-2xl bg-black px-6 py-4 text-center font-semibold text-white hover:bg-gray-800 transition"
          >
            Lernen starten
          </Link>
        </div>
      </main>
  );
}