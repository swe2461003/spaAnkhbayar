import { getArchive } from '../services/archiveService.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderTable } from '../layouts/tableLayout.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { field, input, select, button, badge, stats, listen } from '../components/ui.js';
import { getDepartment } from '../components/navbar.js';
import { escapeHtml as e, downloadCsv } from '../fn/format.js';
export async function renderArchivePage({ root, signal }) {
  const data = await getArchive(); if (signal.aborted) return;
  let type = 'courses'; let shown = [];
  root.innerHTML = renderPageLayout({ title: t('archive'), subtitle: t('archiveHelp'), actions: button(t('download'), 'id="archive-export"', 'is-light'), content: `<div class="archive-tabs" role="tablist">${[['courses', 'search'], ['attendance', 'attendance'], ['journal', 'journal'], ['exams', 'exams']].map(([v, label]) => `<button role="tab" data-tab="${v}">${t(label)}</button>`).join('')}</div><div class="toolbar panel-card">${field(t('semester'), select('semester', [['all', t('all')], ...[...new Set(data.map(r => r.semester))].map(v => [v, v])], 'all', 'id="archive-semester"'))}${field(t('department'), select('department', ['all', 'software', 'systems'].map(v => [v, t(v)]), getDepartment(), 'id="archive-department"'))}${field(t('searchLabel'), input('q', '', 'search', 'id="archive-search"'))}</div><div id="archive-stats"></div><section class="panel-card flush" id="archive-table"></section>` });
  const draw = () => {
    const semester = root.querySelector('#archive-semester').value; const dep = root.querySelector('#archive-department').value; const q = root.querySelector('#archive-search').value.toLowerCase();
    shown = data.filter(r => r.type === type && (semester === 'all' || semester === r.semester) && (dep === 'all' || dep === r.department) && `${r.course} ${l(r.name)}`.toLowerCase().includes(q));
    root.querySelectorAll('[data-tab]').forEach(el => { el.classList.toggle('active', el.dataset.tab === type); el.setAttribute('aria-selected', String(el.dataset.tab === type)); });
    const average = shown.length ? shown.reduce((s, r) => s + r.passRate, 0) / shown.length : null;
    root.querySelector('#archive-stats').innerHTML = stats([[t('recordCount'), shown.length, 'box-archive'], [t('passRate'), average === null ? '—' : average.toFixed(1) + '%', 'chart-simple']]);
    root.querySelector('#archive-table').innerHTML = renderTable({ rows: shown, columns: [{ label: t('semester'), key: 'semester' }, { label: t('code'), key: 'course' }, { label: t('course'), render: r => e(l(r.name)) }, { label: t('department'), render: r => e(t(r.department)) }, { label: type === 'journal' ? t('average') : t('total'), render: r => e(type === 'journal' ? r.average : r.count) }, { label: t('status'), render: r => badge(t(r.status), 'gray') }] });
  };
  listen(root, 'click', '[data-tab]', (_, el) => { type = el.dataset.tab; draw(); });
  root.querySelectorAll('.toolbar input, .toolbar select').forEach(el => el.oninput = draw);
  root.querySelector('#archive-export').onclick = () => downloadCsv(`archive-${type}.csv`, [['Semester', 'Type', 'Code', 'Name', 'Department', 'Count', 'Average'], ...shown.map(r => [r.semester, r.type, r.course, l(r.name), r.department, r.count, r.average])]);
  draw();
}
