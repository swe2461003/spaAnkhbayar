import { getStudents, getPlan } from '../services/courseService.js';
import { getCoursesByDepartment } from '../services/mapService.js';
import { getAttendance, attendanceSummary } from '../services/attendanceService.js';
import { getGrades } from '../services/journalService.js';
import { getGradeRequirements } from '../services/gradeRequirementService.js';
import { calculateGrade } from '../fn/gradeGetters.js';
import { loadTxt } from '../services/txtService.js';
import { renderOverviewText } from '../components/overviewText.js';
import { renderMap } from '../components/map.js';
import { getDepartment } from '../components/navbar.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderSplitPageLayout } from '../layouts/splitPageLayout.js';
import { t, getLocalizedValue as l, formatDate } from '../i18n/i18n.js';
import { panel, stats, badge } from '../components/ui.js';
import { escapeHtml as e, localDay } from '../fn/format.js';
export async function renderOverviewPage({ root, params, signal }) {
  const dep = getDepartment();
  const [courses, students, attendance, grades, plan, text, policy] = await Promise.all([getCoursesByDepartment(dep), getStudents(), getAttendance(), getGrades(), getPlan(), loadTxt(), getGradeRequirements()]);
  if (signal.aborted) return;
  const ids = new Set(courses.map(c => c.id));
  const summary = attendanceSummary(attendance.filter(a => ids.has(a.course)));
  const gradeRows = grades.filter(g => ids.has(g.course)).map(g => calculateGrade(g, policy));
  const avg = gradeRows.length ? gradeRows.reduce((s, g) => s + g.gpa, 0) / gradeRows.length : 0;
  const assignments = plan.assignments.filter(a => ids.has(a.course)); const done = assignments.filter(a => a.status === 'completed').length;
  const courseList = courses.map(c => `<a class="schedule-row" href="#/course?id=${e(c.id)}"><span class="course-symbol">${e(c.id.slice(0, 2))}</span><span class="schedule-time">${e(c.time)}<small>${t(['', 'mon', 'tue', 'wed', 'thu', 'fri'][c.day])}</small></span><span class="schedule-name"><strong>${e(l(c.name))}</strong><small>${e(c.room)} · ${e(c.group)} · ${t(c.department)}</small></span>${badge(t(c.type), c.type === 'lab' ? 'blue' : 'gray')}${badge(t('active'))}</a>`).join('');
  const notices = `<div id="notifications">${['notification1', 'notification2', 'notification3'].map((n, i) => `<a class="notification-row" href="#/${['attendance', 'books', 'plan'][i]}"><span class="notice-dot ${i === 1 ? 'blue' : ''}"></span><span><strong>${t(n)}</strong><small>${t('demoData')}</small></span></a>`).join('')}</div>`;
  const weekly = ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13'].map((d, i) => {
    const rate = attendanceSummary(attendance.filter(a => a.date === d && ids.has(a.course))).rate;
    return `<div><small>${rate === null ? '—' : rate.toFixed(0) + '%'}</small><div class="bar-track"><span style="height:${rate ?? 0}%"></span></div><small>${t(['mon', 'tue', 'wed', 'thu', 'fri'][i]).slice(0, 3)}</small></div>`;
  }).join('');
  root.innerHTML = renderPageLayout({ title: t('overview'), subtitle: `${formatDate(localDay())} · ${t('demoData')}`, content: renderOverviewText(text) + stats([[t('students'), students.filter(s => dep === 'all' || s.department === dep).length, 'users', t('demoData')], [t('attendanceRate'), summary.rate === null ? '—' : summary.rate.toFixed(1) + '%', 'user-check', '2026.11.09–13'], [t('assignments'), assignments.length, 'clipboard-list', `${done} ${t('completed')}`], [t('exams'), plan.exams.filter(x => ids.has(x.course)).length, 'calendar-days', '2026.12']]) + renderSplitPageLayout({ left: panel(t('schedule'), courseList, `<a href="#/search">${t('all')} →</a>`), right: panel(t('notifications'), notices) + panel(t('assignmentProgress'), `<div class="progress-head"><strong>${assignments.length ? Math.round(done / assignments.length * 100) : 0}%</strong><span class="muted">${done} / ${assignments.length}</span></div><progress class="progress is-primary" value="${done}" max="${assignments.length || 1}"></progress><div class="mini-stats"><span>${t('completed')} <b>${done}</b></span><span>${t('pending')} <b>${assignments.length - done}</b></span></div>`) }) + `<div class="bottom-grid">${panel(t('weeklyAttendance'), `<div class="chart-bars" role="img" aria-label="${t('weeklyAttendance')}: 2026.11.09–13">${weekly}</div>`)}${panel(t('average'), `<div class="grade-ring"><strong>${avg.toFixed(1)}</strong><small>GPA / 4.0</small></div>`)}${renderMap({ software: courses.filter(c => c.department === 'software').length, systems: courses.filter(c => c.department === 'systems').length })}</div>` });
  if (params.has('notifications')) root.querySelector('#notifications')?.scrollIntoView({ block: 'center' });
}
