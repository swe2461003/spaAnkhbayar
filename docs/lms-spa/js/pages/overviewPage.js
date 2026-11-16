import { renderPageLayout } from '../layouts/pageLayout.js';
import { t } from '../i18n/i18n.js';

// 2.2–2.3: overview тусдаа page; бүх page ижил layout ашиглана.
export function renderOverviewPage() {
  document.title = t('overview.title') + ' · LMS';
  document.getElementById('app').innerHTML = renderPageLayout({
    id: 'overview',
    title: t('overview.title'),
    subtitle: t('overview.subtitle'),
    content: `<div class="welcome"><h2>${t('overview.heading')}</h2><p>${t('overview.welcome')}</p><div class="buttons"><a class="button is-primary" href="#/search">${t('overview.primary')}</a><a class="button is-light" href="#/books">${t('overview.secondary')}</a></div></div><h2 class="section-title">${t('overview.sections')}</h2><div class="columns is-multiline"><div class="column is-half-tablet is-one-quarter-desktop"><article class="feature-card"><span class="step-label">01</span><h2>${t('nav.search')}</h2><p>${t('search.description')}</p><a href="#/search">${t('common.view')} →</a></article></div><div class="column is-half-tablet is-one-quarter-desktop"><article class="feature-card"><span class="step-label">02</span><h2>${t('nav.calculation')}</h2><p>${t('calculation.description')}</p><a href="#/calculation">${t('common.view')} →</a></article></div><div class="column is-half-tablet is-one-quarter-desktop"><article class="feature-card"><span class="step-label">03</span><h2>${t('nav.books')}</h2><p>${t('books.description')}</p><a href="#/books">${t('common.view')} →</a></article></div><div class="column is-half-tablet is-one-quarter-desktop"><article class="feature-card"><span class="step-label">04</span><h2>${t('nav.contact')}</h2><p>${t('contact.description')}</p><a href="#/contact">${t('common.view')} →</a></article></div></div><p class="scope-note">${t('common.scope')}</p>`
  });
}
