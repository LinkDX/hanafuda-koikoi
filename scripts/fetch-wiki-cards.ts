/**
 * 下載 Wikimedia Commons 花札/花鬪 SVG 圖集（CC BY-SA 4.0）
 * 用法：npx tsx scripts/fetch-wiki-cards.ts <hanafuda-black|hanafuda-red|hwatu|hwatu-jp>
 *
 * 來源分類（作者見各分類頁）：
 * - Category:SVG Hanafuda with traditional colors (black border)
 * - Category:SVG Hanafuda with traditional colors (red border)
 * - Category:SVG Hwatu
 * - Category:SVG Hwatu (with Japanese-style artwork)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CARDS } from '../src/core/cards';
import type { CardDef } from '../src/core/cards';

const MONTH_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type SetId = 'hanafuda-black' | 'hanafuda-red' | 'hwatu' | 'hwatu-jp';

/** 花鬪為韓式月序：桐＝November、柳（雨）＝December */
function hwatuMonthEn(month: number): string {
  if (month === 11) return 'December';
  if (month === 12) return 'November';
  return MONTH_EN[month - 1]!;
}

function kasuIndex(card: CardDef): number {
  const kasus = CARDS.filter((c) => c.month === card.month && c.type === 'kasu');
  return kasus.findIndex((c) => c.id === card.id) + 1;
}

/** 日式命名（Hanafuda 兩套與 Hwatu 套共用牌種字彙） */
function jpStyleName(card: CardDef, monthEn: string, suffix: string): string {
  let type: string;
  switch (card.type) {
    case 'hikari': type = 'Hikari'; break;
    case 'tane': type = 'Tane'; break;
    case 'tanzaku': type = 'Tanzaku'; break;
    case 'kasu': {
      const total = CARDS.filter((c) => c.month === card.month && c.type === 'kasu').length;
      type = total === 1 ? 'Kasu' : `Kasu ${kasuIndex(card)}`;
      break;
    }
  }
  return `${monthEn} ${type}${suffix}`;
}

/** 韓語牌種命名（hwatu-jp 套） */
function krStyleName(card: CardDef, monthEn: string): string {
  switch (card.type) {
    case 'hikari': return `${monthEn} gwang`;
    case 'tane':
      // 5月/9月的タネ在韓規可兼雙皮，檔名為 yul ssang pi
      if (card.month === 5 || card.month === 9) return `${monthEn} yul ssang pi`;
      return `${monthEn} yul`;
    case 'tanzaku': return `${monthEn} tti`;
    case 'kasu': {
      const total = CARDS.filter((c) => c.month === card.month && c.type === 'kasu').length;
      if (total === 1) return `${monthEn} ssang pi`; // 柳（雨）的單張皮＝雙皮
      const idx = kasuIndex(card);
      // 桐三張皮：第三張為雙皮
      if (total === 3 && idx === 3) return `${monthEn} ssang pi`;
      return `${monthEn} pi ${idx}`;
    }
  }
}

export function wikiFileTitle(set: SetId, card: CardDef): string {
  switch (set) {
    case 'hanafuda-black': return `Hanafuda ${jpStyleName(card, MONTH_EN[card.month - 1]!, ' Alt')}.svg`;
    case 'hanafuda-red': return `Hanafuda ${jpStyleName(card, MONTH_EN[card.month - 1]!, ' Alt2')}.svg`;
    case 'hwatu': return `Hwatu ${jpStyleName(card, hwatuMonthEn(card.month), '')}.svg`;
    case 'hwatu-jp': return `Hwatu ${krStyleName(card, hwatuMonthEn(card.month))}.svg`;
  }
}

const set = process.argv[2] as SetId;
if (!['hanafuda-black', 'hanafuda-red', 'hwatu', 'hwatu-jp'].includes(set)) {
  console.error('用法: tsx scripts/fetch-wiki-cards.ts <hanafuda-black|hanafuda-red|hwatu|hwatu-jp>');
  process.exit(1);
}

const outDir = join(import.meta.dirname, '..', 'public', 'wiki', set);
mkdirSync(outDir, { recursive: true });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const UA = { 'User-Agent': 'hanafuda-koikoi/1.0 (open-source game; one-time asset import)' };

