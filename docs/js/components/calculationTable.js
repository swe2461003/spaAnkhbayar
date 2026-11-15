import { renderTable } from '../layouts/tableLayout.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
export function renderCalculationTable(rows, courses, policy) {
  return renderTable({ caption: t('calculation'), rows, columns: [
    { label: t('course'), render: r => e(l(courses.find(c => c.id === r.id)?.name)) },
    ...policy.components.map(c => ({ label: `${t(c.key)} (${c.max}%)`, render: r => `<input class="input score-input" aria-label="${e(r.id)} ${t(c.key)}" type="number" min="0" max="100" step="0.01" required data-row="${e(r.id)}" data-score="${c.key}" value="${r[c.key]}">` })),
    { label: t('total'), render: r => `<strong data-total="${e(r.id)}">—</strong>` },
    { label: t('grade'), render: r => `<span data-grade="${e(r.id)}">—</span>` },
    { label: '', render: r => `<button class="button is-small is-light" type="button" data-remove="${e(r.id)}" aria-label="${t('remove')} ${e(r.id)}">×</button>` }
  ] });
}
