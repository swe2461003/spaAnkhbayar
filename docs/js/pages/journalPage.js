import { getCourses, getStudents } from '../services/courseService.js';
import { getGrades, getLessons, saveGrades, addLesson } from '../services/journalService.js';
import { getGradeRequirements } from '../services/gradeRequirementService.js';
import { calculateGrade } from '../fn/gradeGetters.js';
import { canEdit, getSession } from '../services/authService.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderTable } from '../layouts/tableLayout.js';
import { availableCourses, chooseCourse, courseSelector } from '../components/courseSelector.js';
import { button, field, input, panel, toast, listen, badge } from '../components/ui.js';
import { t } from '../i18n/i18n.js';
import { escapeHtml as e, localDay } from '../fn/format.js';
export async function renderJournalPage({ root, params, signal }) {
  const [allCourses, students, policy, initialGrades, initialLessons] = await Promise.all([getCourses(), getStudents(), getGradeRequirements(), getGrades(), getLessons()]); if (signal.aborted) return;
  const courses = availableCourses(allCourses); let course = chooseCourse(courses, params.get('course')); let grades = initialGrades; let lessons = initialLessons;
  const editor = canEdit(); const session = getSession();
  root.innerHTML = renderPageLayout({ title: t('journal'), subtitle: t('gradeHelp'), content: `<div class="toolbar panel-card">${courseSelector(courses, course.id)}</div><section class="panel-card flush"><form id="grades-form"><div id="grades-table"></div><div class="panel-actions">${editor ? button(t('save'), 'type="submit"') : `<p class="muted">${t('accessDenied')}</p>`}</div></form></section><div class="mt-5" id="lessons"></div>${editor ? panel(t('lessonLog'), `<form id="lesson-form" class="lesson-form">${field(t('date'), input('date', localDay(), 'date', 'required'))}${field(t('topic'), input('topic', '', 'text', 'required maxlength="160"'))}${field(t('notes'), '<textarea class="textarea" name="notes" maxlength="2000"></textarea>')}${button(t('add'), 'type="submit"')}</form>`) : ''}` });
  function draw() {
    const roster = students.filter(s => s.department === course.department && (session.role !== 'student' || s.id === session.studentId));
    root.querySelector('#grades-table').innerHTML = renderTable({ caption: t('journal'), rows: roster, columns: [{ label: t('studentId'), key: 'id' }, { label: t('name'), render: s => `<strong>${e(s.name)}</strong><small class="cell-sub">${e(s.group)} · ${t(s.department)}</small>` }, ...policy.components.map(c => ({ label: `${t(c.key)} / ${c.max}`, render: s => `<input class="input score-input" data-student="${e(s.id)}" data-component="${c.key}" type="number" min="0" max="${c.max}" step="0.01" required aria-label="${e(s.id)} ${t(c.key)}" value="${grades.find(g => g.course === course.id && g.student === s.id)?.[c.key] ?? 0}" ${editor ? '' : 'disabled'}>` })), { label: t('total'), render: s => `<strong data-result="${e(s.id)}">—</strong>` }] });
    root.querySelector('#lessons').innerHTML = panel(t('lessonLog'), renderTable({ rows: lessons.filter(r => r.course === course.id), columns: [{ label: t('date'), key: 'date' }, { label: t('topic'), key: 'topic' }, { label: t('notes'), key: 'notes' }] }));
    updateTotals();
  }
  function collect() {
    const rows = new Map();
    root.querySelectorAll('[data-component]').forEach(el => { if (!rows.has(el.dataset.student)) rows.set(el.dataset.student, { student: el.dataset.student }); rows.get(el.dataset.student)[el.dataset.component] = el.value; });
    return [...rows.values()];
  }
  function updateTotals() { for (const r of collect()) { const el = root.querySelector(`[data-result="${r.student}"]`); try { const result = calculateGrade(r, policy); el.innerHTML = `${result.total} ${badge(result.letter, result.total >= 60 ? 'green' : 'red')}`; } catch { el.textContent = t('invalid'); } } }
  root.querySelector('#course-select').onchange = ev => { course = courses.find(c => c.id === ev.target.value); draw(); };
  listen(root, 'input', '[data-component]', updateTotals);
  root.querySelector('#grades-form').onsubmit = async ev => { ev.preventDefault(); try { await saveGrades(course.id, collect()); grades = await getGrades(); toast(); } catch { toast(t('invalid')); } };
  if (editor) root.querySelector('#lesson-form').onsubmit = async ev => { ev.preventDefault(); const form = ev.currentTarget; try { await addLesson({ ...Object.fromEntries(new FormData(form)), course: course.id }); lessons = await getLessons(); if (!signal.aborted) { draw(); form.reset(); toast(); } } catch { toast(t('invalid')); } };
  draw();
}
