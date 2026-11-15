import { getCourses, getPlan } from '../services/courseService.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderTable } from '../layouts/tableLayout.js';
import { panel, badge } from '../components/ui.js';
import { availableCourses } from '../components/courseSelector.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
export async function renderPlanPage({ root, signal }) {
  const [allCourses, plan] = await Promise.all([getCourses(), getPlan()]); if (signal.aborted) return;
  const courses = availableCourses(allCourses);
  root.innerHTML = renderPageLayout({ title: t('plan'), subtitle: t('summaryLabel'), content: `<div class="week-grid">${['mon', 'tue', 'wed', 'thu', 'fri'].map((d, i) => `<section><h2>${t(d)}</h2>${courses.filter(c => c.day === i + 1).map(c => `<a class="week-course" href="#/course?id=${e(c.id)}"><small>${e(c.time)}</small><strong>${e(l(c.name))}</strong><span>${e(c.room)} · ${e(c.group)}</span>${badge(t(c.type), 'green')}</a>`).join('') || `<p class="muted p-3">—</p>`}</section>`).join('')}</div><div class="split-equal mt-5">${panel(t('examSchedule'), renderTable({ rows: plan.exams.filter(x => courses.some(c => c.id === x.course)), columns: [{ label: t('course'), key: 'course' }, { label: t('date'), key: 'date' }, { label: t('room'), key: 'room' }] }))}${panel(t('assignments'), renderTable({ rows: plan.assignments.filter(x => courses.some(c => c.id === x.course)), columns: [{ label: t('course'), key: 'course' }, { label: t('topic'), render: x => e(l(x.title)) }, { label: t('date'), key: 'due' }, { label: t('status'), render: x => badge(t(x.status), x.status === 'completed' ? 'green' : 'yellow') }] }))}</div>${panel(t('syllabus'), `<div class="syllabus-grid">${plan.topics.map(x => `<div class="syllabus-item"><span class="week-number">${x.week}</span><div><strong>${e(x.title)}</strong><small>${t(x.status)}</small></div>${badge(x.status === 'completed' ? '✓' : x.status === 'active' ? '●' : '○', x.status === 'completed' ? 'green' : 'gray')}</div>`).join('')}</div>`)}` });
}