// 第一階段：批次查詢直接下載 URL，成功後快取到檔案（重跑不再打 API）
const pending = CARDS.filter((c) => !existsSync(join(outDir, `${c.id}.svg`)));
if (pending.length === 0) {
  console.log(`${set}: 全部已存在，略過`);
  process.exit(0);
}
if (process.argv[3] === '--rename') {
  // 將手動下載的 Commons 原始檔名改為卡牌編號
  const { renameSync } = await import('node:fs');
  let renamed = 0;
  for (const c of CARDS) {
    const target = join(outDir, `${c.id}.svg`);
    if (existsSync(target)) continue;
    const original = join(outDir, wikiFileTitle(set, c).replace(/ /g, '_'));
    if (existsSync(original)) {
      renameSync(original, target);
      renamed++;
    }
  }
  const still = CARDS.filter((c) => !existsSync(join(outDir, `${c.id}.svg`)));
  console.log(`${set}: 改名 ${renamed} 張，仍缺 ${still.length} 張${still.length ? '：' + still.map((c) => `${c.id}(${wikiFileTitle(set, c)})` ).join('、') : ''}`);
  process.exit(0);
}

if (process.argv[3] === '--list') {
  for (const c of pending) {
    console.log(`${set}/${c.id}.svg  ←  https://commons.wikimedia.org/wiki/File:${wikiFileTitle(set, c).replace(/ /g, '_')}`);
  }
  process.exit(0);
}

const cachePath = join(import.meta.dirname, `.wiki-urls-${set}.json`);
const urlByTitle = new Map<string, string>(
  existsSync(cachePath)
    ? Object.entries(JSON.parse(readFileSync(cachePath, 'utf-8')) as Record<string, string>)
    : [],
);
const titles = pending
  .map((c) => `File:${wikiFileTitle(set, c)}`)
  .filter((t) => !urlByTitle.has(t));
for (let i = 0; i < titles.length; i += 50) {
  const batch = titles.slice(i, i + 50);
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(batch.join('|'))}&prop=imageinfo&iiprop=url&format=json&formatversion=2`;
  let apiOk = false;
  for (let attempt = 0; attempt < 5 && !apiOk; attempt++) {
    const res = await fetch(api, { headers: UA });
    if (res.status === 429) {
      const wait = Number(res.headers.get('retry-after') ?? 120) * 1000;
      console.log(`API 429 → 等待 ${wait / 1000}s`);
      await sleep(Math.min(wait + 5000, 900000));
      continue;
    }
    if (!res.ok) { console.log(`API HTTP ${res.status}`); process.exit(1); }
    const data = await res.json() as { query: { pages: { title: string; imageinfo?: { url: string }[] }[] } };
    for (const p of data.query.pages) {
      const u = p.imageinfo?.[0]?.url;
      if (u) urlByTitle.set(p.title, u);
    }
    apiOk = true;
  }
  if (!apiOk) { console.log('API 屢次失敗'); process.exit(1); }
  await sleep(3000);
}
writeFileSync(cachePath, JSON.stringify(Object.fromEntries(urlByTitle)), 'utf-8');

// 第二階段：逐檔下載（大間隔、尊重 Retry-After）
let ok = 0;
const failed: string[] = [];
for (const card of pending) {
  const out = join(outDir, `${card.id}.svg`);
  const title = `File:${wikiFileTitle(set, card)}`;
  const url = urlByTitle.get(title);
  if (!url) { failed.push(`${title} (no url)`); continue; }
  let done = false;
  for (let attempt = 0; attempt < 4 && !done; attempt++) {
    try {
      const res = await fetch(url, { headers: UA });
      if (res.status === 429) {
        const wait = Number(res.headers.get('retry-after') ?? 60) * 1000;
        console.log(`429 → 等待 ${wait / 1000}s`);
        await sleep(Math.min(wait + 5000, 900000)); // 完全尊重 Retry-After
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text.includes('<svg')) throw new Error('not svg');
      writeFileSync(out, text, 'utf-8');
      ok++;
      done = true;
      console.log(`ok ${card.id} ${title}`);
    } catch (e) {
      console.log(`retry ${title}: ${(e as Error).message}`);
      await sleep(20000);
    }
  }
  if (!done) failed.push(title);
  await sleep(12000);
}
console.log(`${set}: ok=${ok} failed=${failed.length}${failed.length ? ' → ' + failed.join('; ') : ''}`);
