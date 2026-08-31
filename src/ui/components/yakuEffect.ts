import { cardOf } from '../../core/cards';
import type { CardId, CardType } from '../../core/cards';
import type { RuleConfig } from '../../core/rules';
import { yakuStatus } from '../../core/yaku';
import type { YakuId, YakuStatus } from '../../core/yaku';
import type { CardStyle } from '../../art/styleTypes';
import { renderCard } from './cardEl';
import { el } from './dialogs';

const COUNT_TYPE: Partial<Record<YakuId, CardType>> = {
  tane: 'tane',
  tanzaku: 'tanzaku',
  kasu: 'kasu',
};

const LIGHT_IDS: readonly YakuId[] = ['gokou', 'shikou', 'ameShikou', 'sankou'];

const reduced = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, reduced() ? ms * 0.6 : ms));

/** 特效分級：7 點以上＝華麗全螢幕、5–6 點＝牌面展示、其餘＝簡潔橫幅 */
function tierOf(yaku: readonly YakuStatus[]): 1 | 2 | 3 {
  const max = Math.max(...yaku.map((y) => y.points));
  return max >= 7 ? 3 : max >= 5 ? 2 : 1;
}

/** 取得構成此役的牌（展示用，計數役最多取 10 張） */
function cardsOfYaku(y: YakuStatus, captured: readonly CardId[], rules: RuleConfig): CardId[] {
  const countType = COUNT_TYPE[y.id];
  if (countType) return captured.filter((c) => cardOf(c).type === countType).slice(0, 10);
  if (LIGHT_IDS.includes(y.id)) return captured.filter((c) => cardOf(c).type === 'hikari');
  const required = yakuStatus([], rules).find((s) => s.id === y.id)?.needed ?? [];
  return required.filter((c) => captured.includes(c));
}

/** 成役特效：依最高役分分級演出，resolve 時演出結束 */
export async function showYakuEffect(
  newYaku: readonly YakuStatus[],
  captured: readonly CardId[],
  rules: RuleConfig,
  style: CardStyle,
): Promise<void> {
  if (newYaku.length === 0) return;
  const tier = tierOf(newYaku);
  const primary = [...newYaku].sort((a, b) => b.points - a.points)[0]!;
  const totalPoints = newYaku.reduce((s, y) => s + y.points, 0);

  const overlay = el('div', `yaku-fx yaku-fx--t${tier}`);

  if (tier === 3) {
    overlay.appendChild(el('div', 'yaku-fx__flash'));
    overlay.appendChild(el('div', 'yaku-fx__rays'));
  }

  const stage = el('div', 'yaku-fx__stage');

  // 役牌扇形展示（中高階）
  if (tier >= 2) {
    const cards = cardsOfYaku(primary, captured, rules);
    const fan = el('div', 'yaku-fx__cards');
    const mid = (cards.length - 1) / 2;
    cards.forEach((c, i) => {
      const wrap = el('span', 'yaku-fx__cardwrap');
      wrap.style.setProperty('--i', String(i));
      wrap.style.setProperty('--rot', `${(i - mid) * 7}deg`);
      wrap.style.setProperty('--lift', `${Math.abs(i - mid) * 6}px`);
      wrap.appendChild(renderCard(c, style));
      fan.appendChild(wrap);
    });
    stage.appendChild(fan);
  }

  const names = newYaku.map((y) => y.nameJa).join('・');
  stage.appendChild(el('div', 'yaku-fx__title', names));
  stage.appendChild(el('div', 'yaku-fx__points', `${totalPoints} 點`));
  overlay.appendChild(stage);

  // 金粉粒子
  if (tier >= 2 && !reduced()) {
    const count = tier === 3 ? 30 : 14;
    for (let i = 0; i < count; i++) {
      const p = el('span', 'yaku-fx__p');
      const angle = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * (tier === 3 ? 260 : 150);
      p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--dy', `${Math.sin(angle) * dist - 40}px`);
      p.style.setProperty('--delay', `${Math.random() * 0.35}s`);
      p.style.setProperty('--size', `${4 + Math.random() * 6}px`);
      if (tier === 3 && i % 4 === 0) p.classList.add('yaku-fx__p--red');
      overlay.appendChild(p);
    }
  }

  document.body.appendChild(overlay);
  await wait(tier === 3 ? 2500 : tier === 2 ? 1700 : 950);
  overlay.classList.add('yaku-fx--out');
  await wait(280);
  overlay.remove();
}

if (import.meta.env.DEV) {
  // dev 除錯：主控台手動觸發特效
  (window as unknown as { __yakuFx: typeof showYakuEffect }).__yakuFx = showYakuEffect;
}
