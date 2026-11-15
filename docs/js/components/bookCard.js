import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
export const renderBookCard = book => `<article class="book-card panel-card"><img class="book-cover" src="${e(book.cover)}" alt="${e(l(book.title))}"><div class="book-content"><span class="eyebrow">${e(book.course)} · PDF</span><h2>${e(l(book.title))}</h2><p class="muted">${e(l(book.description))}</p><button class="button is-primary" data-book="${e(book.id)}">${t('view')} PDF</button></div></article>`;
