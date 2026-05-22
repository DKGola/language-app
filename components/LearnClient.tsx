"use client";

import { useState } from "react";
import { Flashcard } from "@/components/Flashcard";
import { ReviewButtons } from "@/components/ReviewButtons";

type Rating = "again" | "good" | "easy";

type Card = {
    id: string;
    interval: number;
    repetitions: number;
    easeFactor: number;
    word: {
        front: string;
        back: string;
        languageFrom: string;
        languageTo: string;
    };
};

type LearnClientProps = {
    initialCards: Card[];
    initialReviewedTodayCount: number;
    initialTotalTodayCount: number;
    initialStreak: number;
    initialXp: number;
};

export function LearnClient({
                                initialCards,
                                initialReviewedTodayCount,
                                initialTotalTodayCount,
                                initialStreak,
                                initialXp,
                            }: LearnClientProps) {
    const [cards, setCards] = useState(initialCards);
    const [showBack, setShowBack] = useState(false);
    const [reviewedCount, setReviewedCount] = useState(initialReviewedTodayCount);
    const [streak, setStreak] = useState(initialStreak);
    const [xp, setXp] = useState(initialXp);

    const totalCount = initialTotalTodayCount;
    const progress =
        totalCount === 0 ? 100 : Math.round((reviewedCount / totalCount) * 100);

    async function reviewCard(rating: Rating) {
        const currentCard = cards[0];

        const res = await fetch("/api/review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userWordId: currentCard.id,
                rating,
            }),
        });

        const data = await res.json();

        if (rating === "again") {
            setCards((prev) => [...prev.slice(1), currentCard]);
        } else {
            setCards((prev) => prev.slice(1));
            setReviewedCount((prev) => prev + 1);
        }

        if (data.dayCompleted) {
            setStreak((prev) => prev + 1);
            setXp((prev) => prev + 50);
        }

        setShowBack(false);
    }

    if (cards.length === 0) {
        return (
            <main className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Heute erledigt 🎉</h1>
                    <p className="text-gray-600">
                        Alle fälligen Karten wurden gelernt.
                    </p>
                    <p className="mt-4 text-sm text-gray-500">
                        {reviewedCount} / {totalCount} erledigt
                    </p>
                </div>
            </main>
        );
    }

    const currentCard = cards[0];

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="mb-6 w-full max-w-xl">
                <div className="mb-2 flex justify-between text-sm text-gray-500">
                  <span>
                    {reviewedCount} / {totalCount} erledigt
                  </span>
                    <span>{progress}%</span>
                </div>

                <div className="h-2 rounded-full bg-gray-200">
                    <div
                        className="h-2 rounded-full bg-black transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="mt-4 flex justify-center gap-4 text-sm text-gray-600">
                <span>🔥 {streak}</span>
                <span>⭐ {xp} XP</span>
            </div>

            <div className="mb-6 text-sm text-gray-500">
                Noch {cards.length} Karten
            </div>

            <Flashcard
                front={currentCard.word.front}
                back={currentCard.word.back}
                showBack={showBack}
                onToggle={() => setShowBack((prev) => !prev)}
            />

            {!showBack && (
                <p className="mt-4 text-gray-500">
                    Klicke auf die Karte, um die Antwort zu sehen.
                </p>
            )}

            {showBack && <ReviewButtons onReview={reviewCard} />}
        </main>
    );
}