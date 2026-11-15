import { initRouter } from './router.js';
import { routes } from './routes.js';
import { mountNavbar } from './components/navbar.js';
import { mountFooter } from './components/footer.js';
import { getCurrentLanguage } from './i18n/i18n.js';
document.documentElement.lang = getCurrentLanguage();
document.querySelector('.skip-link').onclick = ev => { ev.preventDefault(); document.getElementById('main-content').focus(); };
initRouter(routes, path => { mountNavbar(path); mountFooter(); });
