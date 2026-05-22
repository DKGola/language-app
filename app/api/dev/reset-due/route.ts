import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
            { error: "Not available in production" },
            { status: 403 }
        );
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const result = await prisma.userWord.updateMany({
        data: {
            dueDate: yesterday,
            interval: 1,
            repetitions: 0,
            easeFactor: 2.5,
        },
    });

    return NextResponse.json({
        message: "All cards reset to yesterday",
        updatedCount: result.count,
        dueDate: yesterday,
    });
}