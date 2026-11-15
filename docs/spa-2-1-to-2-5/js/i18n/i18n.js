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
