import { t } from '../i18n/i18n.js';
export function mountFooter(root) {
  root.innerHTML = `<footer class="lms-footer"><div class="container footer-grid"><div><h2>CON354 · LMS SPA</h2><p>${t('footer.description')}</p></div><nav aria-label="${t('footer.navigation')}"><h2>${t('footer.navigation')}</h2><a href="#/overview">${t('nav.overview')}</a><a href="#/search">${t('nav.search')}</a><a href="#/calculation">${t('nav.calculation')}</a><a href="#/books">${t('nav.books')}</a></nav><div><h2>${t('footer.project')}</h2><a href="https://github.com/swe2461003/spaAnkhbayar/tree/main/lms-spa" target="_blank" rel="noopener noreferrer">GitHub · swe2461003</a><p>${t('footer.scope')}</p><small>© ${new Date().getFullYear()} CON354</small></div></div></footer>`;
}
