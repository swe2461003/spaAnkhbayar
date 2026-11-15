import { collection, writeStore } from './dataService.js';
import { logAction } from './logService.js';
export const getMessages = () => collection('messages');
export async function sendMessage(contact, text) {
  if (!['teacher', 'office', 'group'].includes(contact) || !text.trim() || text.length > 2000) throw Error('Invalid message');
  const messages = await getMessages(); messages.push({ id: crypto.randomUUID(), contact, text: text.trim(), from: 'me', date: new Date().toISOString() });
  writeStore('messages', messages); await logAction('submit', `Message · ${contact}`);
}
