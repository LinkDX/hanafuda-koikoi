import { cardOf } from './cards';
import type { CardId } from './cards';

function monthCounts(cards: readonly CardId[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const id of cards) {
    const m = cardOf(id).month;
    counts.set(m, (counts.get(m) ?? 0) + 1);
  }
  return counts;
}

/** 手四：手牌有同月 4 張 */
export function checkTeshi(hand: readonly CardId[]): boolean {
  return [...monthCounts(hand).values()].some((n) => n === 4);
}

/** くっつき：手牌恰為 4 組同月對子（不含手四） */
export function checkKuttsuki(hand: readonly CardId[]): boolean {
  const counts = [...monthCounts(hand).values()];
  return counts.length === 4 && counts.every((n) => n === 2);
}

/** 場札手四：場上同月 4 張 → 重發 */
export function fieldTeshi(field: readonly CardId[]): boolean {
  return [...monthCounts(field).values()].some((n) => n === 4);
}
