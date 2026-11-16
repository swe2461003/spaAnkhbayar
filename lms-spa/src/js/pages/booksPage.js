import { renderPageLayout } from '../layouts/pageLayout.js';
import { t } from '../i18n/i18n.js';

// 2.2–2.3: books тусдаа page; бүх page ижил layout ашиглана.
export function renderBooksPage() {
  document.title = t('books.title') + ' · LMS';
  document.getElementById('app').innerHTML = renderPageLayout({
    id: 'books',
    title: t('books.title'),
    subtitle: t('books.subtitle'),
    content: `<div class="columns is-multiline"><div class="column is-one-third"><article class="feature-card"><span class="step-label">01</span><h2>${t('books.lecture')}</h2><p>${t('books.lectureText')}</p></article></div><div class="column is-one-third"><article class="feature-card"><span class="step-label">02</span><h2>${t('books.lab')}</h2><p>${t('books.labText')}</p></article></div><div class="column is-one-third"><article class="feature-card"><span class="step-label">03</span><h2>${t('books.project')}</h2><p>${t('books.projectText')}</p></article></div></div><p class="scope-note">${t('books.note')}</p>`
  });
}
