import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderSplitPageLayout } from '../layouts/splitPageLayout.js';
import { getCourses } from '../services/courseService.js';
import { loadTxt } from '../services/txtService.js';
import { getBooks } from '../services/bookService.js';
import { renderOverviewText } from '../components/overviewText.js';
import { renderMap, bindMapEvents } from '../components/map.js';
import { t } from '../i18n/i18n.js';

// 2.10: Номын map + text + info modal-ийг LMS-ийн чиглэлд тохируулсан.
export async function renderOverviewPage({ signal }) {
  const app = document.getElementById('app');
  app.innerHTML = renderPageLayout({ title: t('dashboard.title'), content: `<p>${t('filters.loading')}</p>` });
  const [courses, text, books] = await Promise.all([getCourses(), loadTxt(), getBooks()]);
  if (signal.aborted) return;
  const root = document.createElement('div');
  const counts = [[courses.length, t('dashboard.courses')], [new Set(courses.map(c => c.department)).size, t('dashboard.departments')], [courses.reduce((sum, c) => sum + c.credits, 0), t('dashboard.credits')], [books.length, t('dashboard.materials')]];
  root.innerHTML = renderPageLayout({ id: 'overview', title: t('dashboard.title'), subtitle: t('dashboard.subtitle'), content: `<div class="dashboard-stats">${counts.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>` + renderSplitPageLayout({ leftContent: renderMap(), rightContent: renderOverviewText(text) }) + `<section class="box"><h2 class="section-title">${t('dashboard.formats')}</h2><div class="format-grid">${['lecture','practice','lab'].map(type => `<a href="#/search?type=${type}"><span>${t('filters.' + type)}</span><strong>${courses.filter(c => c.type === type).length}</strong></a>`).join('')}</div></section>` });
  app.replaceChildren(root);
  document.title = t('dashboard.title') + ' · LMS';
  await bindMapEvents(root, signal);
}
