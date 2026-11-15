import { collection, writeStore } from './dataService.js';
import { requireEditor } from './authService.js';
import { getCourse, getStudents } from './courseService.js';
import { getGradeRequirements } from './gradeRequirementService.js';
import { calculateGrade } from '../fn/gradeGetters.js';
import { logAction } from './logService.js';
import { isIsoDay } from '../fn/format.js';
export const getGrades = () => collection('grades');
export const getLessons = () => collection('lessons');
export async function saveGrades(course, rows) {
  requireEditor();
  const c = await getCourse(course); const policy = await getGradeRequirements(); const students = await getStudents();
  if (!c) throw Error('Invalid course');
  rows.forEach(r => { calculateGrade(r, policy); if (!students.some(s => s.id === r.student && s.department === c.department)) throw Error('Invalid student'); });
  const all = (await getGrades()).filter(r => !(r.course === course && rows.some(x => x.student === r.student)));
  all.push(...rows.map(r => ({ ...r, course }))); writeStore('grades', all);
  await logAction('update', `${course} · Grades (${rows.length})`);
}
export async function addLesson(lesson) {
  requireEditor();
  if (!lesson.topic.trim() || lesson.topic.length > 160 || lesson.notes.length > 2000 || !await getCourse(lesson.course) || !isIsoDay(lesson.date)) throw Error('Invalid lesson');
  const all = await getLessons(); all.unshift({ ...lesson, id: crypto.randomUUID() }); writeStore('lessons', all);
  await logAction('create', `${lesson.course} · ${lesson.topic}`);
}
