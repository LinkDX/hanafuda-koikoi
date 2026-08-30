import { describe, expect, it } from 'vitest';
import { checkKuttsuki, checkTeshi, fieldTeshi } from '../src/core/instantWin';

describe('instantWin 判定', () => {
  it('手四：同月 4 張', () => {
    expect(checkTeshi([0, 1, 2, 3, 4, 8, 12, 16])).toBe(true);
    expect(checkTeshi([0, 1, 2, 4, 5, 8, 12, 16])).toBe(false);
  });

  it('くっつき：4 組同月對子', () => {
    expect(checkKuttsuki([0, 1, 4, 5, 8, 9, 12, 13])).toBe(true);
    expect(checkKuttsuki([0, 1, 4, 5, 8, 9, 12, 16])).toBe(false);
    // 同月 4 張（手四）不是くっつき
    expect(checkKuttsuki([0, 1, 2, 3, 4, 5, 8, 9])).toBe(false);
  });

  it('場札手四', () => {
    expect(fieldTeshi([0, 1, 2, 3, 6, 10, 14, 18])).toBe(true);
    expect(fieldTeshi([0, 1, 2, 6, 10, 14, 18, 22])).toBe(false);
  });
});
