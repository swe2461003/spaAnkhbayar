import { getLogs } from '../services/logService.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderTable } from '../layouts/tableLayout.js';
import { t } from '../i18n/i18n.js';
import { input, field, select, button, badge } from '../components/ui.js';
import { downloadCsv, escapeHtml as e } from '../fn/format.js';
export async function renderLogsPage({ root, signal }) {
  const logs = await getLogs(); if (signal.aborted) return;
  let page = 0; const size = 8; let filtered = [];
  root.innerHTML = renderPageLayout({ title: t('logs'), subtitle: t('logHelp'), actions: button(t('download'), 'id="export-logs"', 'is-light'), content: `<div class="toolbar panel-card">${field(t('searchLabel'), input('q', '', 'search', 'id="log-search"'))}${field(t('type'), select('action', ['all', 'login', 'create', 'update', 'submit'].map(v => [v, t(v)]), 'all', 'id="log-action"'))}</div><section class="panel-card flush"><div id="log-table"></div><div class="pagination-bar"><span id="log-count" class="muted"></span><div class="buttons"><button id="prev" class="button is-small">${t('previous')}</button><span id="page-number"></span><button id="next" class="button is-small">${t('next')}</button></div></div></section>` });
  const draw = () => {
    const q = root.querySelector('#log-search').value.toLowerCase(); const action = root.querySelector('#log-action').value;
    filtered = logs.filter(r => (action === 'all' || r.action === action) && `${r.user} ${r.details} ${r.action}`.toLowerCase().includes(q));
    const pages = Math.max(1, Math.ceil(filtered.length / size)); page = Math.min(page, pages - 1);
    root.querySelector('#log-table').innerHTML = renderTable({ rows: filtered.slice(page * size, page * size + size), columns: [{ label: 'ID', render: r => `<small class="mono">${e(r.id.slice(0, 8))}</small>` }, { label: t('user'), render: r => `<strong>${e(r.user)}</strong>` }, { label: t('role'), render: r => badge(t(r.role), 'gray') }, { label: t('action'), render: r => badge(t(r.action), 'green') }, { label: t('details'), key: 'details' }, { label: t('date'), render: r => e(new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ulaanbaatar' }).format(new Date(r.date))) }] });
    root.querySelector('#log-count').textContent = `${filtered.length} ${t('recordCount')}`; root.querySelector('#page-number').textContent = `${page + 1} / ${pages}`;
    root.querySelector('#prev').disabled = page === 0; root.querySelector('#next').disabled = page >= pages - 1;
  };
  ['#log-search', '#log-action'].forEach(s => root.querySelector(s).oninput = () => { page = 0; draw(); });
  root.querySelector('#prev').onclick = () => { page--; draw(); }; root.querySelector('#next').onclick = () => { page++; draw(); };
  root.querySelector('#export-logs').onclick = () => downloadCsv('logs.csv', [['ID', 'User', 'Role', 'Action', 'Details', 'Date'], ...filtered.map(r => [r.id, r.user, r.role, r.action, r.details, r.date])]);
  draw();
}
