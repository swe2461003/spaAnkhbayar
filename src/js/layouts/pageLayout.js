import { escapeHtml as e } from '../fn/format.js';
export function renderPageLayout({ title = '', subtitle = '', actions = '', content = '' }) {
  return `<section class="page"><div class="page-heading"><div><h1>${e(title)}</h1><p class="muted">${e(subtitle)}</p></div><div class="actions">${actions}</div></div>${content}</section>`;
}
