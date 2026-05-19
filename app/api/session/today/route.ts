import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DUMMY_USER_ID = "cmpcpfzjh0000e961l4alnl3w";
const NEW_CARDS_PER_DAY = 5;

export async function GET() {
    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

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

    const progress =
        totalTodayCount === 0
            ? 100
            : Math.round((reviewedTodayCount / totalTodayCount) * 100);

    return NextResponse.json({
        reviewedTodayCount,
        remainingCount,
        totalTodayCount,
        progress,
        cards: cards,
    });
}