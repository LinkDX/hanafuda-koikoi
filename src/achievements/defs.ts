import type { CardId } from '../core/cards';
import type { YakuId } from '../core/yaku';
import { YAKU_DEFS } from '../core/yaku';
import type { MatchRecord } from '../storage/provider';

export type AchievementIcon =
  | { kind: 'card'; card: CardId }
  | { kind: 'emoji'; char: string };

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  icon: AchievementIcon;
  /** 判定：整份對戰紀錄 → 是否達成 */
  check: (records: readonly MatchRecord[]) => boolean;
}

/** 玩家（player 0）贏下的局 */
function wonRounds(records: readonly MatchRecord[]) {
  return records.flatMap((r) => r.rounds).filter((round) => round.winner === 0);
}

/** 役圖鑑成就的代表牌 */
const YAKU_ICON: Record<YakuId, CardId> = {
  gokou: 0,        // 松に鶴
  shikou: 44,      // 桐に鳳凰
  ameShikou: 40,   // 柳に小野道風
  sankou: 8,       // 桜に幕
  hanamiZake: 8,
  tsukimiZake: 28, // 芒に月
  inoshikachou: 24, // 萩に猪
  akatan: 1,
  aotan: 21,
  tane: 4,         // 梅に鶯
  tanzaku: 13,
  kasu: 2,
};

const yakuAchievements: AchievementDef[] = YAKU_DEFS.map((y) => ({
  id: `yaku-${y.id}`,
  name: `役圖鑑・${y.nameJa}`,
  desc: `以「${y.nameJa}」（${y.nameZh}）結算獲勝一局`,
  icon: { kind: 'card', card: YAKU_ICON[y.id] },
  check: (records) => wonRounds(records).some((r) => r.yaku.some((v) => v.id === y.id)),
}));

const behaviorAchievements: AchievementDef[] = [
  {
    id: 'first-win', name: '初陣', desc: '贏得第一場對戰',
    icon: { kind: 'emoji', char: '🌸' },
    check: (records) => records.some((r) => r.winner === 0),
  },
  {
    id: 'beat-level-1', name: '新手畢業', desc: '擊敗初級 AI',
    icon: { kind: 'emoji', char: '🥉' },
    check: (records) => records.some((r) => r.winner === 0 && r.aiLevel === 1),
  },
  {
    id: 'beat-level-2', name: '棋逢對手', desc: '擊敗中級 AI',
    icon: { kind: 'emoji', char: '🥈' },
    check: (records) => records.some((r) => r.winner === 0 && r.aiLevel === 2),
  },
  {
    id: 'beat-level-3', name: '賭聖', desc: '擊敗高級 AI',
    icon: { kind: 'emoji', char: '🥇' },
    check: (records) => records.some((r) => r.winner === 0 && r.aiLevel === 3),
  },
  {
    id: 'streak-3', name: '連戰連勝', desc: '連續贏得 3 場對戰',
    icon: { kind: 'emoji', char: '🔥' },
    check: (records) => {
      let streak = 0;
      for (const r of records) {
        streak = r.winner === 0 ? streak + 1 : 0;
        if (streak >= 3) return true;
      }
      return false;
    },
  },
  {
    id: 'shutout', name: '完封', desc: '對手 0 分獲勝一場',
    icon: { kind: 'emoji', char: '🛡️' },
    check: (records) => records.some((r) => r.winner === 0 && r.finalScores[1] === 0),
  },
  {
    id: 'big-match', name: '大豐收', desc: '單場拿下 30 點以上',
    icon: { kind: 'emoji', char: '💰' },
    check: (records) => records.some((r) => r.winner === 0 && r.finalScores[0] >= 30),
  },
  {
    id: 'big-round', name: '會心一擊', desc: '單局結算 14 點以上',
    icon: { kind: 'emoji', char: '⚡' },
    check: (records) => wonRounds(records).some((r) => r.points >= 14),
  },
  {
    id: 'koikoi-win', name: 'こいこい大成功', desc: '喊出こいこい後贏下該局',
    icon: { kind: 'emoji', char: '🎯' },
    check: (records) => wonRounds(records).some((r) => r.koikoi[0] > 0),
  },
  {
    id: 'counter-win', name: '見事反殺', desc: '在對手こいこい中贏下該局',
    icon: { kind: 'emoji', char: '⚔️' },
    check: (records) => wonRounds(records).some((r) => r.koikoi[1] > 0),
  },
  {
    id: 'instant-win', name: '天選之人', desc: '以手四或くっつき即勝',
    icon: { kind: 'emoji', char: '✨' },
    check: (records) => wonRounds(records).some((r) => r.instantWin !== undefined),
  },
  {
    id: 'veteran-10', name: '常客', desc: '完成 10 場對戰',
    icon: { kind: 'emoji', char: '🎴' },
    check: (records) => records.length >= 10,
  },
  {
    id: 'veteran-50', name: '百戰老手', desc: '完成 50 場對戰',
    icon: { kind: 'emoji', char: '👑' },
    check: (records) => records.length >= 50,
  },
];

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  ...behaviorAchievements,
  ...yakuAchievements,
];

/** 從整份對戰紀錄重算已達成的成就（舊紀錄自動回填） */
export function computeAchievements(records: readonly MatchRecord[]): Set<string> {
  const unlocked = new Set<string>();
  for (const a of ACHIEVEMENTS) {
    if (a.check(records)) unlocked.add(a.id);
  }
  return unlocked;
}
