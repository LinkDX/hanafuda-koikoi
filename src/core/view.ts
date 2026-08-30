import type { CardId } from './cards';
import type { RuleConfig } from './rules';
import type { GameState, Phase, Player } from './state';

/** 單一玩家可見的資訊（隱藏對手手牌與牌堆內容）— AI 只能拿到這個 */
export interface PlayerView {
  me: Player;
  phase: Phase;
  turn: Player;
  round: number;
  scores: [number, number];
  rules: RuleConfig;
  hand: CardId[];
  field: CardId[];
  myCaptured: CardId[];
  oppCaptured: CardId[];
  deckCount: number;
  oppHandCount: number;
  koikoiDeclared: [number, number];
  pendingCard?: CardId;
}

export function toPlayerView(state: GameState, me: Player): PlayerView {
  const rs = state.roundState;
  const opp = (1 - me) as Player;
  const view: PlayerView = {
    me,
    phase: state.phase,
    turn: rs.turn,
    round: state.round,
    scores: [...state.scores],
    rules: state.rules,
    hand: [...rs.hands[me]],
    field: [...rs.field],
    myCaptured: [...rs.captured[me]],
    oppCaptured: [...rs.captured[opp]],
    deckCount: rs.deck.length,
    oppHandCount: rs.hands[opp].length,
    koikoiDeclared: [...rs.koikoiDeclared],
  };
  if (rs.pendingCard !== undefined) view.pendingCard = rs.pendingCard;
  return view;
}
