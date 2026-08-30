/**
 * FLIP 動畫：重繪前記錄每張牌與錨點（牌堆、對手手牌區）的位置，
 * 重繪後讓牌從舊位置（或指定錨點）平滑飛到新位置。
 *
 * 牌的移動軌跡是遊戲資訊（讓玩家看懂牌怎麼跑），因此
 * prefers-reduced-motion 只縮短時間、不停用位移補間。
 */
export function withFlip(scope: HTMLElement, mutate: () => void): void {
  const before = new Map<string, DOMRect>();
  const anchors = new Map<string, DOMRect>();
  for (const el of scope.querySelectorAll<HTMLElement>('.card[data-card]')) {
    if (el.classList.contains('card--back')) continue;
    before.set(el.dataset['card']!, el.getBoundingClientRect());
  }
  for (const el of scope.querySelectorAll<HTMLElement>('[data-flip-anchor]')) {
    anchors.set(el.dataset['flipAnchor']!, el.getBoundingClientRect());
  }

  mutate();

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduce ? 220 : 400;

  for (const el of scope.querySelectorAll<HTMLElement>('.card[data-card]')) {
    if (el.classList.contains('card--back')) continue;
    const key = el.dataset['card']!;
    const rect = el.getBoundingClientRect();
    let from = before.get(key);
    if (!from) {
      // 新出現的牌：從指定錨點飛出（翻牌堆／對手手牌）
      const anchorName = el.dataset['flipFrom'];
      if (anchorName) from = anchors.get(anchorName);
    }
    if (!from) {
      if (before.size > 0) el.classList.add('card--enter');
      continue;
    }
    const dx = from.left - rect.left;
    const dy = from.top - rect.top;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) continue;
    const scale = from.width > 0 && rect.width > 0 ? from.width / rect.width : 1;
    el.style.zIndex = '30';
    const animation = el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
        { transform: 'translate(0, 0) scale(1)' },
      ],
      { duration, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
    );
    animation.onfinish = () => { el.style.zIndex = ''; };
  }
}
