import type { RuleConfig } from '../../core/rules';
import { yakuStatus } from '../../core/yaku';
import { cardOf } from '../../core/cards';
import type { CardStyleId } from '../../art/styleTypes';
import { renderCard } from './cardEl';
import { button, el, showDialog } from './dialogs';
import { S } from '../strings';

const COUNT_DESC: Partial<Record<string, string>> = {
  tane: 'タネ牌收滿 5 張成役，之後每多 1 張 +1 點',
  tanzaku: '短冊收滿 5 張成役，之後每多 1 張 +1 點',
  kasu: 'カス收滿 10 張成役，之後每多 1 張 +1 點',
};

/** 役型速查表 overlay */
export function showCheatsheet(rules: RuleConfig, style: CardStyleId): void {
  const content = el('div', 'cheatsheet');
  content.appendChild(el('h2', 'dialog__title', S.cheatsheet));
  for (const y of yakuStatus([], rules)) {
    const row = el('div', 'cheatsheet__row');
    const head = el('div', 'cheatsheet__head');
    head.appendChild(el('span', 'cheatsheet__name', y.nameJa));
    head.appendChild(el('span', 'cheatsheet__pts', `${y.basePoints}${COUNT_DESC[y.id] ? '+' : ''} ${S.scoreUnit}`));
    row.appendChild(head);
    row.appendChild(el('p', 'cheatsheet__desc', COUNT_DESC[y.id] ?? y.nameZh));
    if (!COUNT_DESC[y.id] && y.needed.length <= 5) {
      const cards = el('div', 'cheatsheet__cards');
      for (const c of y.needed) {
        const mini = renderCard(c, style);
        mini.title = cardOf(c).nameJa;
        cards.appendChild(mini);
      }
      row.appendChild(cards);
    }
    content.appendChild(row);
  }
  const actions = el('div', 'dialog__actions');
  const handle = showDialog(content, { dismissible: true });
  actions.appendChild(button(S.close, 'btn btn--primary', () => handle.close()));
  content.appendChild(actions);
}
