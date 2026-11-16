import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
export function renderBookCard(book) {
  return `<article class="material-card"><img src="${e(book.cover)}" alt="${e(l(book.title))}" width="640" height="360"><div><span class="eyebrow">${e(book.course)} · PDF</span><h2>${e(l(book.title))}</h2><p>${e(l(book.description))}</p><button class="button is-primary" data-book="${e(book.id)}">${t('materials.view')}</button></div></article>`;
}
