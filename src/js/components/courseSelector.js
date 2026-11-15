import { select, field } from './ui.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { getDepartment } from './navbar.js';
export function availableCourses(courses) { const d = getDepartment(); return courses.filter(c => d === 'all' || c.department === d); }
export function chooseCourse(courses, id) { return courses.find(c => c.id === id) || courses[0]; }
export const courseSelector = (courses, value) => field(t('course'), select('course', courses.map(c => [c.id, `${c.id} · ${l(c.name)}`]), value, 'id="course-select"'));
