export const DIFFICULTY = {
  easy: 5,
  medium: 10,
  hard: 15,
  veryHard: 20,
  heroic: 25,
  legendary: 30,
} as const;

export type Rng = () => number;

export function rollD20(rng: Rng = Math.random): number {
  return Math.floor(rng() * 20) + 1;
}

export interface CheckInput {
  roll: number;
  modifier: number;
  rank: number;
  difficulty: number;
}

export interface CheckResult {
  total: number;
  success: boolean;
  critical: boolean;
}

/** JDR: d20 + modifier + rank ≥ difficulty; a natural 20 always succeeds, a natural 1 always fails. */
export function resolveCheck({ roll, modifier, rank, difficulty }: CheckInput): CheckResult {
  const total = roll + modifier + rank;
  if (roll === 20) return { total, success: true, critical: true };
  if (roll === 1) return { total, success: false, critical: true };
  return { total, success: total >= difficulty, critical: false };
}

/** Probability (0–1) shown to the player before an action roll. */
export function successChance(modifier: number, rank: number, difficulty: number): number {
  let successes = 0;
  for (let roll = 1; roll <= 20; roll++) {
    if (resolveCheck({ roll, modifier, rank, difficulty }).success) successes++;
  }
  return successes / 20;
}

/** Dialogue options use fixed thresholds, never dice. */
export function meetsThreshold(value: number, threshold: number): boolean {
  return value >= threshold;
}
