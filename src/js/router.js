import { t } from './i18n/i18n.js';
import { getSession } from './services/authService.js';
import { escapeHtml } from './fn/format.js';
// §2.1 hash router. Epoch + detached root prevent a slow old request overwriting a new page.
let epoch = 0;
let dispose = () => {};
let routeMap;
let shell;
export async function renderRoute() {
  const token = ++epoch; dispose(); dispose = () => {};
  document.getElementById('modal-root').replaceChildren();
  const url = new URL(location.hash.slice(1) || '/overview', 'https://local.invalid');
  let path = url.pathname;
  if (!getSession() && path !== '/login') { location.replace('#/login'); return; }
  if (path === '/') path = '/overview';
  shell?.(path);
  const target = document.getElementById('app');
  const root = document.createElement('div');
  root.innerHTML = `<div class="page"><p>${t('loading')}</p></div>`;
  target.replaceChildren(root);
  const page = routeMap[path] ?? routeMap['/404'];
  const controller = new AbortController();
  dispose = () => controller.abort();
  try {
    const cleanup = await page({ root, params: url.searchParams, signal: controller.signal });
    if (token !== epoch) { cleanup?.(); return; }
    dispose = () => { controller.abort(); cleanup?.(); };
    document.title = `${t(path.slice(1))} · ХААИС DLMS`;
    document.getElementById('main-content').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  } catch (error) {
    if (token !== epoch) return;
    console.error(error);
    root.innerHTML = `<div class="page"><div class="notification is-danger is-light" role="alert">${escapeHtml(t('error'))}</div><button class="button" id="retry">${t('retry')}</button></div>`;
    root.querySelector('#retry').onclick = renderRoute;
  }
}
export function initRouter(routes, onRoute) {
  routeMap = routes; shell = onRoute;
  window.addEventListener('hashchange', renderRoute);
  window.addEventListener('languagechange', renderRoute);
  window.addEventListener('departmentchange', renderRoute);
  renderRoute();
}
