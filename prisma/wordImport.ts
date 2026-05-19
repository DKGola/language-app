import "dotenv/config";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const USER_ID = "cmpcpfzjh0000e961l4alnl3w";

async function main() {
    type CsvRow = {
        front: string;
        back: string;
        languageFrom: string;
        languageTo: string;
    };

    const results: CsvRow[] = [];
    const filePath = path.join(process.cwd(), "words.csv");

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve())
            .on("error", reject);
    });

    console.log(`Loaded ${results.length} rows`);

    for (const row of results) {
        const word = await prisma.word.create({
            data: {
                front: row.front,
                back: row.back,
                languageFrom: row.languageFrom,
                languageTo: row.languageTo,
            },
        });

        await prisma.userWord.create({
            data: {
                userId: USER_ID,
                wordId: word.id,
                dueDate: new Date(),
            },
        });
    }

    console.log("Import done");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });