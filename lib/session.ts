import { prisma } from "@/lib/prisma";

const NEW_CARDS_PER_DAY = 5;

export async function getTodaySession(userId: string) {
  const now = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const reviewCards = await prisma.userWord.findMany({
    where: {
      userId,
      isNew: false,
      dueDate: {
        lte: now,
      },
    },
    include: {
      word: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  const newCardsStartedTodayCount = await prisma.reviewLog.count({
    where: {
      reviewedAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
      previousRepetitions: 0,
      userWord: {
        userId,
      },
    },
  });

  const remainingNewCardsToday = Math.max(
      0,
      NEW_CARDS_PER_DAY - newCardsStartedTodayCount
  );

  const newCards = await prisma.userWord.findMany({
    where: {
      userId,
      isNew: true,
    },
    include: {
      word: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: remainingNewCardsToday,
  });

  const cards = [...reviewCards, ...newCards];

  const reviewedTodayCount = await prisma.reviewLog.count({
    where: {
      reviewedAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
      userWord: {
        userId,
      },
    },
  });

  const remainingCount = cards.length;
  const totalTodayCount = reviewedTodayCount + remainingCount;

  const progress =
      totalTodayCount === 0
          ? 100
          : Math.round((reviewedTodayCount / totalTodayCount) * 100);

  return {
    reviewedTodayCount,
    remainingCount,
    totalTodayCount,
    progress,
    cards,
  };
}