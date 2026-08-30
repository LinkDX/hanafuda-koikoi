import { describe, expect, it } from 'vitest';
import { createRng } from '../src/core/rng';
import { buildDeck, deal, shuffle } from '../src/core/deck';

describe('rng', () => {
  it('相同 seed 產生相同序列', () => {
    const a = createRng(42);
    const b = createRng(42);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });

  it('不同 seed 產生不同序列', () => {
    const a = createRng(1);
    const b = createRng(2);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).not.toEqual(seqB);
  });

  it('輸出落在 [0, 1)', () => {
    const rng = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('deck', () => {
  it('buildDeck 回傳 0..47', () => {
    expect(buildDeck()).toEqual(Array.from({ length: 48 }, (_, i) => i));
  });

  it('shuffle 是確定性的排列（同 seed 同結果）', () => {
    const a = shuffle(buildDeck(), createRng(99));
    const b = shuffle(buildDeck(), createRng(99));
    expect(a).toEqual(b);
    expect([...a].sort((x, y) => x - y)).toEqual(buildDeck());
    expect(a).not.toEqual(buildDeck());
  });

  it('shuffle 不改變輸入陣列', () => {
    const input = buildDeck();
    shuffle(input, createRng(1));
    expect(input).toEqual(buildDeck());
  });

  it('deal 發出 8/8/8/24 且互斥聯集為全牌', () => {
    const { hands, field, deck } = deal(createRng(5));
    expect(hands[0]).toHaveLength(8);
    expect(hands[1]).toHaveLength(8);
    expect(field).toHaveLength(8);
    expect(deck).toHaveLength(24);
    const all = [...hands[0], ...hands[1], ...field, ...deck].sort((a, b) => a - b);
    expect(all).toEqual(buildDeck());
  });
});
