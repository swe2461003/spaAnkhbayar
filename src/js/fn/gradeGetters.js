export function gradeFor(total, bands) { return bands.find(b => total >= b.min) ?? { letter: 'F', gpa: 0 }; }
export function calculateGrade(scores, policy, percentages = false) {
  let total = 0;
  for (const c of policy.components) {
    const value = Number(scores[c.key]);
    const max = percentages ? 100 : c.max;
    if (scores[c.key] === '' || scores[c.key] == null || !Number.isFinite(value) || value < 0 || value > max) throw Error(`Invalid ${c.key}`);
    total += percentages ? value * c.max / 100 : value;
  }
  total = Math.round((total + Number.EPSILON) * 100) / 100;
  return { total, ...gradeFor(total, policy.bands) };
}
export function weightedGpa(rows) {
  const credits = rows.reduce((s, r) => s + r.credits, 0);
  return credits ? rows.reduce((s, r) => s + r.gpa * r.credits, 0) / credits : 0;
}
