import { matches } from '../core/cards';
import type { CardId } from '../core/cards';
import type { Rng } from '../core/rng';
import type { PlayerView } from '../core/view';
import { yakuStatus } from '../core/yaku';
import { captureGain, opponentThreat, rawValue, unseenCards } from './common';
import type { AIStrategy, KoiKoiContext } from './types';

/** 中級：役型意識啟發式＋基本防守，保守こいこい */
export function createLevel2(rng: Rng): AIStrategy {
  return {
    async chooseHandCard(view: PlayerView): Promise<CardId> {
      let best: CardId = view.hand[0]!;
      let bestScore = -Infinity;
      for (const card of view.hand) {
        const options = view.field.filter((f) => matches(f, card));
        let score: number;
        if (options.length > 0) {
          score = Math.max(...options.map((o) => captureGain(view, [card, o])));
          if (options.length === 3) score = captureGain(view, [card, ...options]);
        } else {
          // 丟牌：避免餵給對手關鍵牌
          score = -1 - opponentThreat(view, card) - rawValue(card) * 0.1;
        }
        score += rng() * 0.01; // 平手時隨機打散
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
        // 自己的收益＋拿走對手想要的牌（阻擋）
        const score = captureGain(view, [played, o]) + opponentThreat(view, o) * 0.5;
        if (score > bestScore) {
          bestScore = score;
          best = o;
        }
      }
      return best;
    },

    async decideKoiKoi(view: PlayerView, ctx: KoiKoiContext): Promise<boolean> {
      if (view.hand.length < 2) return false;
      if (ctx.currentPoints >= 7) return false; // 已翻倍門檻，見好就收

      const unseen = new Set(unseenCards(view));
      // 自己是否有臨門一腳且牌還沒現身的役
      const myImminent = yakuStatus(view.myCaptured, view.rules).some(
        (y) => !y.met && y.needed.length === 1 && unseen.has(y.needed[0]!),
      );
      // 對手是否臨門
      const oppImminent = yakuStatus(view.oppCaptured, view.rules).some(
        (y) => !y.met && y.needed.length === 1,
      );
      return myImminent && !oppImminent;
    },
  };
}
