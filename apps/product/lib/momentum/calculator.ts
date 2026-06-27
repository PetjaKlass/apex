/**
 * Momentum-Platzhalter (echte XP-Engine: Phase 17). Leitet einen Wert aus heutiger Aktivität ab,
 * damit das Dashboard sich vom ersten Tag „lebendig" anfühlt. Reine Funktion, deterministisch.
 */
export type MomentumResult = {
  momentum: number;
  level: number;
  levelName: string;
  xpInLevel: number;
  xpForNext: number;
  pct: number; // 0..1 Fortschritt im Level
};

const RANKS = ['Seeker', 'Builder', 'Operator', 'Founder', 'Apex'];

export function calcMomentum(input: {
  tasksDone: number;
  habitsLogged: number;
  obtDone: boolean;
}): MomentumResult {
  const base = input.tasksDone * 25 + input.habitsLogged * 15 + (input.obtDone ? 50 : 0);
  // sanftes Grundrauschen, damit der Ring nie ganz leer wirkt
  const momentum = 120 + base;
  const perLevel = 320;
  const level = Math.floor(momentum / perLevel) + 1;
  const xpInLevel = momentum % perLevel;
  const levelName = RANKS[Math.min(level - 1, RANKS.length - 1)] ?? 'Seeker';
  return { momentum, level, levelName, xpInLevel, xpForNext: perLevel, pct: xpInLevel / perLevel };
}
