import { matches } from '../core/cards';
import { advance, createMatch } from '../core/engine';
import type { RuleConfig } from '../core/rules';
import type { GameState } from '../core/state';
import { toPlayerView } from '../core/view';
import { detectYaku } from '../core/yaku';
import type { AIStrategy } from './types';

/** Headless 對局：兩個 AI 策略互打一場，回傳終局狀態（測試／模擬用） */
export async function playMatch(
  strategies: readonly [AIStrategy, AIStrategy],
  rules: RuleConfig,
  seed: number,
  maxSteps = 5000,
): Promise<GameState> {
  let state = advance(createMatch(rules, seed), { type: 'startMatch' }).state;
  let steps = 0;
  while (state.phase !== 'matchEnd') {
    if (++steps > maxSteps) throw new Error(`seed ${seed} 超過步數上限 (phase=${state.phase})`);
    const rs = state.roundState;
    const ai = strategies[rs.turn];
    const view = toPlayerView(state, rs.turn);
    switch (state.phase) {
      case 'awaitHandCard': {
        const card = await ai.chooseHandCard(view);
        state = advance(state, { type: 'playHandCard', card }).state;
        break;
      }
      case 'awaitHandMatchChoice':
      case 'awaitDeckMatchChoice': {
        const pending = rs.pendingCard!;
        const options = rs.field.filter((f) => matches(f, pending));
        const fieldCard = await ai.chooseFieldMatch(view, pending, options);
        state = advance(state, { type: 'chooseMatch', fieldCard }).state;
        break;
      }
      case 'awaitKoiKoi': {
        const yaku = detectYaku(rs.captured[rs.turn], state.rules);
        const declare = await ai.decideKoiKoi(view, {
          newYaku: state.pendingYaku ?? [],
          currentPoints: yaku.reduce((s, y) => s + y.points, 0),
        });
        state = advance(state, { type: 'koikoiDecision', declare }).state;
        break;
      }
      case 'roundEnd':
        state = advance(state, { type: 'acknowledgeRound' }).state;
        break;
      default:
        throw new Error(`不應停在 ${state.phase}`);
    }
  }
  return state;
}
