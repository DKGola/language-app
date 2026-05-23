import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateNextReview, Rating } from "@/lib/srs";
import { getTodaySession } from "@/lib/session";

const VALID_RATINGS: Rating[] = ["again", "good", "easy"];

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { userWordId, rating } = body;

    if (!userWordId || typeof userWordId !== "string") {
        return NextResponse.json(
            { error: "userWordId is required" },
            { status: 400 }
        );
    }

    if (!VALID_RATINGS.includes(rating)) {
        return NextResponse.json(
            { error: "rating must be one of: again, good, easy" },
            { status: 400 }
        );
    }

    const userWord = await prisma.userWord.findUnique({
        where: {
            id: userWordId,
        },
    });

    if (!userWord) {
        return NextResponse.json(
            { error: "Card not found" },
            { status: 404 }
        );
    }

    const nextReview = calculateNextReview({
        currentInterval: userWord.interval,
        repetitions: userWord.repetitions,
        easeFactor: userWord.easeFactor,
        rating,
    });

    const [updated] = await prisma.$transaction([
        prisma.userWord.update({
            where: {
                id: userWordId,
            },
            data: {
                ...nextReview,
                isNew: false,
            },
        }),

        prisma.reviewLog.create({
            data: {
                userWordId,
                rating,
                previousInterval: userWord.interval,
                nextInterval: nextReview.interval,
                previousRepetitions: userWord.repetitions,
                nextRepetitions: nextReview.repetitions,
                previousEaseFactor: userWord.easeFactor,
                nextEaseFactor: nextReview.easeFactor,
            },
        }),
    ]);

    let dayCompleted = false;

    if (rating !== "again") {
        const session = await getTodaySession(userWord.userId);

        if (session.remainingCount === 0) {
            const user = await prisma.user.findUnique({
                where: { id: userWord.userId },
            });

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const last = user?.lastCompletedAt;

            let alreadyCompletedToday = false;

            if (last) {
                const lastDate = new Date(last);
                lastDate.setHours(0, 0, 0, 0);

                alreadyCompletedToday = lastDate.getTime() === today.getTime();
            }

            if (!alreadyCompletedToday) {
                await prisma.user.update({
                    where: { id: userWord.userId },
                    data: {
                        streak: {
                            increment: 1,
                        },
                        xp: {
                            increment: 50,
                        },
                        lastCompletedAt: new Date(),
                    },
                });

                dayCompleted = true;
            }
        }
    }

    return NextResponse.json({
        userWord: updated,
        dayCompleted,
    });
}
