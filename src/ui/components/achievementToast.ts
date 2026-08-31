import type { AchievementDef } from '../../achievements/defs';
import type { CardStyleId } from '../../art/styleTypes';
import { renderCard } from './cardEl';
import { el } from './dialogs';

const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/** 成就解鎖 toast：右上角逐一滑入 */
export async function showAchievementToasts(
  defs: readonly AchievementDef[],
  style: CardStyleId,
): Promise<void> {
  if (defs.length === 0) return;
  let host = document.querySelector<HTMLElement>('.ach-toasts');
  if (!host) {
    host = el('div', 'ach-toasts');
    document.body.appendChild(host);
  }
  for (const def of defs) {
    const toast = el('div', 'ach-toast');
    const icon = el('span', 'ach-toast__icon');
    if (def.icon.kind === 'card') icon.appendChild(renderCard(def.icon.card, style));
    else icon.textContent = def.icon.char;
    toast.appendChild(icon);
    const text = el('span', 'ach-toast__text');
    text.appendChild(el('span', 'ach-toast__label', '成就解鎖'));
    text.appendChild(el('span', 'ach-toast__name', def.name));
    toast.appendChild(text);
    host.appendChild(toast);
    void wait(3200).then(async () => {
      toast.classList.add('ach-toast--out');
      await wait(300);
      toast.remove();
      if (host && host.childElementCount === 0) host.remove();
    });
    await wait(450); // 交錯彈出
  }
}
