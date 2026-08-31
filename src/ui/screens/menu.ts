import type { AILevel } from '../../ai';
import type { RuleConfig } from '../../core/rules';
import { DEFAULT_RULES } from '../../core/rules';
import { availableSources } from '../../art/sprites';
import type { CardStyle } from '../../art/styleTypes';
import { renderCard } from '../components/cardEl';
import { button, el } from '../components/dialogs';
import { createDropdown } from '../components/dropdown';
import { S } from '../strings';

export interface MenuResult {
  rules: RuleConfig;
  aiLevel: AILevel;
  style: CardStyle;
}

export function renderMenu(
  container: HTMLElement,
  defaults: MenuResult,
  onStart: (result: MenuResult) => void,
  onHistory?: () => void,
  onRules?: () => void,
  onContinue?: () => void,
  onAchievements?: () => void,
  onStyleChange?: (style: CardStyle) => void,
): void {
  const root = el('div', 'menu');
  root.appendChild(el('h1', 'menu__title', S.appTitle));
  root.appendChild(el('p', 'menu__subtitle', S.subtitle));

  let rounds = defaults.rules.totalRounds;
  let aiLevel = defaults.aiLevel;
  let style: CardStyle = { ...defaults.style };
  let hanami = defaults.rules.hanamiZake;
  let tsukimi = defaults.rules.tsukimiZake;

  // 招牌光牌扇形展示（切換風格立即反映）
  const hero = el('div', 'menu__hero');
  const renderHero = (): void => {
    hero.replaceChildren();
    for (const id of [0, 8, 28, 44]) hero.appendChild(renderCard(id, style));
  };
  renderHero();
  root.appendChild(hero);

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

  const toggle = (label: string, initial: boolean, onChange: (v: boolean) => void): HTMLButtonElement => {
    const b = button(label, 'btn btn--option', () => {
      const active = !b.classList.contains('btn--active');
      b.classList.toggle('btn--active', active);
      onChange(active);
    });
    if (initial) b.classList.add('btn--active');
    return b;
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

  // 卡面畫風（自製下拉選單）＋圖鑑框開關
  const styleChanged = (): void => {
    renderHero();
    onStyleChange?.({ ...style });
  };
  const styleGroup = el('div', 'menu__group');
  styleGroup.appendChild(el('label', 'menu__label', S.cardStyle));
  const styleRow = el('div', 'menu__options');
  styleRow.appendChild(createDropdown(
    availableSources().map((id) => ({ value: id, label: S.sourceNames[id] ?? id })),
    style.source,
    (v) => { style.source = v; styleChanged(); },
  ));
  styleRow.appendChild(toggle(S.frameToggle, style.framed, (v) => { style.framed = v; styleChanged(); }));
  styleGroup.appendChild(styleRow);
  root.appendChild(styleGroup);

  const variants = el('div', 'menu__group');
  variants.appendChild(el('label', 'menu__label', S.variants));
  const variantRow = el('div', 'menu__options');
  variantRow.appendChild(toggle(S.hanamiZake, hanami, (v) => { hanami = v; }));
  variantRow.appendChild(toggle(S.tsukimiZake, tsukimi, (v) => { tsukimi = v; }));
  variants.appendChild(variantRow);
  root.appendChild(variants);

  if (onContinue) {
    root.appendChild(button(S.continueGame, 'btn btn--primary btn--start', onContinue));
  }

  root.appendChild(button(S.start, `btn btn--start${onContinue ? '' : ' btn--primary'}`, () => {
    onStart({
      rules: { ...DEFAULT_RULES, totalRounds: rounds, hanamiZake: hanami, tsukimiZake: tsukimi },
      aiLevel,
      style: { ...style },
    });
  }));

  const links = el('div', 'menu__links');
  if (onRules) links.appendChild(button(S.rules, 'btn', onRules));
  if (onHistory) links.appendChild(button(S.history, 'btn', onHistory));
  if (onAchievements) links.appendChild(button(S.achievements, 'btn', onAchievements));
  if (links.childElementCount > 0) root.appendChild(links);

  root.appendChild(el('p', 'menu__version', `v${__APP_VERSION__}`));

  container.replaceChildren(root);
}
