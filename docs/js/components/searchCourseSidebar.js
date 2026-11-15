import { t } from '../i18n/i18n.js';
import { field, input, select, button } from './ui.js';
export function renderSearchCourseSidebar(state) {
  return `<form id="filters"><h2>${t('searchLabel')}</h2>${field(t('searchLabel'), input('query', state.query, 'search', `placeholder="${t('searchHint')}"`))}${field(t('department'), select('department', ['all', 'software', 'systems'].map(v => [v, t(v)]), state.department))}${field(t('type'), select('type', ['all', 'lecture', 'practice', 'lab'].map(v => [v, t(v)]), state.type))}${field(t('sort'), select('sort', [['code', t('code')], ['name', t('name')]], state.sort))}${button(t('clear'), 'type="reset"', 'is-light')}</form>`;
}
