import { escapeHtml as e } from '../fn/format.js';
import { t } from '../i18n/i18n.js';
export function renderSearchCourseName(state) {
  return `<label class="label" for="course-query">${t('filters.query')}</label><input class="input" id="course-query" name="query" type="search" value="${e(state.query)}" placeholder="${t('filters.placeholder')}"><div class="field mt-4"><label class="label" for="course-type">${t('filters.type')}</label><div class="select is-fullwidth"><select id="course-type" name="type">${['all','lecture','practice','lab'].map(v => `<option value="${v}" ${v === state.type ? 'selected' : ''}>${t('filters.' + v)}</option>`).join('')}</select></div></div>`;
}
