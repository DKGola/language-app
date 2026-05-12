import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {calculateNextReview, Rating} from "@/lib/srs";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { userWordId, rating } = body;

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
        rating: rating as Rating,
    });

    const updated = await prisma.userWord.update({
        where: {
            id: userWordId,
        },
        data: nextReview,
    });

    return NextResponse.json(updated);
}