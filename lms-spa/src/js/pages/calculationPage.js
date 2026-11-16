import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderSidebarPageLayout } from '../layouts/sidebarPageLayout.js';
import { getCourses } from '../services/courseService.js';
import { getGradeRequirements } from '../services/gradeRequirementService.js';
import { renderCalculationInfo } from '../components/calculationInfo.js';
import { renderCalculationTable } from '../components/calculationTable.js';
import { calculateGrade, weightedGpa } from '../fn/gradeGetters.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
const KEY = 'lms-spa.calculation.v1';
export async function renderCalculationPage({ signal }) {
  const [courses, policy] = await Promise.all([getCourses(), getGradeRequirements()]);
  if (signal.aborted) return;
  const keys = ['midterm','labs','homework','final'];
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch { /* Start with an empty calculator. */ }
  let schemeId = policy.schemes.some(s => s.id === saved?.schemeId) ? saved.schemeId : 'standard';
  let rows = Array.isArray(saved?.rows) ? saved.rows.filter((row, i, all) => courses.some(c => c.id === row.id) && all.findIndex(r => r.id === row.id) === i && keys.every(key => typeof row[key] === 'number' && Number.isFinite(row[key]) && row[key] >= 0 && row[key] <= 100)).map(row => Object.fromEntries(['id', ...keys].map(key => [key, row[key]]))) : [];
  const root = document.createElement('div');
  root.className = 'calculator-page';
  root.innerHTML = renderPageLayout({ id: 'calculation', title: t('grade.title'), subtitle: t('grade.subtitle'), content: renderSidebarPageLayout({ sidebarContent: `<h2 class="filter-heading">${t('grade.selectCourses')}</h2><div id="calculator-courses">${courses.map(c => `<label class="calc-course"><input type="checkbox" data-select-course="${e(c.id)}" ${rows.some(r => r.id === c.id) ? 'checked' : ''}><span><strong>${e(c.id)}</strong><small>${e(l(c.name))}</small></span></label>`).join('')}</div><hr><label class="label" for="grade-scheme">${t('grade.scheme')}</label><div class="select is-fullwidth"><select id="grade-scheme">${policy.schemes.map(s => `<option value="${e(s.id)}" ${schemeId === s.id ? 'selected' : ''}>${e(l(s.name))}</option>`).join('')}</select></div><p class="scope-note">${t('grade.policyNote')}</p>`, mainContent: `<form id="calculator-form"><div id="calculation-result"></div><div id="grade-summary" class="box grade-summary" aria-live="polite"></div><button class="button is-primary" type="submit">${t('grade.save')}</button><p id="calculator-status" class="scope-note" role="status"></p></form>` }) });
  document.getElementById('app').replaceChildren(root);
  document.title = t('grade.title') + ' · LMS';
  const save = (notify = false) => {
    try {
      rows.forEach(row => calculateGrade(row, policy, schemeId));
      const numericRows = rows.map(row => ({ id: row.id, ...Object.fromEntries(keys.map(key => [key, Number(row[key])])) }));
      localStorage.setItem(KEY, JSON.stringify({ schemeId, rows: numericRows }));
      if (notify) root.querySelector('#calculator-status').textContent = t('grade.saved');
    } catch { if (notify) root.querySelector('#calculator-status').textContent = t('grade.saveError'); }
  };
  function update() {
    const results = []; let valid = true;
    for (const row of rows) {
      const total = root.querySelector(`[data-total="${row.id}"]`);
      const letter = root.querySelector(`[data-letter="${row.id}"]`);
      try {
        const result = calculateGrade(row, policy, schemeId);
        results.push({ ...result, credits: courses.find(c => c.id === row.id).credits });
        total.textContent = result.total.toFixed(2);
        letter.textContent = `${result.letter} · ${result.gpa.toFixed(1)}`;
        letter.className = result.passed ? 'grade-pass' : 'grade-fail';
      } catch { valid = false; total.textContent = '—'; letter.textContent = t('grade.invalid'); letter.className = 'grade-fail'; }
    }
    root.querySelector('#grade-summary').innerHTML = `<div><span>${t('grade.gpa')}</span><strong id="gpa">${valid ? weightedGpa(results).toFixed(2) : '—'}</strong></div><div><span>${t('filters.credits')}</span><strong id="total-credits">${rows.reduce((sum, row) => sum + courses.find(c => c.id === row.id).credits, 0)}</strong></div><div><span>${t('grade.passed')}</span><strong>${results.filter(r => r.passed).length} / ${rows.length}</strong></div>`;
    root.querySelector('#calculator-status').textContent = valid ? t('grade.localNotice') : t('grade.invalid');
    if (valid) save();
  }
  function draw() {
    root.querySelector('#calculation-result').innerHTML = rows.length ? renderCalculationTable(rows, courses, policy, schemeId) : renderCalculationInfo();
    root.querySelectorAll('[data-select-course]').forEach(el => { el.checked = rows.some(r => r.id === el.dataset.selectCourse); });
    update();
  }
  root.addEventListener('change', event => {
    const select = event.target.closest('[data-select-course]');
    if (select) {
      if (select.checked) rows.push({ id: select.dataset.selectCourse, midterm: 0, labs: 0, homework: 0, final: 0 });
      else rows = rows.filter(row => row.id !== select.dataset.selectCourse);
      draw();
    }
  });
  root.querySelector('#grade-scheme').onchange = event => { schemeId = event.target.value; draw(); };
  root.addEventListener('input', event => {
    const input = event.target.closest('[data-score]');
    if (input) { rows.find(row => row.id === input.dataset.course)[input.dataset.score] = input.value; update(); }
  });
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-remove]');
    if (button) { rows = rows.filter(row => row.id !== button.dataset.remove); draw(); }
  });
  root.querySelector('form').onsubmit = event => { event.preventDefault(); save(true); };
  draw();
}
