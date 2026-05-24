import { Languages } from "lucide-react";

import { cn } from "@/lib/utils";

type FlashcardProps = {
    front: string;
    back: string;
    showBack: boolean;
    onToggle: () => void;
    languageFrom: string;
    languageTo: string;
};

export function Flashcard({
    front,
    back,
    showBack,
    onToggle,
    languageFrom,
    languageTo,
}: FlashcardProps) {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "group relative flex min-h-80 w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white p-5 text-left shadow-[0_22px_55px_rgba(73,148,205,0.20)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_28px_70px_rgba(73,148,205,0.26)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 sm:min-h-96 sm:p-7",
                showBack && "border-primary/35 bg-sky-50"
            )}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/12 px-3 py-1.5 text-xs font-black uppercase text-primary">
                    <Languages className="size-4" />
                    {showBack ? languageTo : languageFrom}
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                    {showBack ? "Rückseite" : "Vorderseite"}
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center px-2 py-8 text-center">
                <span className="text-4xl font-black leading-tight text-slate-900 transition duration-300 group-hover:scale-[1.02] sm:text-6xl">
                    {showBack ? back : front}
                </span>
            </div>

            <div className="mx-auto h-2 w-24 rounded-full bg-primary/20" />
        </button>
    );
}
