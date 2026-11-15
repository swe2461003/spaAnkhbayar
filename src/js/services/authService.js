import { readStore, writeStore } from './dataService.js';
export const getSession = () => readStore('session', null);
export function login(name, role) {
  if (!['teacher', 'student', 'admin'].includes(role) || !name.trim() || name.length > 60) throw Error('Invalid demo identity');
  const session = { name: name.trim(), role, studentId: 'SW26-001' };
  writeStore('session', session); return session;
}
export const logout = () => writeStore('session', null);
export const canEdit = () => ['teacher', 'admin'].includes(getSession()?.role);
export function requireEditor() { if (!canEdit()) throw Error('Not permitted in student demo'); }
