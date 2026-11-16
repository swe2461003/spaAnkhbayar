import { t } from '../i18n/i18n.js';
export function renderCourseGroupList(state) {
  return `<fieldset class="filter-group"><legend>${t('filters.department')}</legend>${['software','systems'].map(v => `<label class="checkbox"><input type="checkbox" name="department" value="${v}" ${state.departments.includes(v) ? 'checked' : ''}> ${t('filters.' + v)}</label>`).join('')}</fieldset>`;
}
