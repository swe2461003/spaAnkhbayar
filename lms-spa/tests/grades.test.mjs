import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calculateGrade, weightedGpa, getScheme } from '../src/js/fn/gradeGetters.js';
const policy = JSON.parse(await readFile(new URL('../src/data/gradeRequirements.json', import.meta.url), 'utf8'));
test('standard and project weights produce expected totals', () => {
  const values = { midterm: 80, labs: 90, homework: 85, final: 80 };
  assert.equal(calculateGrade(values, policy).total, 84);
  assert.equal(calculateGrade(values, policy, 'project').total, 85.5);
});
test('grade boundaries include zero and full marks', () => {
  for (const [score, letter] of [[0,'F'],[59.99,'F'],[60,'D'],[70,'C'],[80,'B'],[90,'A'],[100,'A']]) {
    assert.equal(calculateGrade({ midterm: score, labs: score, homework: score, final: score }, policy).letter, letter);
  }
});
test('blank nonnumeric negative and excessive scores are rejected', () => {
  for (const midterm of ['',null,NaN,Infinity,-1,101]) assert.throws(() => calculateGrade({ midterm, labs: 0, homework: 0, final: 0 }, policy));
});
test('GPA is weighted by credits and empty selection returns zero', () => {
  assert.equal(weightedGpa([{ gpa: 4, credits: 3 }, { gpa: 2, credits: 1 }]), 3.5);
  assert.equal(weightedGpa([]), 0);
});
test('unknown scheme is rejected and weights sum to 100', () => {
  assert.throws(() => getScheme(policy, 'missing'));
  for (const scheme of policy.schemes) assert.equal(Object.values(getScheme(policy, scheme.id).weights).reduce((a,b) => a+b, 0), 100);
});
