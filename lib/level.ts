const XP_PER_LEVEL = 100;

export type LevelProgress = {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
};

export function getLevelProgress(xp: number): LevelProgress {
  const safeXp = Math.max(0, xp);
  const level = Math.floor(safeXp / XP_PER_LEVEL) + 1;
  const currentLevelXp = (level - 1) * XP_PER_LEVEL;
  const nextLevelXp = level * XP_PER_LEVEL;
  const xpIntoLevel = safeXp - currentLevelXp;

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    xpIntoLevel,
    xpForNextLevel: XP_PER_LEVEL,
    progress: Math.min(100, Math.round((xpIntoLevel / XP_PER_LEVEL) * 100)),
  };
}
