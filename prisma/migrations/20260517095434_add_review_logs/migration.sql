-- CreateTable
CREATE TABLE "ReviewLog" (
    "id" TEXT NOT NULL,
    "userWordId" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "previousInterval" INTEGER NOT NULL,
    "nextInterval" INTEGER NOT NULL,
    "previousRepetitions" INTEGER NOT NULL,
    "nextRepetitions" INTEGER NOT NULL,
    "previousEaseFactor" DOUBLE PRECISION NOT NULL,
    "nextEaseFactor" DOUBLE PRECISION NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReviewLog" ADD CONSTRAINT "ReviewLog_userWordId_fkey" FOREIGN KEY ("userWordId") REFERENCES "UserWord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
