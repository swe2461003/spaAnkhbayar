// 2.5: Dot path-аар орчуулга авах ба хэл хадгалах.
import { translations } from './translations.js';
const KEY = 'con354.chapters21to25.language';
let language = 'mn';
try { language = localStorage.getItem(KEY) === 'en' ? 'en' : 'mn'; } catch { /* Default language. */ }

export const getCurrentLanguage = () => language;
export function setLanguage(value) {
  if (!['mn', 'en'].includes(value)) return;
  language = value;
  try { localStorage.setItem(KEY, value); } catch { /* Storage may be unavailable. */ }
}
export function t(path) {
  let value = translations[getCurrentLanguage()];
  for (const key of path.split('.')) value = value?.[key];
  return value ?? path;
}
export function toggleLanguage() {
  const next = getCurrentLanguage() === 'mn' ? 'en' : 'mn';
  setLanguage(next);
  return next;
}
// 2.9: JSON дахь {mn,en} утга болон огноог сонгосон хэлээр харуулна.
export function getLocalizedValue(value, fallback = '') {
  if (value == null) return fallback;
  return typeof value === 'object' ? value[getCurrentLanguage()] || value.mn || value.en || fallback : value;
}
export function formatDate(value) {
  const date = new Date(value + 'T12:00:00+08:00');
  if (!Number.isFinite(date.getTime())) return value;
  return getCurrentLanguage() === 'mn' ? value.replaceAll('-', '.') : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'Asia/Ulaanbaatar' }).format(date);
}
