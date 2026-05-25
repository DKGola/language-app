export type AppTheme = {
  id: string;
  name: string;
  requiredLevel: number;
  swatchClassName: string;
};

export const APP_THEMES: AppTheme[] = [
  {
    id: "sky",
    name: "Himmel",
    requiredLevel: 1,
    swatchClassName: "bg-sky-300",
  },
  {
    id: "mint",
    name: "Mint",
    requiredLevel: 2,
    swatchClassName: "bg-emerald-300",
  },
  {
    id: "sunrise",
    name: "Sunrise",
    requiredLevel: 4,
    swatchClassName: "bg-amber-300",
  },
  {
    id: "lavender",
    name: "Lavendel",
    requiredLevel: 6,
    swatchClassName: "bg-violet-300",
  },
  {
    id: "grid",
    name: "Raster",
    requiredLevel: 8,
    swatchClassName: "bg-slate-300",
  },
  {
    id: "orchard",
    name: "Garten",
    requiredLevel: 10,
    swatchClassName: "bg-lime-300",
  },
  {
    id: "coral",
    name: "Koralle",
    requiredLevel: 13,
    swatchClassName: "bg-rose-300",
  },
  {
    id: "night",
    name: "Nacht",
    requiredLevel: 16,
    swatchClassName: "bg-indigo-800",
  },
  {
    id: "aurora",
    name: "Aurora",
    requiredLevel: 20,
    swatchClassName: "bg-teal-300",
  },
];

export const DEFAULT_THEME_ID = APP_THEMES[0].id;

export function getUnlockedThemes(level: number) {
  return APP_THEMES.filter((theme) => theme.requiredLevel <= level);
}

export function getNextTheme(level: number) {
  return APP_THEMES.find((theme) => theme.requiredLevel > level) ?? null;
}
