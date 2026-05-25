"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Check, Lock, Palette } from "lucide-react";
import { APP_THEMES, DEFAULT_THEME_ID, getNextTheme } from "@/lib/themes";
import {
  getStoredTheme,
  setStoredTheme,
  subscribeToTheme,
} from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

type ThemePanelProps = {
  level: number;
};

export function ThemePanel({ level }: ThemePanelProps) {
  const selectedTheme = useSyncExternalStore(
    subscribeToTheme,
    getStoredTheme,
    () => DEFAULT_THEME_ID
  );
  const nextTheme = useMemo(() => getNextTheme(level), [level]);

  function selectTheme(themeId: string) {
    setStoredTheme(themeId);
  }

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/86 p-5 shadow-[0_18px_45px_rgba(73,148,205,0.12)] backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-emerald-700">
            <Palette className="size-4" />
            Themes
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {nextTheme
              ? `Naechstes Theme: ${nextTheme.name} ab Level ${nextTheme.requiredLevel}.`
              : "Alle geplanten Themes sind freigeschaltet."}
          </p>
        </div>
        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
          Level {level}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {APP_THEMES.map((theme) => {
          const unlocked = theme.requiredLevel <= level;
          const selected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              disabled={!unlocked}
              onClick={() => selectTheme(theme.id)}
              className={cn(
                "group flex min-h-24 flex-col justify-between rounded-2xl border bg-white/78 p-3 text-left shadow-sm transition",
                selected
                  ? "border-primary ring-3 ring-primary/20"
                  : "border-white/80 hover:border-primary/40",
                !unlocked && "cursor-not-allowed opacity-55 hover:border-white/80"
              )}
              aria-pressed={selected}
            >
              <span className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "size-7 rounded-full border border-white shadow-inner",
                    theme.swatchClassName
                  )}
                />
                {unlocked ? (
                  selected && <Check className="size-4 text-primary" />
                ) : (
                  <Lock className="size-4 text-muted-foreground" />
                )}
              </span>
              <span>
                <span className="block text-sm font-black text-slate-900">
                  {theme.name}
                </span>
                <span className="mt-0.5 block text-xs font-bold text-muted-foreground">
                  {unlocked ? "Freigeschaltet" : `Ab Level ${theme.requiredLevel}`}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
