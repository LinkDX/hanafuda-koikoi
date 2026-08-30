/** FLIP 動畫：重繪前記錄卡牌位置，重繪後對移動的卡牌做位移補間 */
export function withFlip(scope: HTMLElement, mutate: () => void): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    mutate();
    return;
  }
  const before = new Map<string, DOMRect>();
  for (const el of scope.querySelectorAll<HTMLElement>('.card[data-card]')) {
    if (el.classList.contains('card--back')) continue;
    before.set(el.dataset['card']!, el.getBoundingClientRect());
  }
  mutate();
  for (const el of scope.querySelectorAll<HTMLElement>('.card[data-card]')) {
    if (el.classList.contains('card--back')) continue;
    const key = el.dataset['card']!;
    const prev = before.get(key);
    const rect = el.getBoundingClientRect();
    if (!prev) {
      if (before.size > 0) el.classList.add('card--enter');
      continue;
    }
    const dx = prev.left - rect.left;
    const dy = prev.top - rect.top;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) continue;
    const scale = prev.width > 0 && rect.width > 0 ? prev.width / rect.width : 1;
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
        { transform: 'translate(0, 0) scale(1)' },
      ],
      { duration: 280, easing: 'ease-out' },
    );
  }
}
