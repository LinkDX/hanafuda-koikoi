import { describe, expect, it } from 'vitest';
import { detectYaku, yakuStatus } from '../src/core/yaku';
import { DEFAULT_RULES } from '../src/core/rules';
import type { YakuId } from '../src/core/yaku';

// 牌 id 速查（(月-1)*4+slot）：
// 光：松鶴0 桜幕8 芒月28 柳雨40 桐鳳凰44
// タネ：梅鶯4 藤12 菖蒲16 牡丹蝶20 萩猪24 芒雁29 菊盃32 紅葉鹿36 柳燕41
// 短冊：赤短(歌)1,5,9 無歌13,17,25,42 青短21,33,37
// カス：2,3,6,7,10,11,14,15,18,19,22,23,26,27,30,31,34,35,38,39,43,45,46,47

const R = DEFAULT_RULES;
const ids = (result: { id: YakuId }[]) => result.map((y) => y.id).sort();
const find = (result: { id: YakuId; points: number }[], id: YakuId) =>
  result.find((y) => y.id === id);

describe('光役與覆蓋規則', () => {
  it('五光 10 點，且不重複回報其他光役', () => {
    const r = detectYaku([0, 8, 28, 40, 44], R);
    expect(find(r, 'gokou')?.points).toBe(10);
    expect(ids(r)).toEqual(['gokou']);
  });

  it('四光（不含雨）8 點', () => {
    const r = detectYaku([0, 8, 28, 44], R);
    expect(find(r, 'shikou')?.points).toBe(8);
    expect(ids(r)).toEqual(['shikou']);
  });

  it('雨四光（含柳）7 點', () => {
    const r = detectYaku([0, 8, 28, 40], R);
    expect(find(r, 'ameShikou')?.points).toBe(7);
    expect(ids(r)).toEqual(['ameShikou']);
  });

  it('三光 5 點（不含雨）', () => {
    const r = detectYaku([0, 8, 44], R);
    expect(find(r, 'sankou')?.points).toBe(5);
  });

  it('雨＋兩張非雨光不成三光', () => {
    const r = detectYaku([0, 8, 40], R);
    expect(ids(r)).toEqual([]);
  });
});

describe('組合役', () => {
  it('花見酒：桜に幕＋菊に盃', () => {
    expect(find(detectYaku([8, 32], R), 'hanamiZake')?.points).toBe(5);
  });

  it('花見酒變體關閉時不成役', () => {
    const rules = { ...R, hanamiZake: false };
    expect(find(detectYaku([8, 32], rules), 'hanamiZake')).toBeUndefined();
  });

  it('月見酒：芒に月＋菊に盃', () => {
    expect(find(detectYaku([28, 32], R), 'tsukimiZake')?.points).toBe(5);
  });

  it('猪鹿蝶 5 點', () => {
    expect(find(detectYaku([24, 36, 20], R), 'inoshikachou')?.points).toBe(5);
  });

  it('赤短 5 點、青短 5 點', () => {
    expect(find(detectYaku([1, 5, 9], R), 'akatan')?.points).toBe(5);
    expect(find(detectYaku([21, 33, 37], R), 'aotan')?.points).toBe(5);
  });
});

describe('計數役', () => {
  it('タネ 5 張 1 點、7 張 3 點', () => {
    expect(find(detectYaku([4, 12, 16, 29, 41], R), 'tane')?.points).toBe(1);
    expect(find(detectYaku([4, 12, 16, 29, 41, 20, 24], R), 'tane')?.points).toBe(3);
  });

  it('タン 5 張 1 點；赤短同時計入タン張數', () => {
    const r = detectYaku([1, 5, 9, 13, 17], R);
    expect(find(r, 'akatan')?.points).toBe(5);
    expect(find(r, 'tanzaku')?.points).toBe(1);
  });

  it('カス 10 張 1 點、12 張 3 點', () => {
    const kasu10 = [2, 3, 6, 7, 10, 11, 14, 15, 18, 19];
    expect(find(detectYaku(kasu10, R), 'kasu')?.points).toBe(1);
    expect(find(detectYaku([...kasu10, 22, 23], R), 'kasu')?.points).toBe(3);
  });

  it('計數不足時無役', () => {
    expect(detectYaku([4, 12, 16, 29], R)).toEqual([]);
    expect(detectYaku([2, 3, 6, 7, 10, 11, 14, 15, 18], R)).toEqual([]);
  });
});

describe('yakuStatus（進度／缺牌）', () => {
  it('赤短差一張時 needed 指出缺牌', () => {
    const s = yakuStatus([1, 5], R).find((y) => y.id === 'akatan')!;
    expect(s.met).toBe(false);
    expect(s.needed).toEqual([9]);
  });

  it('猪鹿蝶缺兩張', () => {
    const s = yakuStatus([24], R).find((y) => y.id === 'inoshikachou')!;
    expect([...s.needed].sort((a, b) => a - b)).toEqual([20, 36]);
  });

  it('花見酒缺盃', () => {
    const s = yakuStatus([8], R).find((y) => y.id === 'hanamiZake')!;
    expect(s.needed).toEqual([32]);
  });

  it('已成役 met=true 且 needed 為空', () => {
    const s = yakuStatus([1, 5, 9], R).find((y) => y.id === 'akatan')!;
    expect(s.met).toBe(true);
    expect(s.needed).toEqual([]);
  });

  it('變體關閉的役不出現在 status', () => {
    const s = yakuStatus([8], { ...R, hanamiZake: false });
    expect(s.find((y) => y.id === 'hanamiZake')).toBeUndefined();
  });
});
