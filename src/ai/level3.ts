import { cardOf, matches } from '../core/cards';
import type { CardId } from '../core/cards';
import type { Rng } from '../core/rng';
import type { PlayerView } from '../core/view';
import { yakuStatus } from '../core/yaku';
import { opponentThreat, rawValue, unseenCards } from './common';
import type { AIStrategy, KoiKoiContext } from './types';

const COUNT_THRESHOLD: Partial<Record<string, number>> = { tane: 5, tanzaku: 5, kasu: 10 };

/**
 * 高級：啟發式期望值 —
 * 算牌（未現身牌機率）、封鎖對手臨門役、こいこい風險期望值。
 */
export function createLevel3(rng: Rng): AIStrategy {
  /** 這張牌還能從場上或未見牌取得嗎 */
  const obtainableSet = (view: PlayerView): Set<CardId> =>
    new Set([...view.field, ...unseenCards(view)]);

  /** 役型潛力（期望值加權）：已成役全額；臨門役以取得機率折算 */
  const potentialEV = (view: PlayerView, captured: readonly CardId[]): number => {
    const obtainable = obtainableSet(view);
    const fieldSet = new Set(view.field);
    let score = 0;
    for (const y of yakuStatus(captured, view.rules)) {
      if (y.met) {
        score += y.points;
        continue;
      }
      const threshold = COUNT_THRESHOLD[y.id];
      if (threshold !== undefined) {
        const have = captured.filter((c) => cardOf(c).type === (y.id === 'tane' ? 'tane' : y.id === 'tanzaku' ? 'tanzaku' : 'kasu')).length;
        const distance = threshold - have;
        if (distance === 1) score += 1.2;
        else if (distance === 2) score += 0.5;
        continue;
      }
      if (y.needed.some((c) => !obtainable.has(c))) continue; // 已不可能
      if (y.needed.length === 1) {
        score += y.basePoints * (fieldSet.has(y.needed[0]!) ? 0.55 : 0.3);
      } else if (y.needed.length === 2) {
        score += y.basePoints * 0.15;
      }
    }
    return score;
  };

  /** 吃進 gained 的期望收益（光牌另計長期價值） */
  const captureGainEV = (view: PlayerView, gained: readonly CardId[]): number => {
    const before = potentialEV(view, view.myCaptured);
    const after = potentialEV(view, [...view.myCaptured, ...gained]);
    const face = gained.reduce((s, c) => s + rawValue(c), 0);
    const hikariBonus = gained.filter((c) => cardOf(c).type === 'hikari').length * 2.5;
    return face * 0.12 + hikariBonus + (after - before) * 2.2;
  };

  /** 丟出這張牌對「自己役型」的損失（它是我臨門役的關鍵牌） */
  const selfNeedLoss = (view: PlayerView, card: CardId): number => {
    let loss = 0;
    for (const y of yakuStatus(view.myCaptured, view.rules)) {
      if (y.met || !y.needed.includes(card)) continue;
      if (y.needed.length === 1) loss += y.basePoints * 0.6;
      else if (y.needed.length === 2) loss += y.basePoints * 0.2;
    }
    return loss;
  };

  /** 對手拿到此牌的機率加權威脅（丟牌用） */
  const feedRisk = (view: PlayerView, card: CardId): number => {
    const unseen = unseenCards(view);
    const partners = unseen.filter((c) => matches(c, card)).length;
    const pOppPairs = unseen.length === 0 ? 0 : Math.min(1, (view.oppHandCount * partners) / unseen.length + 0.15);
    return opponentThreat(view, card) * (0.5 + pOppPairs) + rawValue(card) * 0.08;
  };

  /** 對手臨門役風險（こいこい決策用） */
  const opponentRisk = (view: PlayerView): number => {
    let risk = 0;
    for (const y of yakuStatus(view.oppCaptured, view.rules)) {
      if (y.met) continue;
      const threshold = COUNT_THRESHOLD[y.id];
      if (threshold !== undefined) {
        const type = y.id === 'tane' ? 'tane' : y.id === 'tanzaku' ? 'tanzaku' : 'kasu';
        const have = view.oppCaptured.filter((c) => cardOf(c).type === type).length;
        if (threshold - have === 1) risk += 0.3;
        continue;
      }
      if (y.needed.length === 1) risk += 0.4;
      else if (y.needed.length === 2) risk += 0.1;
    }
    return risk;
  };

  return {
    async chooseHandCard(view: PlayerView): Promise<CardId> {
      let best: CardId = view.hand[0]!;
      let bestScore = -Infinity;
      for (const card of view.hand) {
        const options = view.field.filter((f) => matches(f, card));
        let score: number;
        if (options.length === 3) {
          score = captureGainEV(view, [card, ...options]) +
            options.reduce((s, o) => s + opponentThreat(view, o) * 0.6, 0);
        } else if (options.length > 0) {
          score = Math.max(
            ...options.map((o) => captureGainEV(view, [card, o]) + opponentThreat(view, o) * 0.6),
          );
        } else {
          score = -1.2 - feedRisk(view, card) - selfNeedLoss(view, card);
        }
        score += rng() * 0.01;
        if (score > bestScore) {
          bestScore = score;
          best = card;
        }
      }
      return best;
    },

    async chooseFieldMatch(view, played, options): Promise<CardId> {
      let best: CardId = options[0]!;
      let bestScore = -Infinity;
      for (const o of options) {
        const score = captureGainEV(view, [played, o]) + opponentThreat(view, o) * 0.6;
        if (score > bestScore) {
          bestScore = score;
          best = o;
        }
      }
      return best;
    },

    async decideKoiKoi(view: PlayerView, ctx: KoiKoiContext): Promise<boolean> {
      const base = ctx.currentPoints;
      if (view.hand.length < 2) return false;
      if (base >= 7) return false; // 已達翻倍門檻，收割

      const obtainable = obtainableSet(view);
      const fieldSet = new Set(view.field);
      // 我方續攻的成功機率估計
      let myChance = 0;
      for (const y of yakuStatus(view.myCaptured, view.rules)) {
        if (y.met) continue;
        const threshold = COUNT_THRESHOLD[y.id];
        if (threshold !== undefined) {
          const type = y.id === 'tane' ? 'tane' : y.id === 'tanzaku' ? 'tanzaku' : 'kasu';
          const have = view.myCaptured.filter((c) => cardOf(c).type === type).length;
          if (threshold - have === 1) myChance += 0.35;
          continue;
        }
        if (y.needed.some((c) => !obtainable.has(c))) continue;
        if (y.needed.length === 1) myChance += fieldSet.has(y.needed[0]!) ? 0.5 : 0.28;
      }
      myChance = Math.min(0.8, myChance);
      const risk = opponentRisk(view);

      // 期望值比較：
      //   勝負 = 確定拿 base（含翻倍）
      //   こいこい = pWin×(成長後總分) + p流局×0 − pLoss×(對手得分×2)
      const oppDeclared = view.koikoiDeclared[(1 - view.me) as 0 | 1] > 0;
      const withMult = (p: number): number => {
        let total = p;
        if (view.rules.sevenPointDouble && p >= 7) total *= 2;
        if (view.rules.koikoiOpponentDouble && oppDeclared) total *= 2;
        return total;
      };
      const evAgari = withMult(base);
      const pWin = myChance;
      const pLoss = Math.min(0.5, risk);
      const projectedTotal = withMult(base + 3); // 新役平均約 +3 點
      const lossIfCaught = 6 * (view.rules.koikoiOpponentDouble ? 2 : 1);
      const evKoi = pWin * projectedTotal - pLoss * lossIfCaught;
      return evKoi > evAgari;
    },
  };
}
