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

    await prisma.word.createMany({
        data: [
            {
                front: "Haus",
                back: "house",
                languageFrom: "de",
                languageTo: "en",
            },
            {
                front: "Baum",
                back: "tree",
                languageFrom: "de",
                languageTo: "en",
            },
            {
                front: "gehen",
                back: "to go",
                languageFrom: "de",
                languageTo: "en",
            },
            {
                front: "essen",
                back: "to eat",
                languageFrom: "de",
                languageTo: "en",
            },
            {
                front: "Wasser",
                back: "water",
                languageFrom: "de",
                languageTo: "en",
            },
        ],
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