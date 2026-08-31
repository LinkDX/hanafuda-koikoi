import './styles/main.css';
import './styles/cards.css';
import './styles/board.css';
import './styles/effects.css';
import { initApp } from './ui/app';

const app = document.querySelector<HTMLDivElement>('#app');
if (app) initApp(app);
