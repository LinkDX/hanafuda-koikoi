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
import { CARD_VIEWBOX, symbolId } from './styleTypes';
import type { CardArtStyle } from './styleTypes';

const SVG_NS = 'http://www.w3.org/2000/svg';

const MONTHS: readonly (readonly [string, string, string, string])[] = [
  month01, month02, month03, month04, month05, month06,
  month07, month08, month09, month10, month11, month12,
];

/** 傳統花札風：手繪細緻 SVG（12 個月 × 4 張） */
export const traditionalStyle: CardArtStyle = {
  id: 'traditional',
  buildSprite(): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.display = 'none';
    MONTHS.forEach((cards, monthIndex) => {
      cards.forEach((markup, slot) => {
        const symbol = document.createElementNS(SVG_NS, 'symbol');
        symbol.id = symbolId('traditional', monthIndex * 4 + slot);
        symbol.setAttribute('viewBox', CARD_VIEWBOX);
        symbol.innerHTML = markup;
        svg.appendChild(symbol);
      });
    });
    return svg;
  },
};
