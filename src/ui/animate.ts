/**
 * FLIP 動畫：重繪前記錄每張牌與錨點（牌堆、對手手牌區）的位置，
 * 重繪後讓牌從舊位置（或指定錨點）平滑飛到新位置。
 *
 * 飛行使用「複製體」在 fixed 飛行層移動，落地後才顯示真牌 —
 * 這樣吃牌區等有 overflow 裁切的容器不會切斷飛行過程。
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
    const dx = from.left + from.width / 2 - (rect.left + rect.width / 2);
    const dy = from.top + from.height / 2 - (rect.top + rect.height / 2);
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) continue;
    if (Math.hypot(dx, dy) < 56 && Math.abs(from.width - rect.width) < 4) {
      // 同區內的小補位：就地補間即可，不需飛行層
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: 'translate(0, 0)' },
        ],
        { duration, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
      );
      continue;
    }
    fly(el, from, rect, duration);
  }
}

/** 用複製體在最上層飛行層做位移，避免被 overflow 容器裁切 */
function fly(el: HTMLElement, from: DOMRect, to: DOMRect, duration: number): void {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.classList.remove('card--selected', 'card--matchable', 'card--choice');
  Object.assign(clone.style, {
    position: 'fixed',
    margin: '0',
    left: `${to.left}px`,
    top: `${to.top}px`,
    width: `${to.width}px`,
    height: `${to.height}px`,
    zIndex: '80',
    pointerEvents: 'none',
    transition: 'none',
  });
  document.body.appendChild(clone);
  el.style.visibility = 'hidden';

  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  const scale = to.width > 0 ? from.width / to.width : 1;
  const animation = clone.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
      { transform: 'translate(0, 0) scale(1)' },
    ],
    { duration, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
  );
  let done = false;
  const finish = (): void => {
    if (done) return;
    done = true;
    clone.remove();
    el.style.visibility = '';
  };
  animation.onfinish = finish;
  animation.oncancel = finish;
  // 背景分頁等情況 onfinish 可能不觸發：保底清理
  setTimeout(finish, duration + 400);
}
