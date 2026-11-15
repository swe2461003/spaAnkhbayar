import { getBooks } from '../services/bookService.js';
import { getCourses } from '../services/courseService.js';
import { renderBookCard } from '../components/bookCard.js';
import { openPdfModal } from '../components/pdfModal.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderGridPageLayout } from '../layouts/gridPageLayout.js';
import { availableCourses } from '../components/courseSelector.js';
import { field, input, listen } from '../components/ui.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
export async function renderBooksPage({ root, params, signal }) {
  const [allBooks, allCourses] = await Promise.all([getBooks(), getCourses()]); if (signal.aborted) return;
  const allowed = new Set(availableCourses(allCourses).map(c => c.id));
  const books = allBooks.filter(b => allowed.has(b.course) && (!params.get('course') || b.course === params.get('course')));
  root.innerHTML = renderPageLayout({ title: t('books'), subtitle: t('materialHelp'), content: `<div class="toolbar panel-card">${field(t('searchLabel'), input('q', '', 'search', 'id="book-search"'))}</div><div id="books-grid"></div>` });
  const draw = () => { const q = root.querySelector('#book-search').value.toLowerCase(); root.querySelector('#books-grid').innerHTML = renderGridPageLayout({ items: books.filter(b => `${b.course} ${l(b.title)}`.toLowerCase().includes(q)), renderItem: renderBookCard }); };
  root.querySelector('#book-search').oninput = draw;
  listen(root, 'click', '[data-book]', (_, el) => { const book = books.find(b => b.id === el.dataset.book); if (book) openPdfModal(book); });
  draw();
}
