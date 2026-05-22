import { prisma } from "@/lib/prisma";
import { LearnClient } from "@/components/LearnClient";
import { getTodaySession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DUMMY_USER_ID = "cmpcpfzjh0000e961l4alnl3w";

export default async function LearnPage() {
  const user = await prisma.user.findUnique({
    where: {
      id: DUMMY_USER_ID,
    },
  });

  const session = await getTodaySession(DUMMY_USER_ID);

  return (
    <LearnClient
      initialCards={session.cards}
      initialReviewedTodayCount={session.reviewedTodayCount}
      initialTotalTodayCount={session.totalTodayCount}
      initialStreak={user?.streak ?? 0}
      initialXp={user?.xp ?? 0}
    />
  );
}
