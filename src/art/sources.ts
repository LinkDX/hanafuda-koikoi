import { CARDS } from '../core/cards';
import { CARD_VIEWBOX, framedSymbolId, symbolId } from './styleTypes';
import type { ArtSourceId } from './styleTypes';
import { month01 } from './traditional/month01';
import { month02 } from './traditional/month02';
import { month03 } from './traditional/month03';
import { month04 } from './traditional/month04';
import { month05 } from './traditional/month05';
import { month06 } from './traditional/month06';
import { month07 } from './traditional/month07';
import { month08 } from './traditional/month08';
import { month09 } from './traditional/month09';
import { month10 } from './traditional/month10';
import { month11 } from './traditional/month11';
import { month12 } from './traditional/month12';
import { buildFrameChrome, themeOf } from './frame';

const SVG_NS = 'http://www.w3.org/2000/svg';

export const WASHI_MONTHS: readonly (readonly [string, string, string, string])[] = [
  month01, month02, month03, month04, month05, month06,
  month07, month08, month09, month10, month11, month12,
];

/**
 * Wikimedia 圖集（CC BY-SA 4.0，來源與作者見 README 授權章節）。
 * 檔案由 scripts/fetch-wiki-cards.ts 下載為 public/wiki/<set>/<cardId>.svg。
 */
export const WIKI_SOURCES: Partial<Record<ArtSourceId, { dir: string }>> = {
  'hanafuda-black': { dir: 'hanafuda-black' },
  'hanafuda-red': { dir: 'hanafuda-red' },
  'hwatu': { dir: 'hwatu' },
  'hwatu-jp': { dir: 'hwatu-jp' },
};

/** 自繪原創（washi）base sprite */
export function buildWashiSprite(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.display = 'none';
  WASHI_MONTHS.forEach((cards, monthIndex) => {
    cards.forEach((markup, slot) => {
      const symbol = document.createElementNS(SVG_NS, 'symbol');
      symbol.id = symbolId('washi', monthIndex * 4 + slot);
      symbol.setAttribute('viewBox', CARD_VIEWBOX);
      symbol.innerHTML = markup;
      svg.appendChild(symbol);
    });
  });
  return svg;
}

/** Wikimedia 圖集 base sprite：每張卡以 <image> 引用獨立檔案（隔離、無 id 衝突） */
export function buildWikiSprite(source: ArtSourceId): SVGSVGElement {
  const config = WIKI_SOURCES[source];
  if (!config) throw new Error(`未設定的圖集來源: ${source}`);
  const base = import.meta.env.BASE_URL;
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.display = 'none';
  for (const card of CARDS) {
    const symbol = document.createElementNS(SVG_NS, 'symbol');
    symbol.id = symbolId(source, card.id);
    symbol.setAttribute('viewBox', '0 0 200 320');
    symbol.innerHTML =
      `<image width="200" height="320" preserveAspectRatio="xMidYMid meet" href="${base}wiki/${config.dir}/${card.id}.svg"/>`;
    svg.appendChild(symbol);
  }
  return svg;
}

/** 圖鑑框 sprite：資訊框＋內嵌對應畫風的插畫 */
export function buildFramedSprite(source: ArtSourceId): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.display = 'none';
  for (const card of CARDS) {
    const symbol = document.createElementNS(SVG_NS, 'symbol');
    symbol.id = framedSymbolId(source, card.id);
    symbol.setAttribute('viewBox', CARD_VIEWBOX);
    const theme = themeOf(card);
    let art: string;
    if (source === 'washi') {
      // 自繪版剝掉外框直接內嵌（最精緻）
      const raw = WASHI_MONTHS[card.month - 1]![card.id % 4]!;
      const stripped = raw
        .replace(/<rect\b[^>]*\/>\s*/, '')
        .replace(/<rect\b[^>]*\/>\s*/, '');
      art = `<g transform="translate(32.5 51) scale(0.675)">${stripped}</g>`;
    } else {
      // 圖集版以 <use> 內嵌整張卡（含其自身牌框）
      art = `<use href="#${symbolId(source, card.id)}" x="26" y="54" width="148" height="212"/>`;
    }
    symbol.innerHTML = buildFrameChrome(card, theme, art);
    svg.appendChild(symbol);
  }
  return svg;
}
