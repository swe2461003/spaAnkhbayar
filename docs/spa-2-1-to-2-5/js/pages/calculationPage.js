import { renderPageLayout } from '../layouts/pageLayout.js';
import { t } from '../i18n/i18n.js';

// 2.2–2.3: calculation тусдаа page; бүх page ижил layout ашиглана.
export function renderCalculationPage() {
  document.title = t('calculation.title') + ' · LMS';
  document.getElementById('app').innerHTML = renderPageLayout({
    id: 'calculation',
    title: t('calculation.title'),
    subtitle: t('calculation.subtitle'),
    content: `<div class="box content"><h2 class="section-title">${t('calculation.heading')}</h2><ol><li>${t('calculation.one')}</li><li>${t('calculation.two')}</li><li>${t('calculation.three')}</li><li>${t('calculation.four')}</li></ol></div><p class="scope-note">${t('calculation.note')}</p>`
  });
}
