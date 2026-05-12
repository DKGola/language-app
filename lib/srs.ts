export type Rating = "again" | "good" | "easy";

type SrsInput = {
    currentInterval: number;
    repetitions: number;
    easeFactor: number;
    rating: Rating;
};

export function calculateNextReview(input: SrsInput) {
    let interval = input.currentInterval;
    let repetitions = input.repetitions;
    let easeFactor = input.easeFactor;

    if (input.rating === "again") {
        interval = 1;
        repetitions = 0;
        easeFactor = Math.max(1.3, easeFactor - 0.2);
    }

    if (input.rating === "good") {
        repetitions += 1;
        interval = repetitions === 1 ? 1 : Math.round(interval * easeFactor);
    }

    if (input.rating === "easy") {
        repetitions += 1;
        easeFactor += 0.15;
        interval = Math.max(3, Math.round(interval * easeFactor * 1.3));
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + interval);

    return {
        interval,
        repetitions,
        easeFactor,
        dueDate,
    };
}