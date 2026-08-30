import { matches } from '../core/cards';
import type { CardId } from '../core/cards';
import type { Rng } from '../core/rng';
import type { PlayerView } from '../core/view';
import { rawValue } from './common';
import type { AIStrategy } from './types';

/** 初級：貪心配對＋隨機擾動，永不こいこい */
export function createLevel1(rng: Rng): AIStrategy {
  return {
    async chooseHandCard(view: PlayerView): Promise<CardId> {
      // 15% 隨機出牌，讓行為可被擊敗
      if (rng() < 0.15) return view.hand[Math.floor(rng() * view.hand.length)]!;

      let best: CardId | null = null;
      let bestValue = -1;
      for (const card of view.hand) {
        const options = view.field.filter((f) => matches(f, card));
        if (options.length === 0) continue;
        const value = Math.max(...options.map(rawValue)) + rawValue(card);
        if (value > bestValue) {
          bestValue = value;
          best = card;
        }
      }
      if (best !== null) return best;

      // 無配對：丟牌面價值最低的
      return [...view.hand].sort((a, b) => rawValue(a) - rawValue(b))[0]!;
    },

    async chooseFieldMatch(_view, _played, options): Promise<CardId> {
      return [...options].sort((a, b) => rawValue(b) - rawValue(a))[0]!;
    },

    async decideKoiKoi(): Promise<boolean> {
      return false;
    },
  };
}
