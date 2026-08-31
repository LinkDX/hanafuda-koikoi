import type { GameState, Player } from '../core/state';
import type { YakuId } from '../core/yaku';
import type { CardStyleId } from '../art/styleTypes';

export interface MatchRecordRound {
  winner: Player | null;
  /** 勝者實得點數（含翻倍；流局為 0） */
  points: number;
  yaku: { id: YakuId; points: number }[];
  /** 雙方こいこい宣告次數 */
  koikoi: [number, number];
  /** 手四／くっつき即勝 */
  instantWin?: 'teshi' | 'kuttsuki';
}

/** 對戰紀錄 schema v1 — 變更欄位時 bump schemaVersion 並寫遷移 */
export interface MatchRecord {
  schemaVersion: 1;
  id: string;
  timestamp: number;
  aiLevel: 1 | 2 | 3;
  totalRounds: 3 | 6 | 12;
  finalScores: [number, number];
  winner: Player | null;
  rounds: MatchRecordRound[];
}

/** 玩家偏好設定（跨 session 保存） */
export interface StoredSettings {
  aiLevel: 1 | 2 | 3;
  totalRounds: 3 | 6 | 12;
  hanamiZake: boolean;
  tsukimiZake: boolean;
  style: CardStyleId;
}

/** 進行中的對局存檔（refresh／退出後可續玩） */
export interface SavedGame {
  schemaVersion: 1;
  timestamp: number;
  aiLevel: 1 | 2 | 3;
  style: CardStyleId;
  state: GameState;
  roundLog: MatchRecordRound[];
}

/**
 * 儲存抽象層 — 介面刻意設計為 async：
 * 現行實作為 localStorage，日後可替換為 Firebase 等雲端後端
 * 以支援跨裝置同步，遊戲／UI 層不需改動。
 */
export interface StorageProvider {
  getMatches(): Promise<MatchRecord[]>;
  addMatch(record: MatchRecord): Promise<void>;
  /** 只清對戰紀錄，保留設定 */
  clearMatches(): Promise<void>;
  getSettings(): Promise<StoredSettings | null>;
  saveSettings(settings: StoredSettings): Promise<void>;
  /** 進行中對局：讀／存／清 */
  getSavedGame(): Promise<SavedGame | null>;
  saveGame(saved: SavedGame): Promise<void>;
  clearSavedGame(): Promise<void>;
  /** 成就：成就 id → 解鎖時間（epoch ms） */
  getAchievements(): Promise<Record<string, number>>;
  saveAchievements(unlocked: Record<string, number>): Promise<void>;
  clear(): Promise<void>;
}
