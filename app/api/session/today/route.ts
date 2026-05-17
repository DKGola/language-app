import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DUMMY_USER_ID = "cmovxq9ad0000dqjtsqm1kxwy";

export async function GET() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const dueCards = await prisma.userWord.findMany({
        where: {
            userId: DUMMY_USER_ID,
            dueDate: {
                lte: new Date(),
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

    const remainingCount = dueCards.length;
    const totalTodayCount = reviewedTodayCount + remainingCount;

    const progress =
        totalTodayCount === 0
            ? 100
            : Math.round((reviewedTodayCount / totalTodayCount) * 100);

    return NextResponse.json({
        reviewedTodayCount,
        remainingCount,
        totalTodayCount,
        progress,
        cards: dueCards,
    });
}