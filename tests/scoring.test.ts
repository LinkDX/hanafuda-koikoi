import { describe, expect, it } from 'vitest';
import { computeRoundScore, INSTANT_WIN_POINTS } from '../src/core/scoring';
import { DEFAULT_RULES } from '../src/core/rules';
import { detectYaku } from '../src/core/yaku';

const R = DEFAULT_RULES;

describe('computeRoundScore', () => {
  it('未達 7 點且無こいこい：原分', () => {
    const yaku = detectYaku([1, 5, 9], R); // 赤短 5
    const s = computeRoundScore(yaku, { opponentDeclaredKoiKoi: false }, R);
    expect(s.base).toBe(5);
    expect(s.total).toBe(5);
    expect(s.multipliers).toEqual([]);
  });

  it('7 點以上 ×2', () => {
    const yaku = detectYaku([0, 8, 28, 40], R); // 雨四光 7
    const s = computeRoundScore(yaku, { opponentDeclaredKoiKoi: false }, R);
    expect(s.base).toBe(7);
    expect(s.total).toBe(14);
    expect(s.multipliers).toContain('sevenPointDouble');
  });

  it('對手こいこい中 ×2', () => {
    const yaku = detectYaku([1, 5, 9], R); // 5 點
    const s = computeRoundScore(yaku, { opponentDeclaredKoiKoi: true }, R);
    expect(s.total).toBe(10);
    expect(s.multipliers).toContain('koikoiOpponentDouble');
  });

  it('兩者疊加 ×4', () => {
    const yaku = detectYaku([0, 8, 28, 40], R); // 7 點
    const s = computeRoundScore(yaku, { opponentDeclaredKoiKoi: true }, R);
    expect(s.total).toBe(28);
  });

  it('關閉變體後不翻倍', () => {
    const rules = { ...R, sevenPointDouble: false, koikoiOpponentDouble: false };
    const yaku = detectYaku([0, 8, 28, 40], rules);
    const s = computeRoundScore(yaku, { opponentDeclaredKoiKoi: true }, rules);
    expect(s.total).toBe(7);
  });

  it('多役加總：赤短5＋タン(6張)2 = 7 → ×2', () => {
    const yaku = detectYaku([1, 5, 9, 13, 17, 25], R);
    const s = computeRoundScore(yaku, { opponentDeclaredKoiKoi: false }, R);
    expect(s.base).toBe(7);
    expect(s.total).toBe(14);
  });

  it('手四／くっつき即勝 6 點', () => {
    expect(INSTANT_WIN_POINTS).toBe(6);
  });
});
