import { prisma } from "@/lib/prisma";
import { LearnClient } from "@/components/LearnClient";

const DUMMY_USER_ID = "cmovxq9ad0000dqjtsqm1kxwy";

export default async function LearnPage() {
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

    return <LearnClient initialCards={cards} />;
}