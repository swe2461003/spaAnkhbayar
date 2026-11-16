export function getScheme(policy, key) {
  const scheme = policy.schemes.find(item => item.id === key);
  if (!scheme || Object.values(scheme.weights).reduce((a, b) => a + b, 0) !== 100) throw Error('Invalid grading scheme');
  return scheme;
}
export function calculateGrade(scores, policy, schemeId = 'standard') {
  const scheme = getScheme(policy, schemeId);
  let total = 0;
  const contributions = {};
  for (const [key, weight] of Object.entries(scheme.weights)) {
    const value = Number(scores[key]);
    if (scores[key] == null || scores[key] === '' || !Number.isFinite(value) || value < 0 || value > 100) throw Error(`Invalid score: ${key}`);
    contributions[key] = value * weight / 100;
    total += contributions[key];
  }
  total = Math.round((total + Number.EPSILON) * 100) / 100;
  const grade = policy.bands.find(band => total >= band.min);
  return { total, contributions, letter: grade.letter, gpa: grade.gpa, passed: total >= policy.passMark };
}
export function weightedGpa(rows) {
  const credits = rows.reduce((sum, row) => sum + row.credits, 0);
  return credits ? rows.reduce((sum, row) => sum + row.credits * row.gpa, 0) / credits : 0;
}
