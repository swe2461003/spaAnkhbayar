import { getLocalizedValue as l } from '../i18n/i18n.js';
export function filterCourses(data, state) {
  const q = state.query.trim().toLocaleLowerCase();
  return data.filter(c =>
    (!state.departments.length || state.departments.includes(c.department)) &&
    (state.type === 'all' || c.type === state.type) &&
    [c.id, c.name.mn, c.name.en, c.teacher].join(' ').toLocaleLowerCase().includes(q)
  ).sort((a, b) => state.sort === 'name' ? l(a.name).localeCompare(l(b.name)) : a.id.localeCompare(b.id));
}
export function readSearchState(form) {
  const data = new FormData(form);
  return { query: data.get('query') || '', type: data.get('type') || 'all', departments: data.getAll('department'), columns: data.getAll('column'), sort: data.get('sort') || 'code' };
}
