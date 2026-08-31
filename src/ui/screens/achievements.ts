import { ACHIEVEMENTS, computeAchievements } from '../../achievements/defs';
import type { StorageProvider } from '../../storage/provider';
import type { CardStyleId } from '../../art/styleTypes';
import { renderCard } from '../components/cardEl';
import { button, el } from '../components/dialogs';
import { S } from '../strings';

/** 成就牆：已解鎖顯示徽章與日期，未解鎖顯示剪影與達成條件 */
export async function renderAchievements(
  container: HTMLElement,
  storage: StorageProvider,
  style: CardStyleId,
  onBack: () => void,
): Promise<void> {
  // 讀取已保存的解鎖，並從歷史紀錄回填（舊戰績也算數）
  const unlocked = await storage.getAchievements();
  const fromRecords = computeAchievements(await storage.getMatches());
  let dirty = false;
  for (const id of fromRecords) {
    if (!(id in unlocked)) {
      unlocked[id] = Date.now();
      dirty = true;
    }
  }
  if (dirty) await storage.saveAchievements(unlocked);

  const root = el('div', 'ach-page');
  root.appendChild(el('h1', 'ach-page__title', S.achievements));
  const count = Object.keys(unlocked).filter((id) => ACHIEVEMENTS.some((a) => a.id === id)).length;
  root.appendChild(el('p', 'ach-page__progress', `已解鎖 ${count} / ${ACHIEVEMENTS.length}`));

  const grid = el('div', 'ach-grid');
  for (const def of ACHIEVEMENTS) {
    const at = unlocked[def.id];
    const cell = el('div', `ach-cell${at ? ' ach-cell--unlocked' : ''}`);
    const icon = el('div', 'ach-cell__icon');
    if (def.icon.kind === 'card') icon.appendChild(renderCard(def.icon.card, style));
    else icon.textContent = def.icon.char;
    cell.appendChild(icon);
    cell.appendChild(el('div', 'ach-cell__name', def.name));
    cell.appendChild(el('div', 'ach-cell__desc', def.desc));
    if (at) {
      const d = new Date(at);
      cell.appendChild(el('div', 'ach-cell__date', `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} 解鎖`));
    }
    grid.appendChild(cell);
  }
  root.appendChild(grid);

  const actions = el('div', 'history__actions');
  actions.appendChild(button(S.backToMenu, 'btn btn--primary', onBack));
  root.appendChild(actions);

  container.replaceChildren(root);
  container.scrollTop = 0;
}
