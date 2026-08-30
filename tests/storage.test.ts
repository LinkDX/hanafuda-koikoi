import { describe, expect, it } from 'vitest';
import { LocalStorageProvider } from '../src/storage/localStorage';
import { computeStats } from '../src/storage/records';
import type { MatchRecord } from '../src/storage/provider';

/** 記憶體版 Storage（node 環境沒有 localStorage） */
function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() { return map.size; },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => void map.delete(k),
    setItem: (k, v) => void map.set(k, v),
  };
}

function record(partial: Partial<MatchRecord>): MatchRecord {
  return {
    schemaVersion: 1,
    id: 'r1',
    timestamp: 1700000000000,
    aiLevel: 2,
    totalRounds: 3,
    finalScores: [10, 5],
    winner: 0,
    rounds: [
      { winner: 0, points: 5, yaku: [{ id: 'akatan', points: 5 }], koikoi: [0, 0] },
      { winner: 1, points: 5, yaku: [{ id: 'tsukimiZake', points: 5 }], koikoi: [0, 1] },
      { winner: 0, points: 5, yaku: [{ id: 'sankou', points: 5 }], koikoi: [0, 0] },
    ],
    ...partial,
  };
}

describe('LocalStorageProvider', () => {
  it('addMatch / getMatches 往返一致', async () => {
    const p = new LocalStorageProvider(fakeStorage());
    expect(await p.getMatches()).toEqual([]);
    const r = record({});
    await p.addMatch(r);
    expect(await p.getMatches()).toEqual([r]);
  });

  it('設定存取往返', async () => {
    const p = new LocalStorageProvider(fakeStorage());
    expect(await p.getSettings()).toBeNull();
    await p.saveSettings({ aiLevel: 3, totalRounds: 6, hanamiZake: false, tsukimiZake: true, style: 'traditional' });
    expect((await p.getSettings())?.aiLevel).toBe(3);
  });

  it('clear 清空', async () => {
    const p = new LocalStorageProvider(fakeStorage());
    await p.addMatch(record({}));
    await p.clear();
    expect(await p.getMatches()).toEqual([]);
  });

  it('損壞資料回傳空陣列而非拋錯', async () => {
    const storage = fakeStorage();
    storage.setItem('hkk:records:v1', '{not json');
    const p = new LocalStorageProvider(storage);
    expect(await p.getMatches()).toEqual([]);
  });
});

describe('computeStats', () => {
  it('聚合勝率、役統計、單局最高分', () => {
    const records: MatchRecord[] = [
      record({ id: 'a', aiLevel: 1, winner: 0 }),
      record({ id: 'b', aiLevel: 1, winner: 1, finalScores: [3, 9] }),
      record({
        id: 'c', aiLevel: 3, winner: null, finalScores: [6, 6],
        rounds: [{ winner: 0, points: 14, yaku: [{ id: 'ameShikou', points: 7 }], koikoi: [1, 0] }],
      }),
    ];
    const stats = computeStats(records);
    expect(stats.totalGames).toBe(3);
    expect(stats.perLevel[1]).toEqual({ games: 2, wins: 1, losses: 1, draws: 0 });
    expect(stats.perLevel[3]).toEqual({ games: 1, wins: 0, losses: 0, draws: 1 });
    expect(stats.bestRoundScore).toBe(14);
    expect(stats.yakuCounts['akatan']).toBe(2);
    expect(stats.yakuCounts['ameShikou']).toBe(1);
  });

  it('空紀錄', () => {
    const stats = computeStats([]);
    expect(stats.totalGames).toBe(0);
    expect(stats.bestRoundScore).toBe(0);
  });
});
