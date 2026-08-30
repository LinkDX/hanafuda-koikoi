import { matches } from './cards';
import type { CardId } from './cards';
import { deal as dealCards } from './deck';
import type { Deal } from './deck';
import { checkKuttsuki, checkTeshi, fieldTeshi } from './instantWin';
import { createRng } from './rng';
import type { RuleConfig } from './rules';
import { computeRoundScore, INSTANT_WIN_POINTS } from './scoring';
import { detectYaku } from './yaku';
import type { YakuId } from './yaku';
import type { Action, GameEvent, GameState, Player, RoundState } from './state';

export function createMatch(rules: RuleConfig, seed: number): GameState {
  return {
    rules,
    round: 1,
    scores: [0, 0],
    phase: 'matchStart',
    roundState: emptyRound(0),
    rngState: seed >>> 0,
  };
}

function emptyRound(oya: Player): RoundState {
  return {
    hands: [[], []],
    field: [],
    deck: [],
    captured: [[], []],
    turn: oya,
    oya,
    koikoiDeclared: [0, 0],
    lockedYaku: [{}, {}],
  };
}

/**
 * 純 reducer：處理一個外部動作，並自動推進所有內部流程
 * （翻牌堆、成役檢查…），直到停在需要輸入的 phase 或終局。
 */
