import { describe, expect, it } from 'vitest';
import { advance, createMatch } from '../src/core/engine';
import type { GameEvent, GameState } from '../src/core/state';
import { DEFAULT_RULES } from '../src/core/rules';
import { buildDeck } from '../src/core/deck';
import type { Deal } from '../src/core/deck';
import { matches as cardMatches } from '../src/core/cards';

const R3 = { ...DEFAULT_RULES, totalRounds: 3 as const };

// 無即勝、無場札手四的劇本牌局
const HAND0 = [0, 4, 8, 12, 16, 20, 24, 28];
const HAND1 = [1, 5, 9, 13, 17, 21, 25, 29];
const FIELD = [2, 6, 10, 14, 34, 38, 42, 46];
const DECK = buildDeck().filter(
  (c) => !HAND0.includes(c) && !HAND1.includes(c) && !FIELD.includes(c),
);
const SCRIPTED: Deal = { hands: [[...HAND0], [...HAND1]], field: [...FIELD], deck: [...DECK] };

function startScripted(deal: Deal = SCRIPTED): { state: GameState; events: GameEvent[] } {
  let s = createMatch(R3, 123);
  s = { ...s, nextDealOverride: structuredClone(deal) };
  return advance(s, { type: 'startMatch' });
}

const evTypes = (events: GameEvent[]) => events.map((e) => e.type);

describe('發牌與初始狀態', () => {
  it('startMatch 後停在 awaitHandCard，牌數 8/8/8/24，親先手', () => {
    const { state, events } = startScripted();
    expect(state.phase).toBe('awaitHandCard');
    expect(evTypes(events)).toContain('roundDealt');
    expect(state.roundState.hands[0]).toHaveLength(8);
    expect(state.roundState.hands[1]).toHaveLength(8);
    expect(state.roundState.field).toHaveLength(8);
    expect(state.roundState.deck).toHaveLength(24);
    expect(state.roundState.turn).toBe(state.roundState.oya);
  });

  it('隨機 seed 也能開局（不需 override）', () => {
    const { state } = advance(createMatch(R3, 7), { type: 'startMatch' });
    expect(['awaitHandCard', 'roundEnd']).toContain(state.phase);
  });
});

describe('出牌與配對', () => {
  it('單張配對自動吃進；翻牌無配對留在場上', () => {
    const { state } = startScripted();
    // 打 0（1月）：場上只有 2（1月）→ 自動吃 [0,2]；翻牌 deck[0]=3（1月）場上已無 1 月 → 留場
    const r = advance(state, { type: 'playHandCard', card: 0 });
    expect(evTypes(r.events)).toEqual(
      expect.arrayContaining(['cardPlayed', 'cardsCaptured', 'cardToField']),
    );
    expect(r.state.roundState.captured[0]).toEqual(expect.arrayContaining([0, 2]));
    expect(r.state.roundState.field).toContain(3);
    expect(r.state.roundState.turn).toBe(1);
    expect(r.state.phase).toBe('awaitHandCard');
  });

  it('出的牌無配對時留在場上', () => {
    const { state } = startScripted();
    // 打 28（8月）：場上無 8 月 → 留場
    const r = advance(state, { type: 'playHandCard', card: 28 });
    expect(r.state.roundState.field).toContain(28);
    expect(r.state.roundState.captured[0]).not.toContain(28);
  });

  it('兩張同月須擇一', () => {
    const used = [0, 4, 8, 12, 16, 20, 24, 28, 5, 9, 13, 17, 21, 25, 29, 33, 1, 2, 6, 10, 14, 34, 38, 46];
    const rest = buildDeck().filter((c) => !used.includes(c) && c !== 18);
    const deal: Deal = {
      hands: [[0, 4, 8, 12, 16, 20, 24, 28], [5, 9, 13, 17, 21, 25, 29, 33]],
      field: [1, 2, 6, 10, 14, 34, 38, 46],
      // deck 第一張放 18（5月カス，場上無 5 月）避免翻牌干擾斷言
      deck: [18, ...rest],
    };
    const { state } = startScripted(deal);
    // 打 0（1月）：場上有 1、2 兩張 1 月 → 擇一
    const r1 = advance(state, { type: 'playHandCard', card: 0 });
    expect(r1.state.phase).toBe('awaitHandMatchChoice');
    const choiceEv = r1.events.find((e) => e.type === 'matchChoiceRequired');
    expect(choiceEv && 'options' in choiceEv ? choiceEv.options.sort() : []).toEqual([1, 2]);

    const r2 = advance(r1.state, { type: 'chooseMatch', fieldCard: 2 });
    expect(r2.state.roundState.captured[0]).toEqual(expect.arrayContaining([0, 2]));
    expect(r2.state.roundState.field).toContain(1);
  });

  it('三張同月全吃', () => {
    const deal: Deal = {
      hands: [[0, 4, 8, 12, 16, 20, 24, 28], [5, 9, 13, 17, 21, 25, 29, 33]],
      field: [1, 2, 3, 6, 10, 14, 34, 46],
      deck: buildDeck().filter((c) =>
        ![0, 4, 8, 12, 16, 20, 24, 28, 5, 9, 13, 17, 21, 25, 29, 33, 1, 2, 3, 6, 10, 14, 34, 46].includes(c),
      ),
    };
    const { state } = startScripted(deal);
    const r = advance(state, { type: 'playHandCard', card: 0 });
    expect(r.state.roundState.captured[0]).toEqual(expect.arrayContaining([0, 1, 2, 3]));
  });

  it('打不在手上的牌會丟錯', () => {
    const { state } = startScripted();
    expect(() => advance(state, { type: 'playHandCard', card: 1 })).toThrow();
  });
});

