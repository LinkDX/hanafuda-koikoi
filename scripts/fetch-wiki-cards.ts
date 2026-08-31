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
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
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

let ok = 0;
let skip = 0;
const failed: string[] = [];
for (const card of CARDS) {
  const out = join(outDir, `${card.id}.svg`);
  if (existsSync(out)) { skip++; continue; }
  const title = wikiFileTitle(set, card);
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title)}`;
  let done = false;
  for (let attempt = 0; attempt < 3 && !done; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'hanafuda-koikoi/1.0 (open-source game; one-time asset import)' },
        redirect: 'follow',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text.includes('<svg')) throw new Error('not svg');
      writeFileSync(out, text, 'utf-8');
      ok++;
      done = true;
    } catch (e) {
      console.log(`retry ${title}: ${(e as Error).message}`);
      await sleep(30000);
    }
  }
  if (!done) failed.push(title);
  await sleep(2500);
}
console.log(`${set}: ok=${ok} skip=${skip} failed=${failed.length}${failed.length ? ' → ' + failed.join('; ') : ''}`);
