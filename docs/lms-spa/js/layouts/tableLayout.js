import { escapeHtml } from '../fn/format.js';
import { t } from '../i18n/i18n.js';
export function renderTable({ columns, rows }) {
  return `<div class="table-container"><table class="table is-fullwidth"><caption class="sr-only">${t('search.title')}</caption><thead><tr>${columns.map(c => `<th scope="col">${escapeHtml(c.label)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${columns.map(c => `<td>${c.render ? c.render(r) : escapeHtml(r[c.key])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
