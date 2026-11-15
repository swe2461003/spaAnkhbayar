import { getCourses, getStudents } from '../services/courseService.js';
import { getAttendance, saveAttendance, attendanceSummary } from '../services/attendanceService.js';
import { canEdit, getSession } from '../services/authService.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderTable } from '../layouts/tableLayout.js';
import { renderAttendanceCalendar } from '../components/attendanceCalendar.js';
import { availableCourses, chooseCourse, courseSelector } from '../components/courseSelector.js';
import { field, input, select, button, panel, stats, toast, listen } from '../components/ui.js';
import { t } from '../i18n/i18n.js';
import { localDay, escapeHtml as e } from '../fn/format.js';
export async function renderAttendancePage({ root, params, signal }) {
  const [allCourses, students, initial] = await Promise.all([getCourses(), getStudents(), getAttendance()]); if (signal.aborted) return;
  const courses = availableCourses(allCourses); let course = chooseCourse(courses, params.get('course')); let records = initial; let date = localDay();
  const editor = canEdit(); const session = getSession();
  root.innerHTML = renderPageLayout({ title: t('attendance'), subtitle: t('attendanceHelp'), content: `<div class="toolbar panel-card">${courseSelector(courses, course.id)}${field(t('date'), input('date', date, 'date', 'id="attendance-date" required'))}${field(t('month'), input('month', date.slice(0, 7), 'month', 'id="calendar-month" required'))}</div><div id="attendance-stats"></div><div class="attendance-layout"><section class="panel-card" id="calendar"></section><section class="panel-card flush"><div class="panel-heading"><h2>${t('students')}</h2></div><form id="attendance-form"><div id="attendance-table"></div><div class="panel-actions">${editor ? button(t('save'), 'type="submit"') : `<p class="muted">${t('accessDenied')}</p>`}</div></form></section></div>` });
  function draw() {
    const relevant = records.filter(r => r.course === course.id && (session.role !== 'student' || r.student === session.studentId));
    const daily = relevant.filter(r => r.date === date); const sum = attendanceSummary(daily);
    root.querySelector('#attendance-stats').innerHTML = stats([[t('present'), sum.present, 'user-check'], [t('late'), sum.late, 'clock'], [t('absent'), sum.absent, 'user-xmark'], [t('attendanceRate'), sum.rate === null ? '—' : sum.rate.toFixed(1) + '%', 'chart-simple']]);
    root.querySelector('#calendar').innerHTML = renderAttendanceCalendar(root.querySelector('#calendar-month').value || date.slice(0, 7), date, relevant);
    const roster = students.filter(s => s.department === course.department && (session.role !== 'student' || s.id === session.studentId));
    root.querySelector('#attendance-table').innerHTML = renderTable({ caption: t('attendance'), rows: roster, columns: [{ label: t('studentId'), key: 'id' }, { label: t('name'), render: s => `<strong>${e(s.name)}</strong><small class="cell-sub">${e(s.group)} · ${t(s.department)}</small>` }, { label: t('status'), render: s => select(s.id, ['unmarked', 'present', 'late', 'absent'].map(v => [v, t(v)]), daily.find(r => r.student === s.id)?.status ?? 'unmarked', `aria-label="${e(s.name)} ${t('attendance')}" ${editor ? '' : 'disabled'}`) }] });
  }
  root.querySelector('#course-select').onchange = ev => { course = courses.find(c => c.id === ev.target.value); draw(); };
  root.querySelector('#attendance-date').onchange = ev => { if (ev.target.value) { date = ev.target.value; root.querySelector('#calendar-month').value = date.slice(0, 7); draw(); } };
  root.querySelector('#calendar-month').onchange = draw;
  listen(root, 'click', '[data-date]', (_, el) => { date = el.dataset.date; root.querySelector('#attendance-date').value = date; draw(); });
  root.querySelector('#attendance-form').onsubmit = async ev => {
    ev.preventDefault(); const data = [...new FormData(ev.currentTarget)].map(([student, status]) => ({ student, status }));
    try { await saveAttendance(course.id, date, data); records = await getAttendance(); if (!signal.aborted) { draw(); toast(); } } catch { toast(t('invalid')); }
  };
  draw();
}
