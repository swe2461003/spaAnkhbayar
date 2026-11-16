import { getLocalizedValue as l, t } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
export function renderOverviewText(text) {
  return `<section class="box overview-copy"><p class="eyebrow">CON354 · LMS SPA</p><h2 class="section-title">${e(l(text.title))}</h2><p>${e(l(text.body))}</p><ul>${text.points.map(point => `<li>${e(l(point))}</li>`).join('')}</ul><div class="buttons mt-5"><a class="button is-primary" href="#/search">${t('nav.search')}</a><a class="button is-light" href="#/calculation">${t('nav.calculation')}</a></div></section>`;
}
