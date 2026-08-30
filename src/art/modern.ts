import { CARDS, cardOf } from '../core/cards';
import type { CardDef, Month } from '../core/cards';
import { CARD_VIEWBOX, symbolId } from './styleTypes';
import type { CardArtStyle } from './styleTypes';

const SVG_NS = 'http://www.w3.org/2000/svg';

const MONTH_LABEL: Record<Month, string> = {
  1: '一月', 2: '二月', 3: '三月', 4: '四月', 5: '五月', 6: '六月',
  7: '七月', 8: '八月', 9: '九月', 10: '十月', 11: '十一月', 12: '十二月',
};

const MONTH_PLANT: Record<Month, string> = {
  1: '松', 2: '梅', 3: '桜', 4: '藤', 5: '菖蒲', 6: '牡丹',
  7: '萩', 8: '芒', 9: '菊', 10: '紅葉', 11: '柳', 12: '桐',
};

/** 特殊牌的主體標籤（動物／物件） */
const SPECIAL_LABEL: Record<number, string> = {
  0: '鶴', 4: '鶯', 8: '幕', 12: '不如帰', 16: '八橋', 20: '蝶',
  24: '猪', 28: '月', 29: '雁', 32: '盃', 36: '鹿',
  40: '小野道風', 41: '燕', 44: '鳳凰',
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

/** 每月植物的簡化圖形（200×320 座標系，中心約 100,150） */
function plantGlyph(month: Month): string {
  switch (month) {
    case 1: return `
      <path d="M100 190 L100 130" stroke="#6b4f2a" stroke-width="7" fill="none"/>
      <path d="M100 132 L62 118 L100 96 Z" fill="#2d5a3d"/>
      <path d="M100 132 L138 118 L100 96 Z" fill="#356b49"/>
      <path d="M100 104 L72 88 L100 66 L128 88 Z" fill="#2d5a3d"/>`;
    case 2: return `
      <g fill="#d0576b">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${100 + 26 * Math.cos((a * Math.PI) / 180)}" cy="${130 + 26 * Math.sin((a * Math.PI) / 180)}" r="15"/>`).join('')}</g>
      <circle cx="100" cy="130" r="9" fill="#f2d64b"/>`;
    case 3: return `
      <g fill="#e8a7b8">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="${100 + 30 * Math.cos((a * Math.PI) / 180)}" cy="${130 + 30 * Math.sin((a * Math.PI) / 180)}" rx="17" ry="13" transform="rotate(${a} ${100 + 30 * Math.cos((a * Math.PI) / 180)} ${130 + 30 * Math.sin((a * Math.PI) / 180)})"/>`).join('')}</g>
      <circle cx="100" cy="130" r="8" fill="#c2536b"/>`;
    case 4: return `
      <path d="M70 90 Q100 80 130 90" stroke="#6b8455" stroke-width="5" fill="none"/>
      <g fill="#8a6db3">${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${78 + i * 11}" cy="${108 + i * 16}" rx="10" ry="14"/>`).join('')}</g>`;
    case 5: return `
      <path d="M100 200 L100 120" stroke="#4f8a5f" stroke-width="5" fill="none"/>
      <path d="M100 124 Q78 104 84 78 Q100 96 100 124 Z" fill="#6b58a8"/>
      <path d="M100 124 Q122 104 116 78 Q100 96 100 124 Z" fill="#7d6ab8"/>
      <path d="M92 130 Q100 112 108 130 Q100 142 92 130 Z" fill="#f2d64b"/>
      <path d="M78 200 Q84 150 90 200 Z" fill="#4f8a5f"/>
      <path d="M110 200 Q116 150 122 200 Z" fill="#4f8a5f"/>`;
    case 6: return `
      <circle cx="100" cy="132" r="34" fill="#d0576b"/>
      <circle cx="100" cy="132" r="22" fill="#e08a9b"/>
      <circle cx="100" cy="132" r="10" fill="#f2d64b"/>
      <path d="M62 168 Q80 150 100 166 Q120 150 138 168" stroke="#356b49" stroke-width="6" fill="none"/>`;
    case 7: return `
      <path d="M60 190 Q100 100 150 96" stroke="#7a5c3a" stroke-width="4" fill="none"/>
      <g fill="#c25a8a">${[0, 1, 2, 3].map((i) => `<ellipse cx="${76 + i * 22}" cy="${158 - i * 20}" rx="9" ry="6"/>`).join('')}</g>
      <g fill="#356b49">${[0, 1, 2].map((i) => `<ellipse cx="${90 + i * 22}" cy="${144 - i * 20}" rx="8" ry="5"/>`).join('')}</g>`;
    case 8: return `
      <path d="M55 200 Q70 120 66 96" stroke="#b09a55" stroke-width="5" fill="none"/>
      <path d="M85 200 Q95 116 108 92" stroke="#c4ad60" stroke-width="5" fill="none"/>
      <path d="M120 200 Q130 130 146 106" stroke="#b09a55" stroke-width="5" fill="none"/>
      <path d="M66 96 Q80 88 90 94 M108 92 Q122 84 132 90" stroke="#d8c070" stroke-width="4" fill="none"/>`;
    case 9: return `
      <g stroke="#d8a022" stroke-width="6" fill="none">${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => `<line x1="100" y1="130" x2="${100 + 32 * Math.cos((a * Math.PI) / 180)}" y2="${130 + 32 * Math.sin((a * Math.PI) / 180)}"/>`).join('')}</g>
      <circle cx="100" cy="130" r="12" fill="#f2d64b"/>
      <path d="M100 168 L100 205 M100 182 Q76 176 70 190" stroke="#4f8a5f" stroke-width="5" fill="none"/>`;
    case 10: return `
      <g fill="#c23b22">${[90, 162, 234, 306, 18].map((a) => `<path d="M100 138 L${100 + 34 * Math.cos((a * Math.PI) / 180)} ${138 - 34 * Math.sin((a * Math.PI) / 180)} L${100 + 12 * Math.cos(((a + 36) * Math.PI) / 180)} ${138 - 12 * Math.sin(((a + 36) * Math.PI) / 180)} Z"/>`).join('')}</g>
      <path d="M100 138 L100 196" stroke="#7a3a20" stroke-width="4"/>`;
    case 11: return `
      <path d="M60 84 Q100 76 140 84" stroke="#7a5c3a" stroke-width="6" fill="none"/>
      <g stroke="#5f9e58" stroke-width="4" fill="none">${[0, 1, 2, 3, 4].map((i) => `<path d="M${68 + i * 16} 86 Q${62 + i * 16} 140 ${70 + i * 16} 196"/>`).join('')}</g>`;
    case 12: return `
      <g fill="#6b58a8">${[0, 1, 2].map((i) => `<ellipse cx="${78 + i * 22}" cy="${96 + (i === 1 ? -10 : 0)}" rx="9" ry="16"/>`).join('')}</g>
      <path d="M58 160 Q100 120 142 160 Q100 186 58 160 Z" fill="#356b49"/>
      <path d="M64 186 Q100 152 136 186 Q100 208 64 186 Z" fill="#2d5a3d"/>`;
  }
}

function specialGlyph(card: CardDef): string {
  const label = SPECIAL_LABEL[card.id];
  const parts: string[] = [];
  if (card.flags.moon) {
    parts.push('<circle cx="100" cy="128" r="44" fill="#f2d64b"/>');
  }
  if (card.flags.rainMan) {
    parts.push(
      '<g stroke="#5a7ec2" stroke-width="4" stroke-linecap="round">' +
      [0, 1, 2, 3].map((i) => `<line x1="${60 + i * 26}" y1="212" x2="${52 + i * 26}" y2="238"/>`).join('') +
      '</g>',
    );
  }
  if (card.flags.curtain) {
    parts.push(
      '<path d="M52 210 L148 210 L144 262 L56 262 Z" fill="#c96a3a"/>' +
      '<g stroke="#8a3a1a" stroke-width="3">' +
      [0, 1, 2, 3].map((i) => `<line x1="${68 + i * 22}" y1="212" x2="${66 + i * 22}" y2="260"/>`).join('') +
      '</g>',
    );
  }
  if (card.flags.sakeCup) {
    parts.push(
      '<path d="M70 218 Q100 238 130 218 L124 248 Q100 260 76 248 Z" fill="#c9302c"/>' +
      '<ellipse cx="100" cy="218" rx="30" ry="9" fill="#e8d5b0"/>',
    );
  }
  if (label && !card.flags.curtain && !card.flags.sakeCup) {
    const size = label.length > 2 ? 22 : 34;
    parts.push(
      `<text x="100" y="248" font-size="${size}" text-anchor="middle" font-weight="600" fill="#3a3630" font-family="serif">${label}</text>`,
    );
  }
  return parts.join('');
}

function ribbonGlyph(card: CardDef): string {
  const isBlue = card.flags.blueRibbon === true;
  const color = isBlue ? '#3a66b0' : '#c9302c';
  const text = card.flags.poemRibbon ? 'あかよろし' : '';
  return `
    <rect x="76" y="86" width="48" height="150" rx="6" fill="${color}" transform="rotate(8 100 160)"/>
    ${text ? `<text x="103" y="118" font-size="17" fill="#f5efe0" font-family="serif" writing-mode="tb" transform="rotate(8 100 160)" letter-spacing="4">${text}</text>` : ''}`;
}

function buildSymbolContent(card: CardDef): string {
  const theme = themeOf(card);
  const body =
    card.type === 'tanzaku'
      ? `${plantGlyph(card.month).replace(/cy="(\d+)"/g, 'cy="$1"')}${ribbonGlyph(card)}`
      : `${plantGlyph(card.month)}${specialGlyph(card)}`;
  return `
    <rect x="4" y="4" width="192" height="312" rx="14" fill="${theme.bg}" stroke="${theme.border}" stroke-width="5"/>
    <text x="18" y="44" font-size="26" font-weight="600" fill="${theme.label}" font-family="serif">${MONTH_LABEL[card.month]}</text>
    <rect x="128" y="16" width="58" height="30" rx="15" fill="${theme.badgeBg}"/>
    <text x="157" y="38" font-size="19" text-anchor="middle" fill="#fdfaf2" font-family="serif">${theme.badge}</text>
    ${body}
    <text x="100" y="302" font-size="17" text-anchor="middle" fill="${theme.label}" font-family="serif">${card.nameJa}</text>
    <text x="182" y="302" font-size="15" text-anchor="end" fill="${theme.border}" font-family="serif">${MONTH_PLANT[card.month]}</text>`;
}

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
