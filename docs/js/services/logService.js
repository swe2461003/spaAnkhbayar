import { collection, writeStore } from './dataService.js';
import { getSession } from './authService.js';
export const getLogs = () => collection('logs');
export async function logAction(action, details) {
  const session = getSession();
  const logs = await getLogs();
  logs.unshift({ id: crypto.randomUUID(), user: session?.name ?? 'Demo', role: session?.role ?? 'student', action, details, date: new Date().toISOString() });
  writeStore('logs', logs.slice(0, 500));
}
