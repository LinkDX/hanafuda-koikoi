import type { CardId } from './cards';
import type { Deal } from './deck';
import type { RuleConfig } from './rules';
import type { ScoreBreakdown } from './scoring';
import type { YakuId, YakuStatus } from './yaku';

export type Player = 0 | 1;

export type Phase =
  | 'matchStart'
  | 'awaitHandCard'
  | 'awaitHandMatchChoice'
  | 'awaitDeckMatchChoice'
  | 'awaitKoiKoi'
  | 'roundEnd'
  | 'matchEnd';

export interface RoundState {
  hands: [CardId[], CardId[]];
  field: CardId[];
  deck: CardId[];
  captured: [CardId[], CardId[]];
  turn: Player;
  oya: Player;
  koikoiDeclared: [number, number];
  /** 上次こいこい決策時的役點快照（役id→點數），用於偵測「新成役」 */
  lockedYaku: [Partial<Record<YakuId, number>>, Partial<Record<YakuId, number>>];
  /** 等待配對選擇中的牌 */
  pendingCard?: CardId;
  pendingSource?: 'hand' | 'deck';
}

export interface RoundResult {
  winner: Player | null;
  breakdown: ScoreBreakdown | null;
  instantWin?: 'teshi' | 'kuttsuki';
}

export interface GameState {
  rules: RuleConfig;
  round: number; // 1..totalRounds
  scores: [number, number];
  phase: Phase;
  roundState: RoundState;
  roundResult?: RoundResult;
  /** 成役等待こいこい決策時的新役 */
  pendingYaku?: YakuStatus[];
  rngState: number;
  /** 測試用：下一局改用指定牌局 */
  nextDealOverride?: Deal;
}

export type Action =
  | { type: 'startMatch' }
  | { type: 'playHandCard'; card: CardId }
  | { type: 'chooseMatch'; fieldCard: CardId }
  | { type: 'koikoiDecision'; declare: boolean }
  | { type: 'acknowledgeRound' };

export type GameEvent =
  | { type: 'roundDealt'; round: number; oya: Player; field: CardId[] }
  | { type: 'redeal'; reason: 'fieldTeshi' }
  | { type: 'instantWin'; player: Player; kind: 'teshi' | 'kuttsuki'; points: number }
  | { type: 'cardPlayed'; player: Player; card: CardId; source: 'hand' | 'deck' }
  | { type: 'cardsCaptured'; player: Player; cards: CardId[] }
  | { type: 'cardToField'; card: CardId }
  | { type: 'matchChoiceRequired'; player: Player; card: CardId; options: CardId[] }
  | { type: 'yakuFormed'; player: Player; newYaku: YakuStatus[]; allYaku: YakuStatus[] }
  | { type: 'koikoiDeclared'; player: Player }
  | { type: 'roundEnded'; winner: Player | null; breakdown: ScoreBreakdown | null; scores: [number, number] }
  | { type: 'matchEnded'; winner: Player | null; scores: [number, number] };
