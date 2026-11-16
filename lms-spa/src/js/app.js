// 2.4–2.5: Navbar-ийг холбоод router-ийг эхлүүлнэ.
import { mountNavbar } from './components/navbar.js';
import { initRouter } from './router.js';
import { routes } from './routes.js';
import { getCurrentLanguage } from './i18n/i18n.js';

document.documentElement.lang = getCurrentLanguage();
mountNavbar(document.getElementById('navbar'));
initRouter(routes);
