import { cardOf } from '../../core/cards';
import type { CardId } from '../../core/cards';
import type { RuleConfig } from '../../core/rules';
import { yakuStatus } from '../../core/yaku';
import type { CardStyle } from '../../art/styleTypes';
import { renderCard } from './cardEl';
import { button, el, showDialog } from './dialogs';
import { S } from '../strings';

const TYPE_NAME: Record<string, string> = {
  hikari: '光（20 點牌）',
  tane: 'タネ（10 點牌）',
  tanzaku: '短冊（5 點牌）',
  kasu: 'カス（1 點牌）',
};

/** 點牌看詳情：大圖、名稱、種類、相關役 */
export function showCardDetail(card: CardId, rules: RuleConfig, style: CardStyle): void {
  const def = cardOf(card);
  const content = el('div', 'card-detail');
  const big = renderCard(card, style);
  big.classList.add('card-detail__card');
  content.appendChild(big);
  content.appendChild(el('h2', 'card-detail__name', def.nameJa));
  content.appendChild(el('p', 'card-detail__zh', def.nameZh));
  content.appendChild(el('p', 'card-detail__type', `${def.month} 月・${TYPE_NAME[def.type]}`));

  const related = yakuStatus([], rules)
    .filter((y) => y.needed.includes(card))
    .map((y) => `${y.nameJa}（${y.basePoints}${y.id === 'tane' || y.id === 'tanzaku' || y.id === 'kasu' ? '+' : ''} ${S.scoreUnit}）`);
  if (related.length > 0) {
    content.appendChild(el('p', 'card-detail__related', `相關役：${related.join('、')}`));
  }

  const actions = el('div', 'dialog__actions');
  const handle = showDialog(content, { dismissible: true });
  actions.appendChild(button(S.close, 'btn btn--primary', () => handle.close()));
  content.appendChild(actions);
}
