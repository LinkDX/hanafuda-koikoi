import { describe, expect, it } from 'vitest';
import { createAI } from '../src/ai';
import { playMatch } from '../src/ai/runner';
import { DEFAULT_RULES } from '../src/core/rules';
import { createRng } from '../src/core/rng';
import type { PlayerView } from '../src/core/view';

const R3 = { ...DEFAULT_RULES, totalRounds: 3 as const };

function makeView(partial: Partial<PlayerView>): PlayerView {
  return {
    me: 1,
    phase: 'awaitHandCard',
    turn: 1,
    round: 1,
    scores: [0, 0],
    rules: DEFAULT_RULES,
    hand: [],
    field: [],
    myCaptured: [],
    oppCaptured: [],
    deckCount: 20,
    oppHandCount: 6,
    koikoiDeclared: [0, 0],
    ...partial,
  };
}

describe('AI 合法性（引擎會對非法動作丟錯）', () => {
  it('level1 vs level1 完整對局 ×30 seeds 不拋錯', async () => {
    for (let seed = 1; seed <= 30; seed++) {
      const final = await playMatch(
        [createAI(1, createRng(seed)), createAI(1, createRng(seed + 1000))],
        R3,
        seed,
      );
      expect(final.phase).toBe('matchEnd');
    }
  });

  it('level2 vs level2 完整對局 ×30 seeds 不拋錯', async () => {
    for (let seed = 1; seed <= 30; seed++) {
      const final = await playMatch(
        [createAI(2, createRng(seed)), createAI(2, createRng(seed + 1000))],
        R3,
        seed,
      );
      expect(final.phase).toBe('matchEnd');
    }
  });
});

describe('level2 行為', () => {
  it('對手赤短差一張時，不丟出關鍵短冊', async () => {
    const ai = createAI(2, createRng(1));
    // 對手已吃 [1,5]（松梅赤短），我手上有 9（桜赤短）與 47（桐カス），場上無可配對
    const view = makeView({
      hand: [9, 47],
      field: [30, 18], // 8月カス、5月カス — 與手牌無配對
      oppCaptured: [1, 5],
    });
    const choice = await ai.chooseHandCard(view);
    expect(choice).toBe(47);
  });

  it('可完成自己的役時優先吃', async () => {
    const ai = createAI(2, createRng(1));
    // 我已吃 [1,5]，手上 9（桜赤短，場上有 10 可配）與 46（桐カス，場上有 47）
    const view = makeView({
      hand: [9, 46],
      field: [10, 47],
      myCaptured: [1, 5],
    });
    const choice = await ai.chooseHandCard(view);
    expect(choice).toBe(9);
  });
});

describe('AI 強度階梯', () => {
  it('level2 對 level1 勝率 ≥ 55%（100 場）', async () => {
    let l2Wins = 0;
    let decided = 0;
    for (let seed = 1; seed <= 100; seed++) {
      // 交換先後手消除親的優勢
      const l2First = seed % 2 === 0;
      const strategies = l2First
        ? ([createAI(2, createRng(seed)), createAI(1, createRng(seed + 5000))] as const)
        : ([createAI(1, createRng(seed + 5000)), createAI(2, createRng(seed))] as const);
      const final = await playMatch([strategies[0], strategies[1]], R3, seed);
      const [a, b] = final.scores;
      if (a === b) continue;
      decided++;
      const l2Score = l2First ? a : b;
      const l1Score = l2First ? b : a;
      if (l2Score > l1Score) l2Wins++;
    }
    expect(l2Wins / decided).toBeGreaterThanOrEqual(0.55);
  }, 60000);
});
