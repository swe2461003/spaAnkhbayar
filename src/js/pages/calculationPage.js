import { getCourses } from '../services/courseService.js';
import { getGradeRequirements } from '../services/gradeRequirementService.js';
import { calculateGrade, weightedGpa } from '../fn/gradeGetters.js';
import { renderCalculationTable } from '../components/calculationTable.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderSidebarPageLayout } from '../layouts/sidebarPageLayout.js';
import { readStore, writeStore } from '../services/dataService.js';
import { button, field, select, panel, listen, toast } from '../components/ui.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
export async function renderCalculationPage({ root, signal }) {
  const [courses, policy] = await Promise.all([getCourses(), getGradeRequirements()]); if (signal.aborted) return;
  let rows = readStore('calculator', [{ id: 'CON354', midterm: 80, labs: 90, homework: 85, final: 80 }]);
  rows = rows.filter(r => courses.some(c => c.id === r.id));
  root.innerHTML = renderPageLayout({ title: t('calculation'), subtitle: t('calculationHelp'), content: renderSidebarPageLayout({ sidebar: `<form id="add-course">${field(t('course'), select('course', courses.map(c => [c.id, `${c.id} · ${l(c.name)}`])))}${button(t('addCourse'), 'type="submit"')}<hr><h2>${t('assessment')}</h2>${policy.components.map(c => `<p>${t(c.key)} <strong>${c.max}%</strong></p>`).join('')}<p class="muted mt-4">${t('summaryLabel')}</p></form>`, content: panel(t('calculation'), `<form id="calculator"><div id="calc-table"></div><div class="calculation-summary"><span>${t('gpa')} <strong id="gpa">—</strong></span><span>${t('credits')} <strong id="credits">0</strong></span>${button(t('save'), 'type="submit"')}</div></form>`) }) });
  const render = () => { root.querySelector('#calc-table').innerHTML = renderCalculationTable(rows, courses, policy); update(); };
  function update() {
    const results = []; let valid = true;
    for (const row of rows) {
      try {
        const result = calculateGrade(row, policy, true); results.push({ ...result, credits: courses.find(c => c.id === row.id).credits });
        root.querySelector(`[data-total="${row.id}"]`).textContent = result.total.toFixed(2);
        root.querySelector(`[data-grade="${row.id}"]`).textContent = `${result.letter} (${result.gpa.toFixed(1)})`;
      } catch { valid = false; root.querySelector(`[data-total="${row.id}"]`).textContent = '—'; root.querySelector(`[data-grade="${row.id}"]`).textContent = t('invalid'); }
    }
    root.querySelector('#gpa').textContent = valid ? weightedGpa(results).toFixed(2) : '—';
    root.querySelector('#credits').textContent = results.reduce((s, r) => s + r.credits, 0);
  }
  root.querySelector('#add-course').onsubmit = ev => { ev.preventDefault(); const id = new FormData(ev.currentTarget).get('course'); if (!rows.some(r => r.id === id)) { rows.push({ id, midterm: 0, labs: 0, homework: 0, final: 0 }); render(); } };
  listen(root, 'input', '[data-score]', (_, el) => { rows.find(r => r.id === el.dataset.row)[el.dataset.score] = el.value; update(); });
  listen(root, 'click', '[data-remove]', (_, el) => { rows = rows.filter(r => r.id !== el.dataset.remove); render(); });
  root.querySelector('#calculator').onsubmit = ev => { ev.preventDefault(); try { rows.forEach(r => calculateGrade(r, policy, true)); writeStore('calculator', rows); toast(); } catch { toast(t('invalid')); } };
  render();
}
