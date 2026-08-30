import { cardOf, matches } from '../../core/cards';
import type { CardId } from '../../core/cards';
import type { RuleConfig } from '../../core/rules';
import { yakuStatus } from '../../core/yaku';
import { el } from './dialogs';
import { S } from '../strings';

/** 計數役的門檻（顯示進度用） */
const COUNT_INFO: Partial<Record<string, { threshold: number; total: number }>> = {
  tane: { threshold: 5, total: 9 },
  tanzaku: { threshold: 5, total: 10 },
  kasu: { threshold: 10, total: 24 },
};

/**
 * 役型進度面板：顯示已成役與有進度的役、還缺哪些牌；
 * 若目前選了手牌，標記吃下後可推進的役。
 */
export function renderYakuPanel(
  myCaptured: readonly CardId[],
  rules: RuleConfig,
  selected: CardId | null,
  field: readonly CardId[],
  open: boolean,
  onToggle: (open: boolean) => void,
): HTMLElement {
  const panel = el('details', 'yaku-panel') as HTMLDetailsElement;
  panel.open = open;
  panel.addEventListener('toggle', () => onToggle(panel.open));
  const summary = el('summary', 'yaku-panel__summary', S.yakuPanel);
  panel.appendChild(summary);

  // 選中的手牌吃下後會拿到的牌（含配對的場札）
  const wouldGain: CardId[] = [];
  if (selected !== null) {
    wouldGain.push(selected, ...field.filter((f) => matches(f, selected)));
  }

  const list = el('div', 'yaku-panel__list');
  const statuses = yakuStatus(myCaptured, rules);
  let shown = 0;
  for (const y of statuses) {
    const info = COUNT_INFO[y.id];
    const have = info
      ? myCaptured.filter((c) => {
          const t = cardOf(c).type;
          return (y.id === 'tane' && t === 'tane') || (y.id === 'tanzaku' && t === 'tanzaku') || (y.id === 'kasu' && t === 'kasu');
        }).length
      : undefined;
    const progress = info
      ? have! / info.threshold
      : y.met ? 1 : 1 - y.needed.length / Math.max(y.needed.length + capturedInYaku(y.id, myCaptured, rules), 1);
    if (!y.met && progress <= 0) continue;
    shown++;

    const item = el('div', `yaku-item${y.met ? ' yaku-item--met' : ''}`);
    const advances = wouldGain.some((g) => y.needed.includes(g));
    if (advances) item.classList.add('yaku-item--advance');

    const head = el('div', 'yaku-item__head');
    head.appendChild(el('span', 'yaku-item__name', y.nameJa));
    head.appendChild(el('span', 'yaku-item__pts', y.met ? `✓ ${y.points} ${S.scoreUnit}` : `${y.basePoints} ${S.scoreUnit}`));
    item.appendChild(head);

    if (!y.met) {
      if (info) {
        item.appendChild(el('div', 'yaku-item__need', `${have}/${info.threshold} 張`));
      } else if (y.needed.length <= 3) {
        item.appendChild(el('div', 'yaku-item__need', `缺：${y.needed.map((c) => cardOf(c).nameJa).join('、')}`));
      }
      const bar = el('div', 'yaku-item__bar');
      const fill = el('div', 'yaku-item__fill');
      fill.style.width = `${Math.min(100, Math.round((info ? have! / info.threshold : progress) * 100))}%`;
      bar.appendChild(fill);
      item.appendChild(bar);
    }
    if (advances) item.appendChild(el('div', 'yaku-item__advance', '↑ 這手可推進'));
    list.appendChild(item);
  }
  if (shown === 0) list.appendChild(el('p', 'yaku-panel__empty', '尚無役型進度 — 吃牌累積吧！'));
  panel.appendChild(list);
  return panel;
}

/** 組合役已收集張數（進度條用） */
function capturedInYaku(id: string, captured: readonly CardId[], rules: RuleConfig): number {
  const emptyNeeded = yakuStatus([], rules).find((y) => y.id === id)?.needed ?? [];
  return emptyNeeded.filter((c) => captured.includes(c)).length;
}
