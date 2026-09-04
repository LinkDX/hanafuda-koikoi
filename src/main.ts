import { registerSW } from 'virtual:pwa-register';
import './styles/main.css';
import './styles/cards.css';
import './styles/board.css';
import './styles/effects.css';
import { initApp } from './ui/app';

// autoUpdate：偵測到新版本時自動接管並重載，避免玩到舊快取。
// 行動裝置 PWA 常駐記憶體、不會重新載入，故回到前景與定時都要主動檢查更新
// （對局進度有自動保存，重載後可無縫續玩）。
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;
    const check = (): void => {
      if (navigator.onLine) void registration.update().catch(() => {});
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') check();
    });
    setInterval(check, 15 * 60 * 1000);
  },
});

const app = document.querySelector<HTMLDivElement>('#app');
if (app) initApp(app);
