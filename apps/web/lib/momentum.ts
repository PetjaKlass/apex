export type MomentumResult = {
  momentum: number;
  level: number;
  levelName: string;
  xpInLevel: number;
  xpForNext: number;
  pct: number;
};
const RANKS = ['Seeker', 'Builder', 'Operator', 'Founder', 'Apex'];
export function calcMomentum(input: {
  tasksDone: number;
  habitsLogged: number;
  obtDone: boolean;
}): MomentumResult {
  const base = input.tasksDone * 25 + input.habitsLogged * 15 + (input.obtDone ? 50 : 0);
  const momentum = 120 + base;
  const perLevel = 320;
  const level = Math.floor(momentum / perLevel) + 1;
  const xpInLevel = momentum % perLevel;
  const levelName = RANKS[Math.min(level - 1, RANKS.length - 1)] ?? 'Seeker';
  return { momentum, level, levelName, xpInLevel, xpForNext: perLevel, pct: xpInLevel / perLevel };
}
