import { renderPageLayout } from '../layouts/pageLayout.js';
import { t } from '../i18n/i18n.js';

// 2.2–2.3: notFound тусдаа page; бүх page ижил layout ашиглана.
export function renderNotFoundPage() {
  document.title = t('notFound.title') + ' · LMS';
  document.getElementById('app').innerHTML = renderPageLayout({
    id: 'notFound',
    title: t('notFound.title'),
    subtitle: t('notFound.subtitle'),
    content: `<div class="box empty-page"><strong class="title is-1">404</strong><p>${t('notFound.message')}</p><a class="button is-primary" href="#/overview">${t('notFound.back')}</a></div>`
  });
}
