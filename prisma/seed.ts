import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const user = await prisma.user.create({
        data: {
            name: "Damian",
        },
    });

    const allWords = await prisma.word.findMany();

    for (const word of allWords) {
        await prisma.userWord.create({
            data: {
                userId: user.id,
                wordId: word.id,
                dueDate: new Date(),
            },
        });
    }

    console.log("Seed completed");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });