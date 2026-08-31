import type { CardId } from '../core/cards';

/** 畫風來源：自繪原創＋四套 Wikimedia 圖集 */
export type ArtSourceId = 'washi' | 'hanafuda-black' | 'hanafuda-red' | 'hwatu' | 'hwatu-jp';

/** 卡面風格 = 畫風來源 × 是否加圖鑑資訊框 */
export interface CardStyle {
  source: ArtSourceId;
  framed: boolean;
}

export const ART_SOURCES: readonly ArtSourceId[] = [
  'washi', 'hanafuda-black', 'hanafuda-red', 'hwatu', 'hwatu-jp',
];

export const DEFAULT_STYLE: CardStyle = { source: 'washi', framed: false };

export const CARD_VIEWBOX = '0 0 200 320';

export function symbolId(source: ArtSourceId, card: CardId): string {
  return `${source}-card-${card}`;
}

export function framedSymbolId(source: ArtSourceId, card: CardId): string {
  return `f-${source}-card-${card}`;
}

export function styleSymbolHref(style: CardStyle, card: CardId): string {
  return `#${style.framed ? framedSymbolId(style.source, card) : symbolId(style.source, card)}`;
}

/** 舊版設定字串（'traditional'/'modern'）遷移 */
export function migrateLegacyStyle(value: unknown): CardStyle | null {
  if (value === 'traditional') return { source: 'washi', framed: false };
  if (value === 'modern') return { source: 'washi', framed: true };
  if (
    typeof value === 'object' && value !== null &&
    'source' in value && ART_SOURCES.includes((value as CardStyle).source)
  ) {
    return { source: (value as CardStyle).source, framed: Boolean((value as CardStyle).framed) };
  }
  return null;
}
