import type { YakuId } from '../core/yaku';
import type { MatchRecord } from './provider';

export interface LevelStats {
  games: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface AggregateStats {
  totalGames: number;
  perLevel: Record<1 | 2 | 3, LevelStats>;
  /** 玩家單局最高得分 */
  bestRoundScore: number;
  /** 玩家達成的役次數 */
  yakuCounts: Partial<Record<YakuId, number>>;
}

export function computeStats(records: readonly MatchRecord[]): AggregateStats {
  const perLevel: Record<1 | 2 | 3, LevelStats> = {
    1: { games: 0, wins: 0, losses: 0, draws: 0 },
    2: { games: 0, wins: 0, losses: 0, draws: 0 },
    3: { games: 0, wins: 0, losses: 0, draws: 0 },
  };
  let bestRoundScore = 0;
  const yakuCounts: Partial<Record<YakuId, number>> = {};

  for (const r of records) {
    const level = perLevel[r.aiLevel];
    level.games++;
    if (r.winner === 0) level.wins++;
    else if (r.winner === 1) level.losses++;
    else level.draws++;

    for (const round of r.rounds) {
      if (round.winner !== 0) continue;
      bestRoundScore = Math.max(bestRoundScore, round.points);
      for (const y of round.yaku) {
        yakuCounts[y.id] = (yakuCounts[y.id] ?? 0) + 1;
      }
    }
  }

  return { totalGames: records.length, perLevel, bestRoundScore, yakuCounts };
}
