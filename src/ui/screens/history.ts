import type { StorageProvider } from '../../storage/provider';
import { computeStats } from '../../storage/records';
import { YAKU_DEFS } from '../../core/yaku';
import { button, el } from '../components/dialogs';
import { S } from '../strings';

const yakuName = (id: string): string => YAKU_DEFS.find((y) => y.id === id)?.nameJa ?? id;

export async function renderHistory(
  container: HTMLElement,
  storage: StorageProvider,
  onBack: () => void,
): Promise<void> {
  const records = await storage.getMatches();
  const stats = computeStats(records);

  const root = el('div', 'history');
  root.appendChild(el('h1', 'history__title', S.history));

  // 總覽統計
  const overview = el('div', 'history__stats');
  const statCard = (label: string, value: string) => {
    const card = el('div', 'stat-card');
    card.appendChild(el('div', 'stat-card__value', value));
    card.appendChild(el('div', 'stat-card__label', label));
    return card;
  };
  overview.appendChild(statCard('總場數', String(stats.totalGames)));
  overview.appendChild(statCard('單局最高分', String(stats.bestRoundScore)));
  const totalWins = stats.perLevel[1].wins + stats.perLevel[2].wins + stats.perLevel[3].wins;
  overview.appendChild(statCard('總勝場', String(totalWins)));
  root.appendChild(overview);

  // 各等級勝率
  const levelTable = el('div', 'history__levels');
  for (const level of [1, 2, 3] as const) {
    const ls = stats.perLevel[level];
    const row = el('div', 'level-row');
    row.appendChild(el('span', 'level-row__name', `${S.aiLevels[level]}`));
    const rate = ls.games > 0 ? Math.round((ls.wins / ls.games) * 100) : null;
    row.appendChild(el('span', 'level-row__detail',
      ls.games === 0 ? '尚未對戰' : `${ls.wins} 勝 ${ls.losses} 敗 ${ls.draws} 和（勝率 ${rate}%）`));
    levelTable.appendChild(row);
  }
  root.appendChild(levelTable);

  // 役達成統計
  const yakuEntries = Object.entries(stats.yakuCounts).sort((a, b) => b[1]! - a[1]!);
  if (yakuEntries.length > 0) {
    root.appendChild(el('h2', 'history__subtitle', '役達成次數'));
    const yakuWrap = el('div', 'history__yaku');
    for (const [id, count] of yakuEntries) {
      yakuWrap.appendChild(el('span', 'yaku-chip', `${yakuName(id)} ×${count}`));
    }
    root.appendChild(yakuWrap);
  }

  // 近期對戰
  if (records.length > 0) {
    root.appendChild(el('h2', 'history__subtitle', '近期對戰'));
    const list = el('div', 'history__list');
    for (const r of [...records].reverse().slice(0, 20)) {
      const row = el('div', 'match-row');
      const date = new Date(r.timestamp);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      const outcome = r.winner === 0 ? '勝' : r.winner === 1 ? '敗' : '和';
      row.classList.add(`match-row--${r.winner === 0 ? 'win' : r.winner === 1 ? 'loss' : 'draw'}`);
      row.appendChild(el('span', 'match-row__outcome', outcome));
      row.appendChild(el('span', 'match-row__detail',
        `${dateStr}・${S.aiLevels[r.aiLevel]}・${r.totalRounds} 月・${r.finalScores[0]} : ${r.finalScores[1]}`));
      list.appendChild(row);
    }
    root.appendChild(list);
  } else {
    root.appendChild(el('p', 'history__empty', '還沒有對戰紀錄，去打一場吧！'));
  }

  const actions = el('div', 'history__actions');
  actions.appendChild(button(S.backToMenu, 'btn btn--primary', onBack));
  if (records.length > 0) {
    actions.appendChild(button('清除紀錄', 'btn', () => {
      if (window.confirm('確定要清除所有對戰紀錄嗎？此動作無法復原。')) {
        void storage.clearMatches().then(() => renderHistory(container, storage, onBack));
      }
    }));
  }
  root.appendChild(actions);

  container.replaceChildren(root);
}
