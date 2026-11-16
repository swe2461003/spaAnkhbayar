import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
import { getScheme } from '../fn/gradeGetters.js';
import { renderTable } from '../layouts/tableLayout.js';
export function renderCalculationTable(rows, courses, policy, schemeId) {
  const weights = getScheme(policy, schemeId).weights;
  return renderTable({ rows, columns: [
    { label: t('search.name'), render: row => `<strong>${e(row.id)}</strong><p>${e(l(courses.find(c => c.id === row.id).name))}</p>` },
    ...Object.keys(weights).map(key => ({ label: `${t('grade.' + key)} (${weights[key]}%)`, render: row => `<input class="input grade-input" type="number" min="0" max="100" step="0.01" required data-course="${e(row.id)}" data-score="${key}" value="${e(row[key])}" aria-label="${e(row.id)} ${t('grade.' + key)}">` })),
    { label: t('grade.total'), render: row => `<strong data-total="${e(row.id)}">—</strong><small data-letter="${e(row.id)}"></small>` },
    { label: t('grade.remove'), render: row => `<button class="button is-light is-small" type="button" data-remove="${e(row.id)}" aria-label="${t('grade.remove')} ${e(row.id)}">×</button>` }
  ] });
}
