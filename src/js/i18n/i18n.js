import { translations } from './translations.js';
let language = 'mn';
try { if (typeof window !== 'undefined') language = localStorage.getItem('con354.language') === 'en' ? 'en' : 'mn'; } catch { /* Memory fallback. */ }
export const getCurrentLanguage = () => language;
export const t = key => translations[language][key] ?? translations.mn[key] ?? key;
export const getLocalizedValue = v => v && typeof v === 'object' ? (v[language] ?? v.mn ?? v.en ?? '') : (v ?? '');
export function setLanguage(value) {
  if (!['mn', 'en'].includes(value)) return;
  language = value;
  try { localStorage.setItem('con354.language', value); } catch { /* Memory fallback. */ }
  document.documentElement.lang = value;
  window.dispatchEvent(new Event('languagechange'));
}
export const toggleLanguage = () => setLanguage(language === 'mn' ? 'en' : 'mn');
export function formatDate(value) {
  const date = new Date(value.length === 10 ? value + 'T12:00:00+08:00' : value);
  if (language === 'mn') return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Ulaanbaatar' }).format(date).replaceAll('-', '.');
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'Asia/Ulaanbaatar' }).format(date);
}
