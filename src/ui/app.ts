import { DEFAULT_STYLE, migrateLegacyStyle } from '../art/styleTypes';
import type { CardStyle } from '../art/styleTypes';
import { DEFAULT_RULES } from '../core/rules';
import { LocalStorageProvider } from '../storage/localStorage';
import type { SavedGame, StoredSettings } from '../storage/provider';
import { renderAchievements } from './screens/achievements';
import { GameScreen } from './screens/game';
import { renderHistory } from './screens/history';
import { renderMenu } from './screens/menu';
import type { MenuResult } from './screens/menu';
import { renderRules } from './screens/rules';

function toStored(settings: MenuResult): StoredSettings {
  return {
    aiLevel: settings.aiLevel,
    totalRounds: settings.rules.totalRounds,
    hanamiZake: settings.rules.hanamiZake,
    tsukimiZake: settings.rules.tsukimiZake,
    artSource: settings.style.source,
    framed: settings.style.framed,
  };
}

function fromStored(stored: StoredSettings): MenuResult {
  // 舊版設定用 style: 'traditional'|'modern' — 遷移
  const legacy = migrateLegacyStyle((stored as unknown as { style?: unknown }).style);
  const style: CardStyle =
    migrateLegacyStyle({ source: stored.artSource, framed: stored.framed }) ?? legacy ?? DEFAULT_STYLE;
  return {
    rules: {
      ...DEFAULT_RULES,
      totalRounds: stored.totalRounds,
      hanamiZake: stored.hanamiZake,
      tsukimiZake: stored.tsukimiZake,
    },
    aiLevel: stored.aiLevel,
    style,
  };
}

export function initApp(container: HTMLElement): void {
  const storage = new LocalStorageProvider();

  let game: GameScreen | null = null;
  let settings: MenuResult = {
    rules: DEFAULT_RULES,
    aiLevel: 2,
    style: DEFAULT_STYLE,
  };

  const showMenu = (): void => {
    game?.destroy();
    game = null;
    void storage.getSavedGame().then((saved) => {
      renderMenu(container, settings, (result) => {
        settings = result;
        void storage.saveSettings(toStored(result));
        void storage.clearSavedGame(); // 開新局：捨棄舊進度
        startGame();
      }, showHistory, showRules, saved ? () => resumeGame(saved) : undefined, showAchievements,
      (style) => {
        settings = { ...settings, style };
        void storage.saveSettings(toStored(settings));
      });
    });
  };

  const showRules = (): void => {
    game?.destroy();
    game = null;
    renderRules(container, settings.style, showMenu);
  };

  const showHistory = (): void => {
    game?.destroy();
    game = null;
    void renderHistory(container, storage, showMenu);
  };

  const showAchievements = (): void => {
    game?.destroy();
    game = null;
    void renderAchievements(container, storage, settings.style, showMenu);
  };

  const resumeGame = (saved: SavedGame): void => {
    game?.destroy();
    game = new GameScreen(container, {
      rules: saved.state.rules,
      aiLevel: saved.aiLevel,
      style: settings.style, // 續玩吃「目前」選的卡面風格
      storage,
      resume: saved,
      onExit: showMenu,
      onPlayAgain: startGame,
    });
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

  void Promise.all([storage.getSettings(), storage.getSavedGame()]).then(([stored, saved]) => {
    if (stored) settings = fromStored(stored);
    if (saved) resumeGame(saved); // refresh 後直接續玩
    else showMenu();
  });
}
