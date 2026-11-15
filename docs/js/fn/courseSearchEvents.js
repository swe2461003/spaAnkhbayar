import { getLocalizedValue as l } from '../i18n/i18n.js';
export function filterCourses(items, { query = '', department = 'all', type = 'all', sort = 'code' } = {}) {
  const needle = query.trim().toLocaleLowerCase();
  const filtered = items.filter(c => (department === 'all' || c.department === department) && (type === 'all' || c.type === type) && [c.id, c.name.mn, c.name.en, c.teacher].join(' ').toLocaleLowerCase().includes(needle));
  return filtered.sort((a, b) => sort === 'name' ? l(a.name).localeCompare(l(b.name)) : a.id.localeCompare(b.id));
}
