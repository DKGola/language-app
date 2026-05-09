import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DUMMY_USER_ID = "cmovxq9ad0000dqjtsqm1kxwy";

export async function GET() {
    const cards = await prisma.userWord.findMany({
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

    return NextResponse.json({
        count: cards.length,
        cards,
    });
}