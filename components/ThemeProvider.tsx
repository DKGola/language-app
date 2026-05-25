"use client";

import { useEffect, useSyncExternalStore } from "react";
import { APP_THEMES, DEFAULT_THEME_ID } from "@/lib/themes";

const STORAGE_KEY = "vocat-theme";
const THEME_CHANGE_EVENT = "vocat-theme-change";
const THEME_IDS = new Set(APP_THEMES.map((theme) => theme.id));

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeId = useSyncExternalStore(
    subscribeToTheme,
    getStoredTheme,
    getServerTheme
  );

  useEffect(() => {
    document.documentElement.dataset.appTheme = themeId;
  }, [themeId]);

  return children;
}

function getServerTheme() {
  return DEFAULT_THEME_ID;
}

function isKnownTheme(themeId: string | null): themeId is string {
  return Boolean(themeId && THEME_IDS.has(themeId));
}

export function getStoredTheme() {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_ID;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);

  return isKnownTheme(storedTheme) ? storedTheme : DEFAULT_THEME_ID;
}

export function setStoredTheme(themeId: string) {
  if (!isKnownTheme(themeId)) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, themeId);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function subscribeToTheme(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export { STORAGE_KEY as THEME_STORAGE_KEY };
