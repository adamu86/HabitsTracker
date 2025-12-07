import './styles.css';
import { App } from './app.js';

const app = new App();
app.init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
    });
  });
}
