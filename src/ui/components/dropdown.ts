import { el } from './dialogs';

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

/** 自製下拉選單（風格與遊戲一致的漆器金框樣式） */
export function createDropdown<T extends string>(
  options: readonly DropdownOption<T>[],
  value: T,
  onChange: (value: T) => void,
): HTMLElement {
  let current = value;
  const root = el('div', 'dropdown');

  const trigger = el('button', 'btn dropdown__trigger') as HTMLButtonElement;
  trigger.type = 'button';
  trigger.setAttribute('aria-haspopup', 'listbox');
  const triggerLabel = el('span', 'dropdown__label',
    options.find((o) => o.value === current)?.label ?? String(current));
  const caret = el('span', 'dropdown__caret', '▾');
  trigger.append(triggerLabel, caret);
  root.appendChild(trigger);

  const panel = el('div', 'dropdown__panel');
  panel.setAttribute('role', 'listbox');
  root.appendChild(panel);

  const close = (): void => {
    root.classList.remove('dropdown--open');
    document.removeEventListener('pointerdown', onOutside, true);
    document.removeEventListener('keydown', onKey, true);
  };
  const onOutside = (e: Event): void => {
    if (!root.contains(e.target as Node)) close();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') close();
  };
  const open = (): void => {
    root.classList.add('dropdown--open');
    document.addEventListener('pointerdown', onOutside, true);
    document.addEventListener('keydown', onKey, true);
  };

  const renderOptions = (): void => {
    panel.replaceChildren();
    for (const opt of options) {
      const item = el('button', `dropdown__option${opt.value === current ? ' dropdown__option--active' : ''}`) as HTMLButtonElement;
      item.type = 'button';
      item.setAttribute('role', 'option');
      item.textContent = opt.label;
      item.addEventListener('click', () => {
        current = opt.value;
        triggerLabel.textContent = opt.label;
        renderOptions();
        close();
        onChange(opt.value);
      });
      panel.appendChild(item);
    }
  };
  renderOptions();

  trigger.addEventListener('click', () => {
    if (root.classList.contains('dropdown--open')) close();
    else open();
  });

  return root;
}
