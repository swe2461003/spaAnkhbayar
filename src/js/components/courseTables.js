import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { renderTable } from '../layouts/tableLayout.js';
import { escapeHtml as e } from '../fn/format.js';
import { badge } from './ui.js';
export function renderCourseTables(items) {
  return renderTable({ caption: t('search'), rows: items, columns: [
    { label: t('code'), render: c => `<strong class="course-code">${e(c.id)}</strong>` },
    { label: t('course'), render: c => `<a class="course-link" href="#/course?id=${encodeURIComponent(c.id)}">${e(l(c.name))}</a><small class="cell-sub">${e(c.group)} · ${t(c.department)}</small>` },
    { label: t('type'), render: c => badge(t(c.type), c.type === 'lab' ? 'blue' : 'gray') },
    { label: t('teacherLabel'), key: 'teacher' }, { label: t('credits'), key: 'credits' },
    { label: t('images'), render: c => `<button class="image-trigger" data-image="${e(c.id)}" aria-label="${t('images')}: ${e(l(c.name))}"><img src="./img/courses/${e(c.id)}.svg" alt="" width="52" height="36"></button>` }
  ] });
}
