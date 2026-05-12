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
};

export function LearnClient({ initialCards }: LearnClientProps) {
    const [cards, setCards] = useState(initialCards);
    const [showBack, setShowBack] = useState(false);

    async function reviewCard(rating: Rating) {
        const currentCard = cards[0];

        await fetch("/api/review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userWordId: currentCard.id,
                rating,
            }),
        });

        setCards((prev) => prev.filter((card) => card.id !== currentCard.id));
        setShowBack(false);
    }

    if (cards.length === 0) {
        return (
            <main className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Heute erledigt 🎉</h1>
                    <p className="text-gray-600">Alle fälligen Karten wurden gelernt.</p>
                </div>
            </main>
        );
    }

    const currentCard = cards[0];

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8">
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