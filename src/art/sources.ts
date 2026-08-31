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
 * Wikimedia 圖集（CC BY-SA 4.0）：每月一個 1600×600 的檔案、一列四張 400×600。
 * cardOrder[月-1] 將「檔案內第 i 格」映射到本專案的 slot（cards.ts 順序）。
 * 佔位：實際順序待逐檔目視核對後填入。
 */
export interface WikiSourceConfig {
  /** public/ 下的資料夾名 */
  dir: string;
  /** 每月：strip 內位置 → 專案 slot 的映射（長度 4，值為 0..3 = 檔案內格位索引） */
  slotToStripIndex: readonly (readonly [number, number, number, number])[];
}

/** 圖集檔案下載並逐檔核對格位映射後才註冊（未註冊的來源不會出現在選單） */
export const WIKI_SOURCES: Partial<Record<ArtSourceId, WikiSourceConfig>> = {};

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

/** Wikimedia 圖集 base sprite：以 <image> 裁切引用外部檔案（避免 id 衝突） */
export function buildWikiSprite(source: ArtSourceId): SVGSVGElement {
  const config = WIKI_SOURCES[source];
  if (!config) throw new Error(`未設定的圖集來源: ${source}`);
  const base = import.meta.env.BASE_URL;
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.display = 'none';
  for (let month = 1; month <= 12; month++) {
    const order = config.slotToStripIndex[month - 1]!;
    for (let slot = 0; slot < 4; slot++) {
      const stripIndex = order[slot]!;
      const symbol = document.createElementNS(SVG_NS, 'symbol');
      symbol.id = symbolId(source, (month - 1) * 4 + slot);
      symbol.setAttribute('viewBox', '0 0 400 600');
      symbol.innerHTML = `<image x="${-stripIndex * 400}" y="0" width="1600" height="600" href="${base}${config.dir}/${config.dir}-${String(month).padStart(2, '0')}.svg"/>`;
      svg.appendChild(symbol);
    }
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
