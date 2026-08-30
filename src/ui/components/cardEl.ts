import { cardOf } from '../../core/cards';
import type { CardId } from '../../core/cards';
import { symbolId } from '../../art/styleTypes';
import type { CardStyleId } from '../../art/styleTypes';

const SVG_NS = 'http://www.w3.org/2000/svg';

export interface CardElOptions {
  faceDown?: boolean;
  interactive?: boolean;
}

/** 產生一張卡牌元素（<use> 引用 sprite） */
export function renderCard(card: CardId, style: CardStyleId, opts: CardElOptions = {}): HTMLElement {
  const el = document.createElement(opts.interactive ? 'button' : 'div');
  el.className = 'card';
  el.dataset['card'] = String(card);
  if (opts.interactive) el.setAttribute('type', 'button');
  if (opts.faceDown) {
    el.classList.add('card--back');
    el.setAttribute('aria-label', '蓋著的牌');
    return el;
  }
  const def = cardOf(card);
  el.setAttribute(opts.interactive ? 'aria-label' : 'title', def.nameJa);
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 200 320');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `#${symbolId(style, card)}`);
  svg.appendChild(use);
  el.appendChild(svg);
  return el;
}
