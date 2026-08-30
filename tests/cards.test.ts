import { describe, expect, it } from 'vitest';
import { CARDS, cardOf, matches } from '../src/core/cards';

describe('牌組定義', () => {
  it('恰好 48 張，id 與索引一致', () => {
    expect(CARDS).toHaveLength(48);
    CARDS.forEach((c, i) => expect(c.id).toBe(i));
  });

  it('每月恰好 4 張', () => {
    for (let m = 1; m <= 12; m++) {
      expect(CARDS.filter((c) => c.month === m)).toHaveLength(4);
    }
  });

  it('牌種數量：光5、タネ9、短冊10、カス24', () => {
    const count = (t: string) => CARDS.filter((c) => c.type === t).length;
    expect(count('hikari')).toBe(5);
    expect(count('tane')).toBe(9);
    expect(count('tanzaku')).toBe(10);
    expect(count('kasu')).toBe(24);
  });

  it('光牌在正確月份：1桜3芒8柳11桐12', () => {
    const months = CARDS.filter((c) => c.type === 'hikari').map((c) => c.month);
    expect(months.sort((a, b) => a - b)).toEqual([1, 3, 8, 11, 12]);
  });

  it('赤短（歌牌）恰 3 張：松・梅・桜的短冊', () => {
    const poem = CARDS.filter((c) => c.flags.poemRibbon);
    expect(poem).toHaveLength(3);
    expect(poem.every((c) => c.type === 'tanzaku')).toBe(true);
    expect(poem.map((c) => c.month).sort((a, b) => a - b)).toEqual([1, 2, 3]);
  });

  it('青短恰 3 張：牡丹・菊・紅葉的短冊', () => {
    const blue = CARDS.filter((c) => c.flags.blueRibbon);
    expect(blue).toHaveLength(3);
    expect(blue.every((c) => c.type === 'tanzaku')).toBe(true);
    expect(blue.map((c) => c.month).sort((a, b) => a - b)).toEqual([6, 9, 10]);
  });

  it('猪鹿蝶各一張且月份正確', () => {
    const boar = CARDS.filter((c) => c.flags.boar);
    const deer = CARDS.filter((c) => c.flags.deer);
    const butterfly = CARDS.filter((c) => c.flags.butterfly);
    expect(boar).toHaveLength(1);
    expect(deer).toHaveLength(1);
    expect(butterfly).toHaveLength(1);
    expect(boar[0]!.month).toBe(7);
    expect(deer[0]!.month).toBe(10);
    expect(butterfly[0]!.month).toBe(6);
    expect([boar[0]!, deer[0]!, butterfly[0]!].every((c) => c.type === 'tane')).toBe(true);
  });

  it('特殊牌 flags：盃、雨、幕、月', () => {
    const cup = CARDS.filter((c) => c.flags.sakeCup);
    expect(cup).toHaveLength(1);
    expect(cup[0]!.month).toBe(9);
    expect(cup[0]!.type).toBe('tane');

    const rain = CARDS.filter((c) => c.flags.rainMan);
    expect(rain).toHaveLength(1);
    expect(rain[0]!.month).toBe(11);
    expect(rain[0]!.type).toBe('hikari');

    const curtain = CARDS.filter((c) => c.flags.curtain);
    expect(curtain).toHaveLength(1);
    expect(curtain[0]!.month).toBe(3);
    expect(curtain[0]!.type).toBe('hikari');

    const moon = CARDS.filter((c) => c.flags.moon);
    expect(moon).toHaveLength(1);
    expect(moon[0]!.month).toBe(8);
    expect(moon[0]!.type).toBe('hikari');
  });

  it('柳（11月）四種牌各一；桐（12月）1光3カス', () => {
    const yanagi = CARDS.filter((c) => c.month === 11).map((c) => c.type);
    expect([...yanagi].sort()).toEqual(['hikari', 'kasu', 'tane', 'tanzaku']);
    const kiri = CARDS.filter((c) => c.month === 12);
    expect(kiri.filter((c) => c.type === 'hikari')).toHaveLength(1);
    expect(kiri.filter((c) => c.type === 'kasu')).toHaveLength(3);
  });

  it('每張牌都有日文名與中文說明', () => {
    for (const c of CARDS) {
      expect(c.nameJa.length).toBeGreaterThan(0);
      expect(c.nameZh.length).toBeGreaterThan(0);
    }
  });

  it('cardOf 與 matches（同月配對）', () => {
    expect(cardOf(0).month).toBe(1);
    expect(matches(0, 1)).toBe(true);
    expect(matches(0, 4)).toBe(false);
  });
});
