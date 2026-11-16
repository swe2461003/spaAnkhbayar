import { t } from './i18n/i18n.js';
import { renderNotification } from './layouts/notificationLayout.js';
export function initRouter(routes) {
  let controller;
  async function renderRoute() {
    controller?.abort(); controller = new AbortController();
    const signal = controller.signal;
    document.getElementById('image-modal-root')?.replaceChildren();
    document.getElementById('dialog-root')?.replaceChildren();
    const url = new URL(window.location.hash.slice(1) || '/overview', 'https://local.invalid');
    const hash = '#' + url.pathname;
    const page = routes[hash] || routes['#/404'];
    try { await page?.({ signal, params: url.searchParams }); }
    catch (error) {
      if (signal.aborted) return;
      console.error(error);
      document.getElementById('app').innerHTML = `<section class="section"><div class="container">${renderNotification(t('filters.error'), true)}<button id="retry-page" class="button is-primary">${t('filters.retry')}</button></div></section>`;
      document.getElementById('retry-page').onclick = renderRoute;
    }
    if (signal.aborted) return;
    document.querySelectorAll('.navbar-menu .navbar-item[href^="#/"]').forEach(link => {
      const active = link.getAttribute('href') === hash;
      link.classList.toggle('is-current', active);
      if (active) { link.setAttribute('aria-current', 'page'); document.getElementById('topbar-title').textContent = link.textContent.trim(); }
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}

