import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderGridPageLayout } from '../layouts/gridPageLayout.js';
import { renderNotification } from '../layouts/notificationLayout.js';
import { getBooks } from '../services/bookService.js';
import { renderBookCard } from '../components/bookCard.js';
import { openPdfModal } from '../components/pdfModal.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
export async function renderBooksPage({ signal }) {
  const books = await getBooks();
  if (signal.aborted) return;
  const root = document.createElement('div');
  root.innerHTML = renderPageLayout({ id: 'books', title: t('materials.title'), subtitle: t('materials.subtitle'), content: `<div class="box materials-search"><label class="label" for="material-query">${t('filters.query')}</label><input class="input" type="search" id="material-query" placeholder="${t('materials.placeholder')}"></div><div id="materials-results"></div>` });
  document.getElementById('app').replaceChildren(root);
  document.title = t('materials.title') + ' · LMS';
  const draw = () => {
    const q = root.querySelector('input').value.trim().toLocaleLowerCase();
    const shown = books.filter(book => [book.course, l(book.title), l(book.description)].join(' ').toLocaleLowerCase().includes(q));
    root.querySelector('#materials-results').innerHTML = shown.length ? renderGridPageLayout(shown, renderBookCard) : renderNotification(t('materials.empty'));
  };
  root.querySelector('input').oninput = draw;
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-book]');
    if (button) openPdfModal(books.find(book => book.id === button.dataset.book));
  });
  draw();
}
