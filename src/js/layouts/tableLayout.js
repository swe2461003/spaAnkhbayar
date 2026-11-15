import { escapeHtml as e } from '../fn/format.js';
import { t } from '../i18n/i18n.js';
// Only column.render functions may return trusted component markup; raw data is escaped.
export function renderTable({ columns, rows, caption = '', id = '' }) {
  return `<div class="table-wrap"><table class="table is-fullwidth" ${id ? `id="${e(id)}"` : ''}><caption class="sr-only">${e(caption)}</caption><thead><tr>${columns.map(c => `<th scope="col">${e(c.label)}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map((r, i) => `<tr>${columns.map(c => `<td>${c.render ? c.render(r, i) : e(r[c.key] ?? '—')}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${columns.length}" class="empty-state">${t('empty')}</td></tr>`}</tbody></table></div>`;
}
