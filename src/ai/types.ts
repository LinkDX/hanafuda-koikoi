import type { CardId } from '../core/cards';
import type { PlayerView } from '../core/view';
import type { YakuStatus } from '../core/yaku';

export interface KoiKoiContext {
  /** 這次新成立的役 */
  newYaku: YakuStatus[];
  /** 目前結算可得的基礎點數 */
  currentPoints: number;
}

/** AI 策略介面 — 只能透過 PlayerView 取得資訊（不作弊） */
export interface AIStrategy {
  chooseHandCard(view: PlayerView): Promise<CardId>;
  chooseFieldMatch(view: PlayerView, played: CardId, options: CardId[]): Promise<CardId>;
  decideKoiKoi(view: PlayerView, ctx: KoiKoiContext): Promise<boolean>;
}

export type AILevel = 1 | 2 | 3;
