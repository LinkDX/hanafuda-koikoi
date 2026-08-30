export type CardId = number; // 0..47 = (month-1)*4 + slot
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type CardType = 'hikari' | 'tane' | 'tanzaku' | 'kasu';

export interface CardFlags {
  /** 菊に盃 — 花見酒・月見酒的酒杯 */
  sakeCup?: true;
  /** 柳に小野道風 — 雨光牌（雨四光；三光/四光排除） */
  rainMan?: true;
  /** 赤短（歌牌）：松・梅・桜 */
  poemRibbon?: true;
  /** 青短：牡丹・菊・紅葉 */
  blueRibbon?: true;
  boar?: true;
  deer?: true;
  butterfly?: true;
  /** 桜に幕 — 花見酒 */
  curtain?: true;
  /** 芒に月 — 月見酒 */
  moon?: true;
}

export interface CardDef {
  id: CardId;
  month: Month;
  type: CardType;
  flags: CardFlags;
  nameJa: string;
  nameZh: string;
}

interface CardSpec {
  type: CardType;
  flags?: CardFlags;
  nameJa: string;
  nameZh: string;
}

const MONTH_SPECS: readonly (readonly [Month, readonly CardSpec[]])[] = [
  [1, [
    { type: 'hikari', nameJa: '松に鶴', nameZh: '松樹與鶴（光）' },
    { type: 'tanzaku', flags: { poemRibbon: true }, nameJa: '松に赤短', nameZh: '松的赤短冊' },
    { type: 'kasu', nameJa: '松のカス', nameZh: '松的素牌' },
    { type: 'kasu', nameJa: '松のカス', nameZh: '松的素牌' },
  ]],
  [2, [
    { type: 'tane', nameJa: '梅に鶯', nameZh: '梅樹與黃鶯' },
    { type: 'tanzaku', flags: { poemRibbon: true }, nameJa: '梅に赤短', nameZh: '梅的赤短冊' },
    { type: 'kasu', nameJa: '梅のカス', nameZh: '梅的素牌' },
    { type: 'kasu', nameJa: '梅のカス', nameZh: '梅的素牌' },
  ]],
  [3, [
    { type: 'hikari', flags: { curtain: true }, nameJa: '桜に幕', nameZh: '櫻花與幕簾（光・花見酒）' },
    { type: 'tanzaku', flags: { poemRibbon: true }, nameJa: '桜に赤短', nameZh: '櫻的赤短冊' },
    { type: 'kasu', nameJa: '桜のカス', nameZh: '櫻的素牌' },
    { type: 'kasu', nameJa: '桜のカス', nameZh: '櫻的素牌' },
  ]],
  [4, [
    { type: 'tane', nameJa: '藤に不如帰', nameZh: '紫藤與杜鵑鳥' },
    { type: 'tanzaku', nameJa: '藤に短冊', nameZh: '藤的紅短冊（無歌）' },
    { type: 'kasu', nameJa: '藤のカス', nameZh: '藤的素牌' },
    { type: 'kasu', nameJa: '藤のカス', nameZh: '藤的素牌' },
  ]],
  [5, [
    { type: 'tane', nameJa: '菖蒲に八橋', nameZh: '菖蒲與八橋' },
    { type: 'tanzaku', nameJa: '菖蒲に短冊', nameZh: '菖蒲的紅短冊（無歌）' },
    { type: 'kasu', nameJa: '菖蒲のカス', nameZh: '菖蒲的素牌' },
    { type: 'kasu', nameJa: '菖蒲のカス', nameZh: '菖蒲的素牌' },
  ]],
  [6, [
    { type: 'tane', flags: { butterfly: true }, nameJa: '牡丹に蝶', nameZh: '牡丹與蝴蝶（猪鹿蝶）' },
    { type: 'tanzaku', flags: { blueRibbon: true }, nameJa: '牡丹に青短', nameZh: '牡丹的青短冊' },
    { type: 'kasu', nameJa: '牡丹のカス', nameZh: '牡丹的素牌' },
    { type: 'kasu', nameJa: '牡丹のカス', nameZh: '牡丹的素牌' },
  ]],
  [7, [
    { type: 'tane', flags: { boar: true }, nameJa: '萩に猪', nameZh: '胡枝子與山豬（猪鹿蝶）' },
    { type: 'tanzaku', nameJa: '萩に短冊', nameZh: '萩的紅短冊（無歌）' },
    { type: 'kasu', nameJa: '萩のカス', nameZh: '萩的素牌' },
    { type: 'kasu', nameJa: '萩のカス', nameZh: '萩的素牌' },
  ]],
  [8, [
    { type: 'hikari', flags: { moon: true }, nameJa: '芒に月', nameZh: '芒草與滿月（光・月見酒）' },
    { type: 'tane', nameJa: '芒に雁', nameZh: '芒草與雁群' },
    { type: 'kasu', nameJa: '芒のカス', nameZh: '芒的素牌' },
    { type: 'kasu', nameJa: '芒のカス', nameZh: '芒的素牌' },
  ]],
  [9, [
    { type: 'tane', flags: { sakeCup: true }, nameJa: '菊に盃', nameZh: '菊花與酒杯（花見酒・月見酒）' },
    { type: 'tanzaku', flags: { blueRibbon: true }, nameJa: '菊に青短', nameZh: '菊的青短冊' },
    { type: 'kasu', nameJa: '菊のカス', nameZh: '菊的素牌' },
    { type: 'kasu', nameJa: '菊のカス', nameZh: '菊的素牌' },
  ]],
  [10, [
    { type: 'tane', flags: { deer: true }, nameJa: '紅葉に鹿', nameZh: '紅葉與鹿（猪鹿蝶）' },
    { type: 'tanzaku', flags: { blueRibbon: true }, nameJa: '紅葉に青短', nameZh: '紅葉的青短冊' },
    { type: 'kasu', nameJa: '紅葉のカス', nameZh: '紅葉的素牌' },
    { type: 'kasu', nameJa: '紅葉のカス', nameZh: '紅葉的素牌' },
  ]],
  [11, [
    { type: 'hikari', flags: { rainMan: true }, nameJa: '柳に小野道風', nameZh: '柳樹與小野道風（雨光）' },
    { type: 'tane', nameJa: '柳に燕', nameZh: '柳樹與燕子' },
    { type: 'tanzaku', nameJa: '柳に短冊', nameZh: '柳的紅短冊（無歌）' },
    { type: 'kasu', nameJa: '柳のカス', nameZh: '柳的素牌（鬼札）' },
  ]],
  [12, [
    { type: 'hikari', nameJa: '桐に鳳凰', nameZh: '桐樹與鳳凰（光）' },
    { type: 'kasu', nameJa: '桐のカス', nameZh: '桐的素牌' },
    { type: 'kasu', nameJa: '桐のカス', nameZh: '桐的素牌' },
    { type: 'kasu', nameJa: '桐のカス', nameZh: '桐的素牌' },
  ]],
];

export const CARDS: readonly CardDef[] = MONTH_SPECS.flatMap(([month, specs]) =>
  specs.map((spec, slot) => ({
    id: (month - 1) * 4 + slot,
    month,
    type: spec.type,
    flags: spec.flags ?? {},
    nameJa: spec.nameJa,
    nameZh: spec.nameZh,
  })),
);

export function cardOf(id: CardId): CardDef {
  const def = CARDS[id];
  if (!def) throw new Error(`不合法的 CardId: ${id}`);
  return def;
}

export function matches(a: CardId, b: CardId): boolean {
  return cardOf(a).month === cardOf(b).month;
}
