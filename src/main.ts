import { registerSW } from 'virtual:pwa-register';
import './styles/main.css';
import './styles/cards.css';
import './styles/board.css';
import './styles/effects.css';
import { initApp } from './ui/app';

// autoUpdate：偵測到新版本時自動接管並重載，避免玩到舊快取
registerSW({ immediate: true });

const app = document.querySelector<HTMLDivElement>('#app');
if (app) initApp(app);
