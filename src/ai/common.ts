import { buildDeck } from '../core/deck';
import { cardOf } from '../core/cards';
import type { CardId } from '../core/cards';
import type { RuleConfig } from '../core/rules';
import type { PlayerView } from '../core/view';
import { yakuStatus } from '../core/yaku';

/** 牌面原始價值 */
export function rawValue(id: CardId): number {
  switch (cardOf(id).type) {
    case 'hikari': return 20;
    case 'tane': return 10;
    case 'tanzaku': return 5;
    case 'kasu': return 1;
  }
}

/** 尚未現身的牌（對手手牌＋牌堆） */
export function unseenCards(view: PlayerView): CardId[] {
  const visible = new Set<CardId>([
    ...view.hand,
    ...view.field,
    ...view.myCaptured,
    ...view.oppCaptured,
  ]);
  if (view.pendingCard !== undefined) visible.add(view.pendingCard);
  return buildDeck().filter((c) => !visible.has(c));
}

/**
 * 役型潛力分：已成役全額＋臨門役部分計分。
 * 供「吃進某些牌前後」差分使用。
 */
export function yakuPotential(captured: readonly CardId[], rules: RuleConfig): number {
  let score = 0;
  for (const y of yakuStatus(captured, rules)) {
    if (y.met) score += y.points;
    else if (y.needed.length === 1) score += y.points * 0.6;
    else if (y.needed.length === 2) score += y.points * 0.25;
  }
  return score;
}

/** 吃進 gained 之後的進步幅度（役潛力差分＋牌面價值） */
export function captureGain(view: PlayerView, gained: readonly CardId[]): number {
  const before = yakuPotential(view.myCaptured, view.rules);
  const after = yakuPotential([...view.myCaptured, ...gained], view.rules);
  const faceValue = gained.reduce((s, c) => s + rawValue(c), 0);
  return faceValue * 0.1 + (after - before) * 2;
}

/**
 * 這張牌落入對手之手的威脅值：
 * 對手臨門（差 1 張）的役若靠此牌完成 → 全額威脅；差 2 張 → 部分。
 */
export function opponentThreat(view: PlayerView, card: CardId): number {
  let threat = 0;
  for (const y of yakuStatus(view.oppCaptured, view.rules)) {
    if (y.met || !y.needed.includes(card)) continue;
    if (y.needed.length === 1) threat += y.points;
    else if (y.needed.length === 2) threat += y.points * 0.3;
  }
  // 對手同月手牌可能吃走：基礎牌面威脅
  return threat + rawValue(card) * 0.05;
}
