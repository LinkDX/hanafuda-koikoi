import { CARDS, cardOf } from '../core/cards';
import type { CardDef, Month } from '../core/cards';
import { CARD_VIEWBOX, symbolId } from './styleTypes';
import type { CardArtStyle } from './styleTypes';
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

const SVG_NS = 'http://www.w3.org/2000/svg';

const TRAD_MONTHS: readonly (readonly [string, string, string, string])[] = [
  month01, month02, month03, month04, month05, month06,
  month07, month08, month09, month10, month11, month12,
];

const MONTH_LABEL: Record<Month, string> = {
  1: '一月', 2: '二月', 3: '三月', 4: '四月', 5: '五月', 6: '六月',
  7: '七月', 8: '八月', 9: '九月', 10: '十月', 11: '十一月', 12: '十二月',
};

const MONTH_PLANT: Record<Month, string> = {
  1: '松', 2: '梅', 3: '桜', 4: '藤', 5: '菖蒲', 6: '牡丹',
  7: '萩', 8: '芒', 9: '菊', 10: '紅葉', 11: '柳', 12: '桐',
};

interface TypeTheme {
  bg: string;
  border: string;
  badge: string;
  badgeBg: string;
  label: string;
}

function themeOf(card: CardDef): TypeTheme {
  switch (card.type) {
    case 'hikari':
      return { bg: '#fdf6dd', border: '#c9a227', badge: '光', badgeBg: '#c9a227', label: '#5c4508' };
    case 'tane':
      return { bg: '#e9f2ea', border: '#4f8a5f', badge: 'タネ', badgeBg: '#4f8a5f', label: '#1f4229' };
    case 'tanzaku':
      return card.flags.blueRibbon
        ? { bg: '#e7edf8', border: '#2e5fb0', badge: '青短', badgeBg: '#2e5fb0', label: '#122a52' }
        : { bg: '#f8e9e6', border: '#b03a2e', badge: '短冊', badgeBg: '#b03a2e', label: '#521811' };
    case 'kasu':
      return { bg: '#f4f2ec', border: '#a09a8a', badge: 'カス', badgeBg: '#8a8578', label: '#4a463c' };
  }
}

/** 取傳統風插畫並剝掉它的黑框與紙底（開頭兩個 rect），嵌入圖鑑卡的插畫窗 */
function tradArt(card: CardDef): string {
  const raw = TRAD_MONTHS[card.month - 1]![card.id % 4]!;
  return raw
    .replace(/<rect\b[^>]*\/>\s*/, '')
    .replace(/<rect\b[^>]*\/>\s*/, '');
}

function buildSymbolContent(card: CardDef): string {
  const theme = themeOf(card);
  // 插畫窗：x 10..190、y 50..268；傳統畫作 200×320 縮至 0.675 置中
  return `
    <rect x="4" y="4" width="192" height="312" rx="14" fill="${theme.bg}" stroke="${theme.border}" stroke-width="5"/>
    <rect x="12" y="12" width="176" height="296" rx="9" fill="none" stroke="${theme.border}" stroke-width="1.5" opacity="0.45"/>
    <text x="18" y="42" font-size="25" font-weight="600" fill="${theme.label}" font-family="serif">${MONTH_LABEL[card.month]}</text>
    <rect x="128" y="15" width="58" height="29" rx="14" fill="${theme.badgeBg}"/>
    <text x="157" y="36" font-size="18" text-anchor="middle" fill="#fdfaf2" font-family="serif">${theme.badge}</text>
    <rect x="16" y="50" width="168" height="220" rx="8" fill="#f3e6cf" stroke="${theme.border}" stroke-width="1.5" opacity="0.98"/>
    <g transform="translate(32.5 51) scale(0.675)">${tradArt(card)}</g>
    <text x="100" y="300" font-size="17" text-anchor="middle" fill="${theme.label}" font-family="serif">${card.nameJa}</text>
    <text x="184" y="300" font-size="14" text-anchor="end" fill="${theme.border}" font-family="serif">${MONTH_PLANT[card.month]}</text>`;
}

/** 圖鑑風：資訊完整的卡框＋傳統風精緻插畫縮圖 */
export const modernStyle: CardArtStyle = {
  id: 'modern',
  buildSprite(): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.display = 'none';
    for (const card of CARDS) {
      const symbol = document.createElementNS(SVG_NS, 'symbol');
      symbol.id = symbolId('modern', card.id);
      symbol.setAttribute('viewBox', CARD_VIEWBOX);
      symbol.innerHTML = buildSymbolContent(cardOf(card.id));
      svg.appendChild(symbol);
    }
    return svg;
  },
};
