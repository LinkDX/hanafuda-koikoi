import { CARDS, cardOf } from './cards';
import type { CardId } from './cards';
import type { RuleConfig } from './rules';

export type YakuId =
  | 'gokou'
  | 'shikou'
  | 'ameShikou'
  | 'sankou'
  | 'hanamiZake'
  | 'tsukimiZake'
  | 'inoshikachou'
  | 'akatan'
  | 'aotan'
  | 'tane'
  | 'tanzaku'
  | 'kasu';

export interface YakuStatus {
  id: YakuId;
  nameJa: string;
  nameZh: string;
  met: boolean;
  /** 目前實得點數（未成役為 0） */
  points: number;
  /** 成役的基礎點數（顯示用） */
  basePoints: number;
  /** 尚未取得、取得後可推進／完成此役的牌 */
  needed: CardId[];
}

const RAIN = CARDS.find((c) => c.flags.rainMan)!.id;
const NON_RAIN_HIKARI = CARDS.filter((c) => c.type === 'hikari' && !c.flags.rainMan).map((c) => c.id);
const CURTAIN = CARDS.find((c) => c.flags.curtain)!.id;
const MOON = CARDS.find((c) => c.flags.moon)!.id;
const SAKE_CUP = CARDS.find((c) => c.flags.sakeCup)!.id;
const INOSHIKACHOU = CARDS.filter((c) => c.flags.boar || c.flags.deer || c.flags.butterfly).map((c) => c.id);
const POEM_RIBBONS = CARDS.filter((c) => c.flags.poemRibbon).map((c) => c.id);
const BLUE_RIBBONS = CARDS.filter((c) => c.flags.blueRibbon).map((c) => c.id);

interface YakuMeta {
  id: YakuId;
  nameJa: string;
  nameZh: string;
  basePoints: number;
  enabled?: (rules: RuleConfig) => boolean;
  evaluate: (captured: ReadonlySet<CardId>) => { met: boolean; points: number; needed: CardId[] };
}

function setYaku(required: readonly CardId[], points: number) {
  return (captured: ReadonlySet<CardId>) => {
    const needed = required.filter((id) => !captured.has(id));
    return { met: needed.length === 0, points: needed.length === 0 ? points : 0, needed };
  };
}

function countYaku(type: 'tane' | 'tanzaku' | 'kasu', threshold: number) {
  const pool = CARDS.filter((c) => c.type === type).map((c) => c.id);
  return (captured: ReadonlySet<CardId>) => {
    const count = pool.filter((id) => captured.has(id)).length;
    const met = count >= threshold;
    return {
      met,
      points: met ? 1 + (count - threshold) : 0,
      needed: met ? [] : pool.filter((id) => !captured.has(id)),
    };
  };
}

function lightYaku(withRain: boolean, nonRainRequired: number, points: number) {
  return (captured: ReadonlySet<CardId>) => {
    const nonRainMissing = NON_RAIN_HIKARI.filter((id) => !captured.has(id));
    const nonRainHave = NON_RAIN_HIKARI.length - nonRainMissing.length;
    const hasRain = captured.has(RAIN);
    const met = nonRainHave >= nonRainRequired && (!withRain || hasRain);
    const needed: CardId[] = [];
    if (nonRainHave < nonRainRequired) needed.push(...nonRainMissing);
    if (withRain && !hasRain) needed.push(RAIN);
    return { met, points: met ? points : 0, needed };
  };
}

export const YAKU_DEFS: readonly YakuMeta[] = [
  { id: 'gokou', nameJa: '五光', nameZh: '五張光牌', basePoints: 10, evaluate: lightYaku(true, 4, 10) },
  { id: 'shikou', nameJa: '四光', nameZh: '四張光牌（不含雨）', basePoints: 8, evaluate: lightYaku(false, 4, 8) },
  { id: 'ameShikou', nameJa: '雨四光', nameZh: '含雨的四張光牌', basePoints: 7, evaluate: lightYaku(true, 3, 7) },
  { id: 'sankou', nameJa: '三光', nameZh: '三張光牌（不含雨）', basePoints: 5, evaluate: lightYaku(false, 3, 5) },
  {
    id: 'hanamiZake', nameJa: '花見酒', nameZh: '桜に幕＋菊に盃', basePoints: 5,
    enabled: (r) => r.hanamiZake, evaluate: setYaku([CURTAIN, SAKE_CUP], 5),
  },
  {
    id: 'tsukimiZake', nameJa: '月見酒', nameZh: '芒に月＋菊に盃', basePoints: 5,
    enabled: (r) => r.tsukimiZake, evaluate: setYaku([MOON, SAKE_CUP], 5),
  },
  { id: 'inoshikachou', nameJa: '猪鹿蝶', nameZh: '山豬＋鹿＋蝴蝶', basePoints: 5, evaluate: setYaku(INOSHIKACHOU, 5) },
  { id: 'akatan', nameJa: '赤短', nameZh: '松梅桜的赤短冊', basePoints: 5, evaluate: setYaku(POEM_RIBBONS, 5) },
  { id: 'aotan', nameJa: '青短', nameZh: '牡丹菊紅葉的青短冊', basePoints: 5, evaluate: setYaku(BLUE_RIBBONS, 5) },
  { id: 'tane', nameJa: 'タネ', nameZh: 'タネ牌 5 張起', basePoints: 1, evaluate: countYaku('tane', 5) },
  { id: 'tanzaku', nameJa: 'タン', nameZh: '短冊 5 張起', basePoints: 1, evaluate: countYaku('tanzaku', 5) },
  { id: 'kasu', nameJa: 'カス', nameZh: 'カス 10 張起', basePoints: 1, evaluate: countYaku('kasu', 10) },
];

/** 光役覆蓋順序：只回報最高者 */
const LIGHT_PRIORITY: readonly YakuId[] = ['gokou', 'shikou', 'ameShikou', 'sankou'];

/** 所有啟用役型的進度（供 UI 面板與 AI 啟發式） */
export function yakuStatus(captured: readonly CardId[], rules: RuleConfig): YakuStatus[] {
  const set = new Set(captured);
  for (const id of set) cardOf(id); // 驗證合法 id
  return YAKU_DEFS.filter((d) => d.enabled?.(rules) ?? true).map((d) => {
    const { met, points, needed } = d.evaluate(set);
    return { id: d.id, nameJa: d.nameJa, nameZh: d.nameZh, met, points, basePoints: d.basePoints, needed };
  });
}

/** 已成立的役（光役只取最高），供計分與成役判定 */
export function detectYaku(captured: readonly CardId[], rules: RuleConfig): YakuStatus[] {
  const all = yakuStatus(captured, rules).filter((y) => y.met);
  const bestLight = LIGHT_PRIORITY.find((id) => all.some((y) => y.id === id));
  return all.filter((y) => !LIGHT_PRIORITY.includes(y.id) || y.id === bestLight);
}
