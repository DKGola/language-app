import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateNextReview, Rating } from "@/lib/srs";

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
            data: nextReview,
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

    return NextResponse.json(updated);
}