import { renderPageLayout } from '../layouts/pageLayout.js';
import { t } from '../i18n/i18n.js';

// 2.2–2.3: search тусдаа page; бүх page ижил layout ашиглана.
export function renderSearchPage() {
  document.title = t('search.title') + ' · LMS';
  document.getElementById('app').innerHTML = renderPageLayout({
    id: 'search',
    title: t('search.title'),
    subtitle: t('search.subtitle'),
    content: `<div class="table-container"><table class="table is-fullwidth"><thead><tr><th scope="col">${t('search.code')}</th><th scope="col">${t('search.name')}</th><th scope="col">${t('search.type')}</th></tr></thead><tbody><tr><td><strong>CON354</strong></td><td>${t('search.course1')}</td><td><span class="tag is-success is-light">${t('search.lab')}</span></td></tr><tr><td><strong>CS203</strong></td><td>${t('search.course2')}</td><td><span class="tag is-success is-light">${t('search.lecture')}</span></td></tr><tr><td><strong>DB201</strong></td><td>${t('search.course3')}</td><td><span class="tag is-success is-light">${t('search.practice')}</span></td></tr></tbody></table></div><p class="scope-note">${t('search.note')}</p>`
  });
}
