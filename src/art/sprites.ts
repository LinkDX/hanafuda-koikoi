import { buildFramedSprite, buildWashiSprite, buildWikiSprite, WIKI_SOURCES } from './sources';
import type { ArtSourceId, CardStyle } from './styleTypes';

const injected = new Set<string>();

function inject(key: string, build: () => SVGSVGElement): void {
  if (injected.has(key)) return;
  const sprite = build();
  sprite.id = `sprite-${key}`;
  document.body.prepend(sprite);
  injected.add(key);
}

/** 確保某風格（畫風×圖鑑框）所需的 sprite 已注入（冪等） */
export function ensureStyleSprites(style: CardStyle): void {
  const source = style.source;
  if (source === 'washi') inject('washi', buildWashiSprite);
  else inject(source, () => buildWikiSprite(source));
  if (style.framed) inject(`f-${source}`, () => buildFramedSprite(source));
}

/** 目前可用的畫風來源（圖集檔案到位才會列出） */
export function availableSources(): ArtSourceId[] {
  return ['washi', ...(Object.keys(WIKI_SOURCES) as ArtSourceId[])];
}
