import { renderPageLayout } from '../layouts/pageLayout.js';
import { t } from '../i18n/i18n.js';

// 2.2–2.3: contact тусдаа page; бүх page ижил layout ашиглана.
export function renderContactPage() {
  document.title = t('contact.title') + ' · LMS';
  document.getElementById('app').innerHTML = renderPageLayout({
    id: 'contact',
    title: t('contact.title'),
    subtitle: t('contact.subtitle'),
    content: `<div class="box content"><p class="eyebrow">${t('contact.info')}</p><h2 class="section-title">${t('contact.heading')}</h2><ul><li>${t('contact.one')}</li><li>${t('contact.two')}</li><li>${t('contact.three')}</li></ul></div><p class="scope-note">${t('contact.note')}</p>`
  });
}
