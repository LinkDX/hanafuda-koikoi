import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, computeAchievements } from '../src/achievements/defs';
import type { MatchRecord, MatchRecordRound } from '../src/storage/provider';

function round(partial: Partial<MatchRecordRound>): MatchRecordRound {
  return { winner: 0, points: 5, yaku: [{ id: 'akatan', points: 5 }], koikoi: [0, 0], ...partial };
}

let seq = 0;
function match(partial: Partial<MatchRecord>): MatchRecord {
  return {
    schemaVersion: 1,
    id: `m${seq++}`,
    timestamp: 1700000000000 + seq,
    aiLevel: 2,
    totalRounds: 3,
    finalScores: [10, 5],
    winner: 0,
    rounds: [round({})],
    ...partial,
  };
}

describe('computeAchievements', () => {
  it('空紀錄無成就', () => {
    expect(computeAchievements([]).size).toBe(0);
  });

  it('首勝與等級制霸', () => {
    const got = computeAchievements([match({ aiLevel: 3 })]);
    expect(got.has('first-win')).toBe(true);
    expect(got.has('beat-level-3')).toBe(true);
    expect(got.has('beat-level-1')).toBe(false);
  });

  it('輸的場次不解鎖勝利類成就', () => {
    const got = computeAchievements([match({ winner: 1, rounds: [round({ winner: 1 })] })]);
    expect(got.has('first-win')).toBe(false);
    expect(got.has('yaku-akatan')).toBe(false);
  });

  it('役圖鑑：只計自己贏的局', () => {
    const got = computeAchievements([
      match({ rounds: [round({ yaku: [{ id: 'gokou', points: 10 }] }), round({ winner: 1, yaku: [{ id: 'aotan', points: 5 }] })] }),
    ]);
    expect(got.has('yaku-gokou')).toBe(true);
    expect(got.has('yaku-aotan')).toBe(false);
  });

  it('三連勝要連續', () => {
    const w = () => match({ winner: 0 });
    const l = () => match({ winner: 1 });
    expect(computeAchievements([w(), l(), w(), w()]).has('streak-3')).toBe(false);
    expect(computeAchievements([l(), w(), w(), w()]).has('streak-3')).toBe(true);
  });

  it('完封、大勝、單局高分', () => {
    const got = computeAchievements([
      match({ finalScores: [31, 0], rounds: [round({ points: 14 })] }),
    ]);
    expect(got.has('shutout')).toBe(true);
    expect(got.has('big-match')).toBe(true);
    expect(got.has('big-round')).toBe(true);
  });

  it('こいこい大成功與見事反殺', () => {
    const got = computeAchievements([
      match({ rounds: [round({ koikoi: [1, 0] }), round({ koikoi: [0, 2] })] }),
    ]);
    expect(got.has('koikoi-win')).toBe(true);
    expect(got.has('counter-win')).toBe(true);
  });

  it('即勝（手四／くっつき）', () => {
    const got = computeAchievements([
      match({ rounds: [round({ yaku: [], points: 6, instantWin: 'teshi' })] }),
    ]);
    expect(got.has('instant-win')).toBe(true);
  });

  it('場數成就（輸贏都算場數）', () => {
    const games = Array.from({ length: 10 }, () => match({ winner: 1, rounds: [round({ winner: 1 })] }));
    const got = computeAchievements(games);
    expect(got.has('veteran-10')).toBe(true);
    expect(got.has('veteran-50')).toBe(false);
  });

  it('成就定義 id 唯一且判定不拋錯', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(20);
  });
});
