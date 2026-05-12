type Rating = "again" | "good" | "easy";

type ReviewButtonsProps = {
    onReview: (rating: Rating) => void;
};

export function ReviewButtons({ onReview }: ReviewButtonsProps) {
    return (
        <div className="mt-8 flex gap-4">
            <button
                onClick={() => onReview("again")}
                className="rounded-xl border px-6 py-3 hover:bg-gray-100"
            >
                Again
            </button>

            <button
                onClick={() => onReview("good")}
                className="rounded-xl border px-6 py-3 hover:bg-gray-100"
            >
                Good
            </button>

            <button
                onClick={() => onReview("easy")}
                className="rounded-xl border px-6 py-3 hover:bg-gray-100"
            >
                Easy
            </button>
        </div>
    );
}