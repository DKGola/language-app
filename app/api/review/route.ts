import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    let nextInterval = 1;

    if (rating === "good") {
        nextInterval = 3;
    }

    if (rating === "easy") {
        nextInterval = 7;
    }

    const nextDueDate = new Date();

    nextDueDate.setDate(
        nextDueDate.getDate() + nextInterval
    );

    const updated = await prisma.userWord.update({
        where: {
            id: userWordId,
        },
        data: {
            interval: nextInterval,
            repetitions: userWord.repetitions + 1,
            dueDate: nextDueDate,
        },
    });

    return NextResponse.json(updated);
}