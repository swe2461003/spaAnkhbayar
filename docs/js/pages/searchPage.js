import { getCourses } from '../services/courseService.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderSidebarPageLayout } from '../layouts/sidebarPageLayout.js';
import { renderSearchCourseSidebar } from '../components/searchCourseSidebar.js';
import { renderCourseTables } from '../components/courseTables.js';
import { filterCourses } from '../fn/courseSearchEvents.js';
import { openImageModal } from '../components/imageModal.js';
import { getDepartment } from '../components/navbar.js';
import { t } from '../i18n/i18n.js';
import { downloadCsv } from '../fn/format.js';
import { button, listen } from '../components/ui.js';
export async function renderSearchPage({ root, params, signal }) {
  const data = await getCourses(); if (signal.aborted) return;
  const state = { query: params.get('q') || '', department: params.get('department') || getDepartment(), type: params.get('type') || 'all', sort: params.get('sort') || 'code' };
  let shown = [];
  root.innerHTML = renderPageLayout({ title: t('search'), subtitle: t('detailsHelp'), actions: button(t('download'), 'id="export-courses"', 'is-light'), content: renderSidebarPageLayout({ sidebar: renderSearchCourseSidebar(state), content: '<div class="panel-card flush"><div class="panel-heading"><h2 id="result-count"></h2></div><div id="results"></div></div>' }) });
  const update = () => {
    Object.assign(state, Object.fromEntries(new FormData(root.querySelector('form'))));
    const query = new URLSearchParams({ q: state.query, department: state.department, type: state.type, sort: state.sort });
    history.replaceState(null, '', '#/search?' + query);
    shown = filterCourses(data, state);
    root.querySelector('#results').innerHTML = renderCourseTables(shown);
    root.querySelector('#result-count').textContent = `${shown.length} ${t('recordCount')}`;
  };
  root.querySelector('form').oninput = update;
  root.querySelector('form').onsubmit = ev => ev.preventDefault();
  root.querySelector('form').onreset = ev => { ev.preventDefault(); const form = ev.currentTarget; form.elements.query.value = ''; form.elements.department.value = getDepartment(); form.elements.type.value = 'all'; form.elements.sort.value = 'code'; update(); };
  root.querySelector('#export-courses').onclick = () => downloadCsv('courses.csv', [['Code', 'Name MN', 'Name EN', 'Department', 'Credits'], ...shown.map(c => [c.id, c.name.mn, c.name.en, c.department, c.credits])]);
  listen(root, 'click', '[data-image]', async (_, el) => { await openImageModal(el.dataset.image, signal); });
  update();
}
