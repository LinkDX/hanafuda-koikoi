import type { CardId } from './cards';
import type { Rng } from './rng';

export function buildDeck(): CardId[] {
  return Array.from({ length: 48 }, (_, i) => i);
}

/** Fisher–Yates，不改變輸入 */
export function shuffle(cards: readonly CardId[], rng: Rng): CardId[] {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export interface Deal {
  hands: [CardId[], CardId[]];
  field: CardId[];
  deck: CardId[];
}

/** 標準こいこい發牌：親/子各 8、場札 8、牌堆 24 */
export function deal(rng: Rng): Deal {
  const shuffled = shuffle(buildDeck(), rng);
  return {
    hands: [shuffled.slice(0, 8), shuffled.slice(8, 16)],
    field: shuffled.slice(16, 24),
    deck: shuffled.slice(24),
  };
}
