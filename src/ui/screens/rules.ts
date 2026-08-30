import { CARDS } from '../../core/cards';
import type { Month } from '../../core/cards';
import { DEFAULT_RULES } from '../../core/rules';
import { yakuStatus } from '../../core/yaku';
import type { CardStyleId } from '../../art/styleTypes';
import { renderCard } from '../components/cardEl';
import { showCardDetail } from '../components/cardDetail';
import { button, el } from '../components/dialogs';
import { S } from '../strings';

const MONTH_TITLE: Record<Month, string> = {
  1: '一月・松', 2: '二月・梅', 3: '三月・桜', 4: '四月・藤', 5: '五月・菖蒲', 6: '六月・牡丹',
  7: '七月・萩', 8: '八月・芒', 9: '九月・菊', 10: '十月・紅葉', 11: '十一月・柳', 12: '十二月・桐',
};

const FLOW_STEPS: readonly [string, string][] = [
  ['發牌', '雙方各 8 張手牌、場上 8 張、牌堆 24 張。每局代表一個月份。'],
  ['出牌配對', '出一張手牌：場上有同月份的牌就配對吃進；沒有就留在場上。場上有兩張同月須擇一，三張同月則四張全吃。'],
  ['翻牌堆', '出完手牌後翻開牌堆頂的一張，同樣按月份配對。'],
  ['成役', '吃進的牌湊成「役」（特定組合）即可得分。'],
  ['こいこい或勝負', '成役後可選「こいこい」繼續搏更多役（風險：對手先成役結算時你會空手，且對方得分翻倍條件成立）；或「勝負」立即結算本局。'],
  ['局末', '雙方手牌出完無人勝負即流局（親續任）；勝者成為下一局的親。打滿設定局數後總分高者獲勝。'],
  ['特殊規則', '起手同月 4 張（手四）或 4 組對子（くっつき）直接獲勝 6 點；總分 7 點以上翻倍；對手こいこい中被反殺翻倍。'],
];

export function renderRules(
  container: HTMLElement,
  style: CardStyleId,
  onBack: () => void,
): void {
  const root = el('div', 'rules');
  root.appendChild(el('h1', 'rules__title', S.rules));

  // 遊戲流程
  root.appendChild(el('h2', 'rules__subtitle', '遊戲流程'));
  const flow = el('ol', 'rules__flow');
  for (const [title, desc] of FLOW_STEPS) {
    const li = el('li', 'rules__step');
    li.appendChild(el('strong', 'rules__step-title', title));
    li.appendChild(el('span', 'rules__step-desc', desc));
    flow.appendChild(li);
  }
  root.appendChild(flow);

  // 役型表
  root.appendChild(el('h2', 'rules__subtitle', '役型一覽'));
  const yakuTable = el('div', 'rules__yaku');
  for (const y of yakuStatus([], DEFAULT_RULES)) {
    const row = el('div', 'rules__yaku-row');
    const head = el('div', 'cheatsheet__head');
    head.appendChild(el('span', 'rules__yaku-name', y.nameJa));
    const isCount = y.id === 'tane' || y.id === 'tanzaku' || y.id === 'kasu';
    head.appendChild(el('span', 'rules__yaku-pts', `${y.basePoints}${isCount ? '+' : ''} ${S.scoreUnit}`));
    row.appendChild(head);
    row.appendChild(el('p', 'rules__yaku-desc', y.nameZh));
    if (!isCount && y.needed.length <= 5) {
      const cards = el('div', 'rules__yaku-cards');
      for (const c of y.needed) {
        const mini = renderCard(c, style);
        cards.appendChild(mini);
      }
      row.appendChild(cards);
    }
    yakuTable.appendChild(row);
  }
  root.appendChild(yakuTable);

  // 牌組一覽（點牌看詳情）
  root.appendChild(el('h2', 'rules__subtitle', '牌組一覽（點牌看詳情）'));
  for (let m = 1; m <= 12; m++) {
    const section = el('div', 'rules__month');
    section.appendChild(el('h3', 'rules__month-title', MONTH_TITLE[m as Month]));
    const row = el('div', 'rules__month-cards');
    for (const card of CARDS.filter((c) => c.month === m)) {
      const cardEl = renderCard(card.id, style, { interactive: true });
      cardEl.addEventListener('click', () => showCardDetail(card.id, DEFAULT_RULES, style));
      row.appendChild(cardEl);
    }
    section.appendChild(row);
    root.appendChild(section);
  }

  const actions = el('div', 'history__actions');
  actions.appendChild(button(S.backToMenu, 'btn btn--primary', onBack));
  root.appendChild(actions);

  container.replaceChildren(root);
  container.scrollTop = 0;
}
