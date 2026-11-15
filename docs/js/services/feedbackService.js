import { collection, writeStore } from './dataService.js';
import { requireEditor } from './authService.js';
import { logAction } from './logService.js';
export const getFeedback = () => collection('feedback');
export async function addFeedback({ category, text, name }) {
  if (!['teaching', 'technical', 'other'].includes(category) || !text.trim() || text.length > 3000) throw Error('Invalid feedback');
  const data = await getFeedback(); data.unshift({ id: crypto.randomUUID(), category, text: text.trim(), name: name || null, status: 'new', date: new Date().toISOString() });
  writeStore('feedback', data);
  // Anonymous submission never writes a user identity or feedback text into activity logs.
}
export async function updateFeedback(id, status) {
  requireEditor(); if (!['new', 'reviewed', 'resolved'].includes(status)) throw Error('Invalid status');
  const all = await getFeedback(); const item = all.find(f => f.id === id); if (!item) throw Error('Not found');
  item.status = status; writeStore('feedback', all); await logAction('update', 'Demo feedback status');
}
