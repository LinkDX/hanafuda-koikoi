import type { RuleConfig } from './rules';
import type { YakuStatus } from './yaku';

/** 手四／くっつき即勝點數 */
export const INSTANT_WIN_POINTS = 6;

export type ScoreMultiplier = 'sevenPointDouble' | 'koikoiOpponentDouble';

export interface ScoreBreakdown {
  yaku: YakuStatus[];
  base: number;
  multipliers: ScoreMultiplier[];
  total: number;
}

export interface ScoreContext {
  /** 對手本局曾宣告こいこい */
  opponentDeclaredKoiKoi: boolean;
}

export function computeRoundScore(
  yaku: readonly YakuStatus[],
  ctx: ScoreContext,
  rules: RuleConfig,
): ScoreBreakdown {
  const base = yaku.reduce((sum, y) => sum + y.points, 0);
  const multipliers: ScoreMultiplier[] = [];
  if (rules.sevenPointDouble && base >= 7) multipliers.push('sevenPointDouble');
  if (rules.koikoiOpponentDouble && ctx.opponentDeclaredKoiKoi) multipliers.push('koikoiOpponentDouble');
  const total = base * 2 ** multipliers.length;
  return { yaku: [...yaku], base, multipliers, total };
}
