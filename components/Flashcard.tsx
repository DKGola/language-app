type FlashcardProps = {
    front: string;
    back: string;
    showBack: boolean;
    onToggle: () => void;
};

export function Flashcard({ front, back, showBack, onToggle }: FlashcardProps) {
    return (
        <button
            onClick={onToggle}
            className="w-full max-w-xl min-h-64 rounded-2xl border shadow-md p-8 flex items-center justify-center text-center hover:shadow-lg transition"
        >
      <span className="text-4xl font-bold">
        {showBack ? back : front}
      </span>
        </button>
    );
}