export function advance(state: GameState, action: Action): { state: GameState; events: GameEvent[] } {
  const s = structuredClone(state);
  const events: GameEvent[] = [];

  const drawSeed = (): number => {
    const rng = createRng(s.rngState);
    const next = Math.floor(rng() * 2 ** 32);
    s.rngState = next >>> 0;
    return s.rngState;
  };

  const dealRound = (): void => {
    let d: Deal;
    if (s.nextDealOverride) {
      d = s.nextDealOverride;
      delete s.nextDealOverride;
      if (fieldTeshi(d.field)) {
        events.push({ type: 'redeal', reason: 'fieldTeshi' });
        d = dealCards(createRng(drawSeed()));
      }
    } else {
      d = dealCards(createRng(drawSeed()));
    }
    while (fieldTeshi(d.field)) {
      events.push({ type: 'redeal', reason: 'fieldTeshi' });
      d = dealCards(createRng(drawSeed()));
    }
    const oya = s.roundState.oya;
    s.roundState = { ...emptyRound(oya), hands: d.hands, field: d.field, deck: d.deck };
    events.push({ type: 'roundDealt', round: s.round, oya, field: [...d.field] });

    // 即勝檢查（親優先）
    for (const p of [oya, (1 - oya) as Player]) {
      const kind = checkTeshi(s.roundState.hands[p]) ? 'teshi'
        : checkKuttsuki(s.roundState.hands[p]) ? 'kuttsuki' : null;
      if (kind) {
        events.push({ type: 'instantWin', player: p, kind, points: INSTANT_WIN_POINTS });
        s.scores[p] += INSTANT_WIN_POINTS;
        s.roundResult = {
          winner: p,
          breakdown: { yaku: [], base: INSTANT_WIN_POINTS, multipliers: [], total: INSTANT_WIN_POINTS },
          instantWin: kind,
        };
        s.phase = 'roundEnd';
        events.push({ type: 'roundEnded', winner: p, breakdown: s.roundResult.breakdown, scores: [...s.scores] });
        return;
      }
    }
    s.roundState.turn = oya;
    s.phase = 'awaitHandCard';
  };

  const capture = (player: Player, cards: CardId[]): void => {
    s.roundState.captured[player].push(...cards);
    events.push({ type: 'cardsCaptured', player, cards });
  };

  /** 出牌／翻牌與場札的配對解析；回傳 true 表示流程停住等待選擇 */
  const resolvePlay = (card: CardId, source: 'hand' | 'deck'): boolean => {
    const rs = s.roundState;
    const options = rs.field.filter((f) => matches(f, card));
    if (options.length === 0) {
      rs.field.push(card);
      events.push({ type: 'cardToField', card });
      return false;
    }
    if (options.length === 2) {
      rs.pendingCard = card;
      rs.pendingSource = source;
      s.phase = source === 'hand' ? 'awaitHandMatchChoice' : 'awaitDeckMatchChoice';
      events.push({ type: 'matchChoiceRequired', player: rs.turn, card, options: [...options] });
      return true;
    }
    // 1 張或 3 張：全部吃進
    rs.field = rs.field.filter((f) => !options.includes(f));
    capture(rs.turn, [card, ...options]);
    return false;
  };

  const flipDeck = (): void => {
    const rs = s.roundState;
    const card = rs.deck.shift();
    if (card === undefined) {
      yakuCheck();
      return;
    }
    events.push({ type: 'cardPlayed', player: rs.turn, card, source: 'deck' });
    if (!resolvePlay(card, 'deck')) yakuCheck();
  };

  const currentYakuMap = (player: Player): Partial<Record<YakuId, number>> => {
    const map: Partial<Record<YakuId, number>> = {};
    for (const y of detectYaku(s.roundState.captured[player], s.rules)) map[y.id] = y.points;
    return map;
  };

  const yakuCheck = (): void => {
    const rs = s.roundState;
    const player = rs.turn;
    const all = detectYaku(rs.captured[player], s.rules);
    const locked = rs.lockedYaku[player];
    const newYaku = all.filter((y) => (locked[y.id] ?? 0) < y.points);
    if (newYaku.length > 0) {
      if (rs.hands[player].length === 0) {
        endRound(player); // 最後一張成役：自動勝負
        return;
      }
      s.pendingYaku = newYaku;
      s.phase = 'awaitKoiKoi';
      events.push({ type: 'yakuFormed', player, newYaku, allYaku: all });
      return;
    }
    endTurn();
  };

  const endTurn = (): void => {
    const rs = s.roundState;
    if (rs.hands[0].length === 0 && rs.hands[1].length === 0) {
      endRound(null); // 流局
      return;
    }
    rs.turn = (1 - rs.turn) as Player;
    s.phase = 'awaitHandCard';
  };

  const endRound = (winner: Player | null): void => {
    if (winner === null) {
      s.roundResult = { winner: null, breakdown: null };
    } else {
      const rs = s.roundState;
      const breakdown = computeRoundScore(
        detectYaku(rs.captured[winner], s.rules),
        { opponentDeclaredKoiKoi: rs.koikoiDeclared[(1 - winner) as Player] > 0 },
        s.rules,
      );
      s.scores[winner] += breakdown.total;
      s.roundResult = { winner, breakdown };
    }
    s.phase = 'roundEnd';
    events.push({
      type: 'roundEnded',
      winner,
      breakdown: s.roundResult.breakdown,
      scores: [...s.scores],
    });
  };

  switch (action.type) {
    case 'startMatch': {
      if (s.phase !== 'matchStart') throw new Error(`startMatch 不可用於 phase ${s.phase}`);
      dealRound();
      break;
    }
    case 'playHandCard': {
      if (s.phase !== 'awaitHandCard') throw new Error(`playHandCard 不可用於 phase ${s.phase}`);
      const rs = s.roundState;
      const idx = rs.hands[rs.turn].indexOf(action.card);
      if (idx === -1) throw new Error(`牌 ${action.card} 不在玩家 ${rs.turn} 手中`);
      rs.hands[rs.turn].splice(idx, 1);
      events.push({ type: 'cardPlayed', player: rs.turn, card: action.card, source: 'hand' });
      if (!resolvePlay(action.card, 'hand')) flipDeck();
      break;
    }
    case 'chooseMatch': {
      if (s.phase !== 'awaitHandMatchChoice' && s.phase !== 'awaitDeckMatchChoice') {
        throw new Error(`chooseMatch 不可用於 phase ${s.phase}`);
      }
      const rs = s.roundState;
      const pending = rs.pendingCard;
      if (pending === undefined) throw new Error('沒有待配對的牌');
      if (!rs.field.includes(action.fieldCard) || !matches(action.fieldCard, pending)) {
        throw new Error(`場牌 ${action.fieldCard} 不是合法配對`);
      }
      rs.field = rs.field.filter((f) => f !== action.fieldCard);
      const source = rs.pendingSource;
      delete rs.pendingCard;
      delete rs.pendingSource;
      capture(rs.turn, [pending, action.fieldCard]);
      if (source === 'hand') flipDeck();
      else yakuCheck();
      break;
    }
    case 'koikoiDecision': {
      if (s.phase !== 'awaitKoiKoi') throw new Error(`koikoiDecision 不可用於 phase ${s.phase}`);
      const rs = s.roundState;
      delete s.pendingYaku;
      if (action.declare) {
        rs.koikoiDeclared[rs.turn] += 1;
        rs.lockedYaku[rs.turn] = currentYakuMap(rs.turn);
        events.push({ type: 'koikoiDeclared', player: rs.turn });
        endTurn();
      } else {
        endRound(rs.turn);
      }
      break;
    }
    case 'acknowledgeRound': {
      if (s.phase !== 'roundEnd') throw new Error(`acknowledgeRound 不可用於 phase ${s.phase}`);
      if (s.round >= s.rules.totalRounds) {
        s.phase = 'matchEnd';
        const [a, b] = s.scores;
        const winner: Player | null = a === b ? null : a > b ? 0 : 1;
        events.push({ type: 'matchEnded', winner, scores: [...s.scores] });
        break;
      }
      s.round += 1;
      const winner = s.roundResult?.winner;
      s.roundState.oya = winner ?? s.roundState.oya; // 流局親續任
      delete s.roundResult;
      dealRound();
      break;
    }
  }

  return { state: s, events };
}
