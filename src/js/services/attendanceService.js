import { collection, writeStore } from './dataService.js';
import { requireEditor } from './authService.js';
import { getCourse, getStudents } from './courseService.js';
import { logAction } from './logService.js';
import { isIsoDay } from '../fn/format.js';
export const getAttendance = () => collection('attendance');
export async function saveAttendance(course, date, records) {
  requireEditor();
  const c = await getCourse(course); const students = await getStudents();
  if (!c || !isIsoDay(date)) throw Error('Invalid date/course');
  for (const r of records) {
    if (!['present', 'absent', 'late', 'unmarked'].includes(r.status) || !students.some(s => s.id === r.student && s.department === c.department)) throw Error('Invalid record');
  }
  const all = (await getAttendance()).filter(r => !(r.course === course && r.date === date && records.some(x => x.student === r.student)));
  all.push(...records.filter(r => r.status !== 'unmarked').map(r => ({ ...r, course, date })));
  writeStore('attendance', all);
  await logAction('update', `${course} · ${date} · Attendance (${records.length})`);
}
export function attendanceSummary(records) {
  const counts = { present: 0, late: 0, absent: 0 };
  records.forEach(r => { if (r.status in counts) counts[r.status]++; });
  const total = counts.present + counts.late + counts.absent;
  return { ...counts, total, rate: total ? ((counts.present + counts.late) / total) * 100 : null };
}
