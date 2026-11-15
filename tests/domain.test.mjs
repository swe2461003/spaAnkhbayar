import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calculateGrade, weightedGpa } from '../src/js/fn/gradeGetters.js';
import { filterCourses } from '../src/js/fn/courseSearchEvents.js';
import { escapeHtml, isIsoDay } from '../src/js/fn/format.js';
import { attendanceSummary } from '../src/js/services/attendanceService.js';
import { convertCourses } from '../src/tools/convertCoursesEnMn.js';
const policy = JSON.parse(await readFile(new URL('../src/data/gradeRequirements.json', import.meta.url)));
const courses = JSON.parse(await readFile(new URL('../src/data/courses.json', import.meta.url)));
test('weighted percentages use the component weights', () => {
  assert.equal(calculateGrade({ midterm: 80, labs: 90, homework: 85, final: 80 }, policy, true).total, 84);
  assert.equal(calculateGrade({ midterm: 20, labs: 30, homework: 20, final: 30 }, policy).total, 100);
});
test('grade band boundaries and zero work', () => {
  for (const [n, letter] of [[0, 'F'], [59.99, 'F'], [60, 'D'], [70, 'C'], [80, 'B'], [90, 'A'], [100, 'A']]) assert.equal(calculateGrade({ midterm: n, labs: n, homework: n, final: n }, policy, true).letter, letter);
});
test('invalid score inputs are rejected', () => {
  for (const n of ['', -1, 101, NaN, Infinity]) assert.throws(() => calculateGrade({ midterm: n, labs: 90, homework: 80, final: 70 }, policy, true));
});
test('credit-weighted GPA handles empty selections', () => {
  assert.equal(weightedGpa([]), 0); assert.equal(weightedGpa([{ gpa: 4, credits: 3 }, { gpa: 2, credits: 1 }]), 3.5);
});
test('search combines bilingual name, department and type filters', () => {
  assert.equal(filterCourses(courses, { query: 'CON354', type: 'lab', department: 'software' }).length, 1);
  assert.equal(filterCourses(courses, { query: 'construction' }).length, 1);
  assert.equal(filterCourses(courses, { query: 'хангамжийн' }).length, 1);
  assert.equal(filterCourses(courses, { department: 'systems' }).length, 3);
  assert.equal(filterCourses(courses, { query: 'no-match' }).length, 0);
});
test('attendance rates include late and never divide by zero', () => {
  assert.equal(attendanceSummary([]).rate, null);
  assert.equal(attendanceSummary([{ status: 'present' }, { status: 'late' }, { status: 'absent' }, { status: 'present' }]).rate, 75);
});
test('untrusted text is escaped', () => assert.equal(escapeHtml('<img src=x onerror="1">'), '&lt;img src=x onerror=&quot;1&quot;&gt;'));
test('ISO dates reject impossible days and accept leap years', () => {
  assert.equal(isIsoDay('2026-02-31'), false); assert.equal(isIsoDay('2026-02-29'), false);
  assert.equal(isIsoDay('2028-02-29'), true); assert.equal(isIsoDay('2026-11-15'), true);
});
test('translation migration refuses missing translations', () => {
  assert.throws(() => convertCourses([{ id: 'X', name: 'Course' }], {}));
  assert.deepEqual(convertCourses([{ id: 'X', name: 'Course' }], { X: { mn: 'Хичээл', en: 'Course' } })[0].name, { mn: 'Хичээл', en: 'Course' });
});
