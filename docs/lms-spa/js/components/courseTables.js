import { t, getLocalizedValue as l, formatDate } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
import { renderTable } from '../layouts/tableLayout.js';
import { renderNotification } from '../layouts/notificationLayout.js';
import { getImagesByCourseCode } from '../services/imageService.js';
export function renderCourseTables(items, selectedColumns) {
  if (!items.length) return renderNotification(t('filters.empty'));
  const columns = [
    { label: t('search.code'), key: 'id' },
    { label: t('search.name'), render: c => `<strong>${e(l(c.name))}</strong><p class="course-description">${e(l(c.description))}</p><small>${t('filters.' + c.department)}</small>` },
    { label: t('search.type'), render: c => `<span class="tag is-success is-light">${t('filters.' + c.type)}</span>` },
    ...selectedColumns.map(key => ({ label: t('filters.' + key), render: c => e(key === 'updated' ? formatDate(c.updated) : c[key]) })),
    { label: t('filters.image'), render: c => getImagesByCourseCode(c.id).length ? `<button class="course-image" data-course-image="${e(c.id)}" aria-label="${t('filters.image')} ${e(l(c.name))}"><img src="${e(getImagesByCourseCode(c.id)[0])}" alt="${e(l(c.name))}"><span>${t('filters.view')} (${getImagesByCourseCode(c.id).length})</span></button>` : '—' }
  ];
  return renderTable({ columns, rows: items });
}