describe('成役與こいこい', () => {
  function craftAkatanReady(): GameState {
    // 玩家 0 已吃 [1,5]（赤短×2），手上有 9（桜赤短），場上有 11（桜カス）
    const deal: Deal = {
      hands: [[9, 4, 8, 12, 16, 20, 24, 28], [13, 17, 21, 25, 29, 33, 37, 41]],
      field: [11, 2, 6, 14, 34, 38, 42, 46],
      deck: buildDeck().filter((c) =>
        ![9, 4, 8, 12, 16, 20, 24, 28, 13, 17, 21, 25, 29, 33, 37, 41, 11, 2, 6, 14, 34, 38, 42, 46, 1, 5].includes(c),
      ),
    };
    let state = startScripted(deal).state;
    state = structuredClone(state);
    state.roundState.captured[0] = [1, 5];
    return state;
  }

  it('成役後停在 awaitKoiKoi 並發出 yakuFormed', () => {
    const state = craftAkatanReady();
    const r = advance(state, { type: 'playHandCard', card: 9 });
    expect(r.state.phase).toBe('awaitKoiKoi');
    const ev = r.events.find((e) => e.type === 'yakuFormed');
    expect(ev && 'newYaku' in ev ? ev.newYaku.map((y) => y.id) : []).toContain('akatan');
  });

  it('選勝負 → roundEnded 且分數入帳', () => {
    const state = craftAkatanReady();
    const r1 = advance(state, { type: 'playHandCard', card: 9 });
    const r2 = advance(r1.state, { type: 'koikoiDecision', declare: false });
    expect(r2.state.phase).toBe('roundEnd');
    const ev = r2.events.find((e) => e.type === 'roundEnded');
    expect(ev && 'winner' in ev ? ev.winner : null).toBe(0);
    expect(r2.state.scores[0]).toBeGreaterThanOrEqual(5);
  });

  it('選こいこい → 繼續且記錄宣告，再成役可再選', () => {
    const state = craftAkatanReady();
    const r1 = advance(state, { type: 'playHandCard', card: 9 });
    const r2 = advance(r1.state, { type: 'koikoiDecision', declare: true });
    expect(r2.state.phase).toBe('awaitHandCard');
    expect(r2.state.roundState.turn).toBe(1);
    expect(r2.state.roundState.koikoiDeclared[0]).toBe(1);
  });

  it('對手こいこい中被反殺 → 翻倍', () => {
    // 玩家 0 こいこい後，玩家 1 成役結算應帶 koikoiOpponentDouble
    const state = craftAkatanReady();
    const r1 = advance(state, { type: 'playHandCard', card: 9 });
    let s = advance(r1.state, { type: 'koikoiDecision', declare: true }).state;
    // 給玩家 1 湊青短差一張：已吃 [21,33]（自手中移除），打 37（紅葉青短）吃場上 38（紅葉カス）
    s = structuredClone(s);
    s.roundState.captured[1] = [21, 33];
    s.roundState.hands[1] = s.roundState.hands[1].filter((c) => c !== 21 && c !== 33);
    const r2 = advance(s, { type: 'playHandCard', card: 37 });
    expect(r2.state.phase).toBe('awaitKoiKoi');
    const r3 = advance(r2.state, { type: 'koikoiDecision', declare: false });
    const ev = r3.events.find((e) => e.type === 'roundEnded');
    expect(ev && 'breakdown' in ev ? ev.breakdown?.multipliers : []).toContain('koikoiOpponentDouble');
  });
});

