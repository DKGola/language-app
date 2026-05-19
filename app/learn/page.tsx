import { prisma } from "@/lib/prisma";
import { LearnClient } from "@/components/LearnClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DUMMY_USER_ID = "cmpcpfzjh0000e961l4alnl3w";
const NEW_CARDS_PER_DAY = 5;

export default async function LearnPage() {
    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const user = await prisma.user.findUnique({
        where: {
            id: DUMMY_USER_ID,
        },
    });

    const reviewCards = await prisma.userWord.findMany({
        where: {
            userId: DUMMY_USER_ID,
            isNew: false,
            dueDate: {
                lte: now,
            },
        },
        include: {
            word: true,
        },
        orderBy: {
            dueDate: "asc",
        },
    });

    const newCards = await prisma.userWord.findMany({
        where: {
            userId: DUMMY_USER_ID,
            isNew: true,
        },
        include: {
            word: true,
        },
        take: NEW_CARDS_PER_DAY,
    });

    const cards = [...reviewCards, ...newCards];

    const reviewedTodayCount = await prisma.reviewLog.count({
        where: {
            reviewedAt: {
                gte: startOfToday,
                lte: endOfToday,
            },
            userWord: {
                userId: DUMMY_USER_ID,
            },
        },
    });

    const remainingCount = cards.length;
    const totalTodayCount = reviewedTodayCount + remainingCount;

    return (
        <LearnClient
            initialCards={cards}
            initialReviewedTodayCount={reviewedTodayCount}
            initialTotalTodayCount={totalTodayCount}
            initialStreak={user?.streak ?? 0}
            initialXp={user?.xp ?? 0}
        />
    );
}