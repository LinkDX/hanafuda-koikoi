/**
 * CLI 模擬器：隨機 vs 隨機 soak test
 * 用法：npm run simulate [-- 場數]
 */
import { advance, createMatch } from '../src/core/engine';
import { DEFAULT_RULES } from '../src/core/rules';
import { createRng } from '../src/core/rng';
import { matches } from '../src/core/cards';
import type { GameState } from '../src/core/state';
import type { YakuId } from '../src/core/yaku';

const matchCount = Number(process.argv[2] ?? 10000);
const yakuFreq = new Map<YakuId, number>();
let draws = 0;
const wins = [0, 0];
let maxRoundScore = 0;

const start = Date.now();
for (let seed = 1; seed <= matchCount; seed++) {
  const rng = createRng(seed * 7919);
  let state: GameState = advance(createMatch({ ...DEFAULT_RULES, totalRounds: 12 }, seed), {
    type: 'startMatch',
  }).state;
  let guard = 0;
  while (state.phase !== 'matchEnd') {
    if (++guard > 5000) throw new Error(`seed ${seed} 未終局 (phase=${state.phase})`);
    const rs = state.roundState;
    switch (state.phase) {
      case 'awaitHandCard': {
        const hand = rs.hands[rs.turn];
        state = advance(state, { type: 'playHandCard', card: hand[Math.floor(rng() * hand.length)]! }).state;
        break;
      }
      case 'awaitHandMatchChoice':
      case 'awaitDeckMatchChoice': {
        const options = rs.field.filter((f) => matches(f, rs.pendingCard!));
        state = advance(state, { type: 'chooseMatch', fieldCard: options[Math.floor(rng() * options.length)]! }).state;
        break;
      }
      case 'awaitKoiKoi':
        state = advance(state, { type: 'koikoiDecision', declare: rng() < 0.3 }).state;
        break;
      case 'roundEnd': {
        const result = state.roundResult;
        if (result?.breakdown) {
          maxRoundScore = Math.max(maxRoundScore, result.breakdown.total);
          for (const y of result.breakdown.yaku) yakuFreq.set(y.id, (yakuFreq.get(y.id) ?? 0) + 1);
        }
        if (result?.winner === null) draws++;
        state = advance(state, { type: 'acknowledgeRound' }).state;
        break;
      }
      default:
        throw new Error(`不應停在 ${state.phase}`);
    }
  }
  const [a, b] = state.scores;
  if (a > b) wins[0]!++;
  else if (b > a) wins[1]!++;
}
const elapsed = Date.now() - start;

console.log(`模擬 ${matchCount} 場（12 月局）完成，耗時 ${elapsed}ms`);
console.log(`勝場：P0=${wins[0]} P1=${wins[1]}，流局數：${draws}，單局最高分：${maxRoundScore}`);
console.log('役出現頻率：');
for (const [id, n] of [...yakuFreq.entries()].sort((x, y) => y[1] - x[1])) {
  console.log(`  ${id}: ${n}`);
}
