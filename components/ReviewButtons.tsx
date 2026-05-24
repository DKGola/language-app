import { Check, RotateCcw, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

type Rating = "again" | "good" | "easy";

type ReviewButtonsProps = {
    onReview: (rating: Rating) => void | Promise<void>;
    disabled?: boolean;
};

export function ReviewButtons({ onReview, disabled = false }: ReviewButtonsProps) {
    return (
        <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <Button
                type="button"
                onClick={() => onReview("again")}
                disabled={disabled}
                variant="outline"
                className="h-14 rounded-2xl border-rose-200 bg-white text-base font-black text-rose-600 shadow-[0_5px_0_rgba(244,63,94,0.16)] hover:bg-rose-50 active:translate-y-1 active:shadow-none"
            >
                <RotateCcw className="size-5" />
                Again
            </Button>

            <Button
                type="button"
                onClick={() => onReview("good")}
                disabled={disabled}
                className="h-14 rounded-2xl bg-primary text-base font-black shadow-[0_5px_0_rgba(21,101,192,0.24)] hover:bg-primary/90 active:translate-y-1 active:shadow-none"
            >
                <Check className="size-5" />
                Good
            </Button>

            <Button
                type="button"
                onClick={() => onReview("easy")}
                disabled={disabled}
                className="h-14 rounded-2xl bg-emerald-500 text-base font-black text-white shadow-[0_5px_0_rgba(16,185,129,0.24)] hover:bg-emerald-500/90 active:translate-y-1 active:shadow-none"
            >
                <Zap className="size-5" />
                Easy
            </Button>
        </div>
    );
}
