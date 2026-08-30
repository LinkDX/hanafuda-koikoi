import { modernStyle } from '../art/modern';
import { ensureSprite } from '../art/sprites';
import { DEFAULT_RULES } from '../core/rules';
import { GameScreen } from './screens/game';
import { renderMenu } from './screens/menu';
import type { MenuResult } from './screens/menu';

export function initApp(container: HTMLElement): void {
  ensureSprite(modernStyle);

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
      startGame();
    });
  };

  const startGame = (): void => {
    game?.destroy();
    const config = {
      rules: settings.rules,
      aiLevel: settings.aiLevel,
      style: settings.style,
      onExit: showMenu,
    };
    const seedParam = new URLSearchParams(location.search).get('seed');
    game = new GameScreen(container, seedParam
      ? { ...config, seed: Number(seedParam) >>> 0 }
      : config);
  };

  showMenu();
}
