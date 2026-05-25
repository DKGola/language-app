"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cat, Flame, Gem, Layers, Award, Trophy } from "lucide-react";
import { Flashcard } from "@/components/Flashcard";
import { ReviewButtons } from "@/components/ReviewButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLevelProgress } from "@/lib/level";

type Rating = "again" | "good" | "easy";

type StudyCard = {
    id: string;
    interval: number;
    repetitions: number;
    easeFactor: number;
    isNew: boolean;
    word: {
        front: string;
        back: string;
        languageFrom: string;
        languageTo: string;
    };
};

type LearnClientProps = {
    initialCards: StudyCard[];
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalCount = initialTotalTodayCount;
    const levelProgress = getLevelProgress(xp);
    const progress =
        totalCount === 0
            ? 100
            : Math.min(100, Math.round((reviewedCount / totalCount) * 100));

    async function reviewCard(rating: Rating) {
        const currentCard = cards[0];
        setIsSubmitting(true);
        setError(null);

        try {
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

            if (!res.ok) {
                setError("Die Karte konnte nicht gespeichert werden.");
                return;
            }

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
        } catch {
            setError("Die Verbindung ist gerade unterbrochen.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (cards.length === 0) {
        return (
            <main className="min-h-screen px-4 py-5 sm:px-8 sm:py-8">
                <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-3xl flex-col gap-6">
                    <LearningTopBar
                        streak={streak}
                        xp={xp}
                        level={levelProgress.level}
                    />

                    <Card className="my-auto border-emerald-100 bg-white/90">
                        <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
                            <div className="mb-6 flex size-20 items-center justify-center rounded-[2rem] bg-emerald-100 text-emerald-600">
                                <Trophy className="size-10" />
                            </div>
                            <p className="mb-2 text-sm font-black uppercase text-emerald-600">
                                Tagesziel erreicht
                            </p>
                            <h1 className="text-4xl font-black text-slate-900">
                                Heute erledigt
                            </h1>
                            <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                                {reviewedCount} von {totalCount} Karten sind für heute
                                geschafft.
                            </p>
                            <Button
                                asChild
                                className="mt-8 h-12 rounded-2xl px-6 font-black"
                            >
                                <Link href="/">
                                    <ArrowLeft className="size-5" />
                                    Dashboard
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        );
    }

    const currentCard = cards[0];

    return (
        <main className="min-h-screen px-4 py-5 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
                <LearningTopBar
                    streak={streak}
                    xp={xp}
                    level={levelProgress.level}
                />

                <section className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                    <Button
                        asChild
                        variant="outline"
                        className="h-11 justify-start rounded-2xl border-white/80 bg-white/80 font-bold shadow-sm"
                    >
                        <Link href="/">
                            <ArrowLeft className="size-5" />
                            Dashboard
                        </Link>
                    </Button>

                    <Card className="border-sky-100">
                        <CardContent className="p-4">
                            <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-muted-foreground">
                                <span>
                                    {reviewedCount} / {totalCount} erledigt
                                </span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} />
                        </CardContent>
                    </Card>

                    <div className="flex h-11 items-center justify-center rounded-2xl bg-white/80 px-4 text-sm font-black text-primary shadow-sm">
                        {cards.length} offen
                    </div>
                </section>

                <section className="flex flex-col items-center gap-5 pt-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-primary shadow-sm">
                        <Layers className="size-4" />
                        {currentCard.isNew ? "Neue Karte" : "Wiederholung"}
                    </div>

                    <Flashcard
                        front={currentCard.word.front}
                        back={currentCard.word.back}
                        showBack={showBack}
                        onToggle={() => setShowBack((prev) => !prev)}
                        languageFrom={currentCard.word.languageFrom}
                        languageTo={currentCard.word.languageTo}
                    />

                    {error && (
                        <div className="w-full max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                            {error}
                        </div>
                    )}

                    {showBack && (
                        <ReviewButtons
                            onReview={reviewCard}
                            disabled={isSubmitting}
                        />
                    )}
                </section>
            </div>
        </main>
    );
}

function LearningTopBar({
    streak,
    xp,
    level,
}: {
    streak: number;
    xp: number;
    level: number;
}) {
    return (
        <header className="flex items-center justify-between gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                    <Cat className="size-5" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-black">Vocat</p>
                    <p className="truncate text-xs text-muted-foreground">
                        Lernsession
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <div className="flex h-10 items-center gap-1.5 rounded-full bg-orange-100 px-3 text-sm font-black text-orange-700">
                    <Flame className="size-4" />
                    {streak}
                </div>
                <div className="flex h-10 items-center gap-1.5 rounded-full bg-sky-100 px-3 text-sm font-black text-sky-700">
                    <Gem className="size-4" />
                    {xp}
                </div>
                <div className="hidden h-10 items-center gap-1.5 rounded-full bg-violet-100 px-3 text-sm font-black text-violet-700 sm:flex">
                    <Award className="size-4" />
                    {level}
                </div>
            </div>
        </header>
    );
}
