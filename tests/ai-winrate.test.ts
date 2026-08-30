import { describe, expect, it } from 'vitest';
import { createAI } from '../src/ai';
import { playMatch } from '../src/ai/runner';
import { createRng } from '../src/core/rng';
import { DEFAULT_RULES } from '../src/core/rules';
import type { AILevel } from '../src/ai';

const R6 = { ...DEFAULT_RULES, totalRounds: 6 as const };

async function winrate(levelA: AILevel, levelB: AILevel, matches: number): Promise<number> {
  let aWins = 0;
  let decided = 0;
  for (let seed = 1; seed <= matches; seed++) {
    const aFirst = seed % 2 === 0;
    const a = createAI(levelA, createRng(seed * 31));
    const b = createAI(levelB, createRng(seed * 31 + 7));
    const final = await playMatch(aFirst ? [a, b] : [b, a], R6, seed);
    const [s0, s1] = final.scores;
    if (s0 === s1) continue;
    decided++;
    const aScore = aFirst ? s0 : s1;
    const bScore = aFirst ? s1 : s0;
    if (aScore > bScore) aWins++;
  }
  return aWins / decided;
}

describe('高級 AI', () => {
  it('level3 vs level3 完整對局 ×20 seeds 不拋錯（合法性）', async () => {
    for (let seed = 1; seed <= 20; seed++) {
      const final = await playMatch(
        [createAI(3, createRng(seed)), createAI(3, createRng(seed + 999))],
        R6,
        seed,
      );
      expect(final.phase).toBe('matchEnd');
    }
  }, 60000);

  it('level3 對 level1 勝率 ≥ 65%（300 場）', async () => {
    const rate = await winrate(3, 1, 300);
    expect(rate).toBeGreaterThanOrEqual(0.65);
  }, 180000);

  it('level3 對 level2 勝率 ≥ 55%（300 場）', async () => {
    const rate = await winrate(3, 2, 300);
    expect(rate).toBeGreaterThanOrEqual(0.55);
  }, 180000);
});
