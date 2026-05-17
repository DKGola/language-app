import { prisma } from "@/lib/prisma";
import { LearnClient } from "@/components/LearnClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DUMMY_USER_ID = "cmovxq9ad0000dqjtsqm1kxwy";

export default async function LearnPage() {
    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const cards = await prisma.userWord.findMany({
        where: {
            userId: DUMMY_USER_ID,
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
        />
    );
}