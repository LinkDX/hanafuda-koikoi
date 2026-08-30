import type { AILevel } from '../../ai';
import type { RuleConfig } from '../../core/rules';
import { DEFAULT_RULES } from '../../core/rules';
import type { CardStyleId } from '../../art/styleTypes';
import { renderCard } from '../components/cardEl';
import { button, el } from '../components/dialogs';
import { S } from '../strings';

export interface MenuResult {
  rules: RuleConfig;
  aiLevel: AILevel;
  style: CardStyleId;
}

export function renderMenu(
  container: HTMLElement,
  defaults: MenuResult,
  onStart: (result: MenuResult) => void,
  onHistory?: () => void,
): void {
  const root = el('div', 'menu');
  root.appendChild(el('h1', 'menu__title', S.appTitle));
  root.appendChild(el('p', 'menu__subtitle', S.subtitle));

  // 招牌光牌扇形展示
  const hero = el('div', 'menu__hero');
  for (const id of [0, 8, 28, 44]) hero.appendChild(renderCard(id, defaults.style));
  root.appendChild(hero);

  let rounds = defaults.rules.totalRounds;
  let aiLevel = defaults.aiLevel;
  let style = defaults.style;
  let hanami = defaults.rules.hanamiZake;
  let tsukimi = defaults.rules.tsukimiZake;

  const optionGroup = <T extends string | number>(
    label: string,
    options: readonly { value: T; label: string }[],
    current: T,
    onPick: (v: T) => void,
  ): HTMLElement => {
    const group = el('div', 'menu__group');
    group.appendChild(el('label', 'menu__label', label));
    const row = el('div', 'menu__options');
    const update = (picked: T) => {
      row.querySelectorAll('.btn').forEach((b) => {
        b.classList.toggle('btn--active', (b as HTMLElement).dataset['value'] === String(picked));
      });
    };
    for (const opt of options) {
      const b = button(opt.label, 'btn btn--option', () => {
        onPick(opt.value);
        update(opt.value);
      });
      b.dataset['value'] = String(opt.value);
      if (opt.value === current) b.classList.add('btn--active');
      row.appendChild(b);
    }
    group.appendChild(row);
    return group;
  };

  root.appendChild(optionGroup(S.rounds, [
    { value: 3, label: `3 ${S.roundsUnit}` },
    { value: 6, label: `6 ${S.roundsUnit}` },
    { value: 12, label: `12 ${S.roundsUnit}` },
  ] as const, rounds, (v) => { rounds = v; }));

  root.appendChild(optionGroup(S.aiLevel, [
    { value: 1, label: S.aiLevels[1]! },
    { value: 2, label: S.aiLevels[2]! },
    { value: 3, label: S.aiLevels[3]! },
  ] as const, aiLevel, (v) => { aiLevel = v as AILevel; }));

  // 傳統風卡面完成後再開放切換
  root.appendChild(optionGroup(S.cardStyle, [
    { value: 'modern', label: S.styleModern },
  ] as const, style, (v) => { style = v as CardStyleId; }));

  const variants = el('div', 'menu__group');
  variants.appendChild(el('label', 'menu__label', S.variants));
  const variantRow = el('div', 'menu__options');
  const toggle = (label: string, initial: boolean, onChange: (v: boolean) => void) => {
    const b = button(label, 'btn btn--option', () => {
      const active = !b.classList.contains('btn--active');
      b.classList.toggle('btn--active', active);
      onChange(active);
    });
    if (initial) b.classList.add('btn--active');
    return b;
  };
  variantRow.appendChild(toggle(S.hanamiZake, hanami, (v) => { hanami = v; }));
  variantRow.appendChild(toggle(S.tsukimiZake, tsukimi, (v) => { tsukimi = v; }));
  variants.appendChild(variantRow);
  root.appendChild(variants);

  root.appendChild(button(S.start, 'btn btn--primary btn--start', () => {
    onStart({
      rules: { ...DEFAULT_RULES, totalRounds: rounds, hanamiZake: hanami, tsukimiZake: tsukimi },
      aiLevel,
      style,
    });
  }));

  if (onHistory) {
    root.appendChild(button(S.history, 'btn', onHistory));
  }

  container.replaceChildren(root);
}
