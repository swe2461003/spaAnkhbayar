import { renderPageLayout } from '../layouts/pageLayout.js';
import { panel } from '../components/ui.js';
import { t } from '../i18n/i18n.js';
export function renderContactPage({ root }) {
  root.innerHTML = renderPageLayout({ title: t('contact'), content: panel('CON354 · DLMS', `<p>${t('helpBody')}</p><p class="mt-4"><a href="#/feedback">${t('feedback')}</a></p>`) });
}
