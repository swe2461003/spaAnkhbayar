import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderSidebarPageLayout } from '../layouts/sidebarPageLayout.js';
import { renderNotification } from '../layouts/notificationLayout.js';
import { getCourses } from '../services/courseService.js';
import { loadImages } from '../services/imageService.js';
import { renderSearchCourseName } from '../components/searchCourseNameSidebar.js';
import { renderCourseGroupList } from '../components/searchCourseGroupListSidebar.js';
import { renderSearchSettings } from '../components/searchSettingsSidebar.js';
import { renderCourseTables } from '../components/courseTables.js';
import { bindImageModalEvents } from '../components/imageModal.js';
import { filterCourses, readSearchState } from '../fn/courseSearchEvents.js';
import { bindSidebar } from '../fn/sidebarEvents.js';
import { t } from '../i18n/i18n.js';

// 2.6–2.9: page нь services, layouts, components-ийг нийлүүлнэ.
export async function renderSearchPage({ signal, params }) {
  const app = document.getElementById('app');
  document.title = t('search.title') + ' · LMS';
  app.innerHTML = renderPageLayout({ title: t('search.title'), content: renderNotification(t('filters.loading')) });
  const [courses] = await Promise.all([getCourses(), loadImages()]);
  if (signal.aborted) return;
  const columns = ['teacher','credits','room','updated'];
  const state = {
    query: params.get('q') || '',
    type: ['lecture','practice','lab'].includes(params.get('type')) ? params.get('type') : 'all',
    departments: params.getAll('department').filter(v => ['software','systems'].includes(v)),
    columns: params.has('columns') ? params.get('columns').split(',').filter(v => columns.includes(v)) : ['teacher','credits'],
    sort: params.get('sort') === 'name' ? 'name' : 'code'
  };
  const section = document.createElement('div');
  section.innerHTML = renderPageLayout({ id: 'search', title: t('search.title'), subtitle: t('search.subtitle'), content: `<button id="toggle-filters" class="button is-light mobile-filter-button" type="button" aria-controls="search-sidebar" aria-expanded="false">${t('filters.show')}</button>` + renderSidebarPageLayout({ sidebarContent: `<form id="course-filters"><h2 class="filter-heading">${t('filters.heading')}</h2>${renderSearchCourseName(state)}${renderCourseGroupList(state)}${renderSearchSettings(state)}</form>`, mainContent: `<div class="results-heading"><strong id="results-count" aria-live="polite"></strong><span>${t('filters.source')}</span></div><div id="course-results"></div>` }) });
  app.replaceChildren(section);
  const form = section.querySelector('form');
  const update = () => {
    const current = readSearchState(form);
    const shown = filterCourses(courses, current);
    section.querySelector('#course-results').innerHTML = renderCourseTables(shown, current.columns);
    section.querySelector('#results-count').textContent = `${shown.length} / ${courses.length} ${t('filters.results')}`;
    const query = new URLSearchParams({ q: current.query, type: current.type, sort: current.sort, columns: current.columns.join(',') });
    current.departments.forEach(value => query.append('department', value));
    history.replaceState(null, '', '#/search?' + query.toString());
  };
  form.oninput = update;
  form.onsubmit = ev => ev.preventDefault();
  form.onreset = ev => {
    ev.preventDefault(); form.elements.query.value = ''; form.elements.type.value = 'all'; form.elements.sort.value = 'code';
    form.querySelectorAll('[name="department"]').forEach(el => { el.checked = false; });
    form.querySelectorAll('[name="column"]').forEach(el => { el.checked = ['teacher','credits'].includes(el.value); });
    update();
  };
  bindSidebar(section); bindImageModalEvents(section); update();
}
