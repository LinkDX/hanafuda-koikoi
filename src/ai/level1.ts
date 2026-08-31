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
      // 35% 隨機出牌：初級要讓新手也打得贏
      if (rng() < 0.35) return view.hand[Math.floor(rng() * view.hand.length)]!;

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

      // 無配對：隨便丟一張（不懂守牌）
      return view.hand[Math.floor(rng() * view.hand.length)]!;
    },

    async chooseFieldMatch(_view, _played, options): Promise<CardId> {
      // 30% 亂選
      if (rng() < 0.3) return options[Math.floor(rng() * options.length)]!;
      return [...options].sort((a, b) => rawValue(b) - rawValue(a))[0]!;
    },

    async decideKoiKoi(view: PlayerView): Promise<boolean> {
      // 初級不懂風險評估，偶爾興起喊一下（手牌快沒了就不喊）
      return view.hand.length >= 2 && rng() < 0.25;
    },
  };
}
