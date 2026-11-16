import { openDialog } from './modal.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
export function openDepartmentInfo(department, courses) {
  const dialog = openDialog(t('filters.' + department), `<p class="muted mb-4">${t('dashboard.chooseCourses')}</p><form id="department-courses">${courses.map(c => `<label class="department-course"><input type="checkbox" name="course" value="${e(c.id)}" checked><span><strong>${e(c.id)} · ${e(l(c.name))}</strong><small>${e(c.teacher)} · ${e(c.credits)} ${t('filters.credits')}</small></span></label>`).join('')}<p id="department-error" role="status"></p><button class="button is-primary mt-4" type="submit">${t('dashboard.viewSelection')}</button></form>`);
  dialog.querySelector('form').onsubmit = event => {
    event.preventDefault();
    const ids = new FormData(event.currentTarget).getAll('course');
    if (!ids.length) { dialog.querySelector('#department-error').textContent = t('dashboard.selectOne'); return; }
    dialog.close();
    location.hash = '/search?' + new URLSearchParams({ ids: ids.join(',') });
  };
}
