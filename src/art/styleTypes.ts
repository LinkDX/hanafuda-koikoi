import type { CardId } from '../core/cards';

export type CardStyleId = 'traditional' | 'modern';

export interface CardArtStyle {
  id: CardStyleId;
  /** 產出含 48 個 <symbol> 的 sprite（symbol id = `${styleId}-card-${cardId}`） */
  buildSprite(): SVGSVGElement;
}

export const CARD_VIEWBOX = '0 0 200 320';

export function symbolId(style: CardStyleId, card: CardId): string {
  return `${style}-card-${card}`;
}
