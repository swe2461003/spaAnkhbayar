import { renderPageLayout } from '../layouts/pageLayout.js';
import { t } from '../i18n/i18n.js';
export function renderNotFoundPage({ root }) {
  root.innerHTML = renderPageLayout({ title: '404', content: `<div class="empty-state"><h2>${t('notFound')}</h2><a class="button is-primary" href="#/overview">${t('home')}</a></div>` });
}
