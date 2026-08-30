import { modernStyle } from '../art/modern';
import { ensureSprite } from '../art/sprites';
import { DEFAULT_RULES } from '../core/rules';
import { LocalStorageProvider } from '../storage/localStorage';
import type { StoredSettings } from '../storage/provider';
import { GameScreen } from './screens/game';
import { renderHistory } from './screens/history';
import { renderMenu } from './screens/menu';
import type { MenuResult } from './screens/menu';

function toStored(settings: MenuResult): StoredSettings {
  return {
    aiLevel: settings.aiLevel,
    totalRounds: settings.rules.totalRounds,
    hanamiZake: settings.rules.hanamiZake,
    tsukimiZake: settings.rules.tsukimiZake,
    style: settings.style,
  };
}

function fromStored(stored: StoredSettings): MenuResult {
  return {
    rules: {
      ...DEFAULT_RULES,
      totalRounds: stored.totalRounds,
      hanamiZake: stored.hanamiZake,
      tsukimiZake: stored.tsukimiZake,
    },
    aiLevel: stored.aiLevel,
    style: stored.style,
  };
}

export function initApp(container: HTMLElement): void {
  ensureSprite(modernStyle);
  const storage = new LocalStorageProvider();

  let game: GameScreen | null = null;
  let settings: MenuResult = {
    rules: DEFAULT_RULES,
    aiLevel: 2,
    style: 'modern',
  };

  const showMenu = (): void => {
    game?.destroy();
    game = null;
    renderMenu(container, settings, (result) => {
      settings = result;
      void storage.saveSettings(toStored(result));
      startGame();
    }, showHistory);
  };

  const showHistory = (): void => {
    game?.destroy();
    game = null;
    void renderHistory(container, storage, showMenu);
  };

  const startGame = (): void => {
    game?.destroy();
    const config = {
      rules: settings.rules,
      aiLevel: settings.aiLevel,
      style: settings.style,
      storage,
      onExit: showMenu,
      onPlayAgain: startGame,
    };
    const seedParam = new URLSearchParams(location.search).get('seed');
    game = new GameScreen(container, seedParam
      ? { ...config, seed: Number(seedParam) >>> 0 }
      : config);
  };

  void storage.getSettings().then((stored) => {
    if (stored) settings = fromStored(stored);
    showMenu();
  });
}