describe('最後一張手牌成役', () => {
  it('自動勝負仍先發出 yakuFormed（供 UI 播成役特效）再 roundEnded', () => {
    const deal: Deal = {
      hands: [[9], [13]],
      field: [11, 18, 22, 26],
      deck: [30, 31, 34, 38],
    };
    let state = startScripted(deal).state;
    state = structuredClone(state);
    state.roundState.captured[0] = [1, 5]; // 赤短差一張
    const r = advance(state, { type: 'playHandCard', card: 9 });
    const types = evTypes(r.events);
    expect(types).toContain('yakuFormed');
    expect(types).toContain('roundEnded');
    expect(types.indexOf('yakuFormed')).toBeLessThan(types.indexOf('roundEnded'));
    const ev = r.events.find((e) => e.type === 'yakuFormed');
    expect(ev && 'newYaku' in ev ? ev.newYaku.map((y) => y.id) : []).toContain('akatan');
    expect(r.state.phase).toBe('roundEnd');
    expect(r.state.roundResult?.winner).toBe(0);
  });
});

describe('局與場的推進', () => {
  it('acknowledgeRound 後進入下一局且勝者當親', () => {
    const state = (() => {
      const deal: Deal = {
        hands: [[9, 4, 8, 12, 16, 20, 24, 28], [13, 17, 21, 25, 29, 33, 37, 41]],
        field: [11, 2, 6, 14, 34, 38, 42, 46],
        deck: buildDeck().filter((c) =>
          ![9, 4, 8, 12, 16, 20, 24, 28, 13, 17, 21, 25, 29, 33, 37, 41, 11, 2, 6, 14, 34, 38, 42, 46, 1, 5].includes(c),
        ),
      };
      let s = startScripted(deal).state;
      s = structuredClone(s);
      s.roundState.captured[0] = [1, 5];
      return s;
    })();
    const r1 = advance(state, { type: 'playHandCard', card: 9 });
    const r2 = advance(r1.state, { type: 'koikoiDecision', declare: false });
    const r3 = advance(r2.state, { type: 'acknowledgeRound' });
    expect(r3.state.round).toBe(2);
    expect(r3.state.roundState.oya).toBe(0);
    expect(['awaitHandCard', 'roundEnd']).toContain(r3.state.phase);
  });
});

describe('property test：隨機對局收斂', () => {
  it('500 場隨機全場：不拋錯、牌數守恆、必然終局', () => {
    for (let seed = 1; seed <= 500; seed++) {
      let { state } = advance(createMatch(R3, seed), { type: 'startMatch' });
      let guard = 0;
      while (state.phase !== 'matchEnd') {
        if (++guard > 2000) throw new Error(`seed ${seed} 未終局`);
        const rs = state.roundState;
        const total =
          rs.hands[0].length + rs.hands[1].length + rs.field.length + rs.deck.length +
          rs.captured[0].length + rs.captured[1].length +
          (rs.pendingCard !== undefined ? 1 : 0);
        expect(total).toBe(48);
        switch (state.phase) {
          case 'awaitHandCard': {
            const hand = rs.hands[rs.turn];
            state = advance(state, { type: 'playHandCard', card: hand[seed % hand.length]! }).state;
            break;
          }
          case 'awaitHandMatchChoice':
          case 'awaitDeckMatchChoice': {
            const options = rs.field.filter((f) => cardMatches(f, rs.pendingCard!));
            state = advance(state, { type: 'chooseMatch', fieldCard: options[seed % options.length]! }).state;
            break;
          }
          case 'awaitKoiKoi':
            state = advance(state, { type: 'koikoiDecision', declare: seed % 2 === 0 }).state;
            break;
          case 'roundEnd':
            state = advance(state, { type: 'acknowledgeRound' }).state;
            break;
          default:
            throw new Error(`不應停在 ${state.phase}`);
        }
      }
    }
  });
});
