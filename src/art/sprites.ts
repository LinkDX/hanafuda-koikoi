import type { CardArtStyle, CardStyleId } from './styleTypes';

const injected = new Set<CardStyleId>();

/** 將某風格的 sprite 注入 DOM（一次） */
export function ensureSprite(style: CardArtStyle): void {
  if (injected.has(style.id)) return;
  const sprite = style.buildSprite();
  sprite.id = `sprite-${style.id}`;
  document.body.prepend(sprite);
  injected.add(style.id);
}
