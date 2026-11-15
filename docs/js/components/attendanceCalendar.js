import { t, getCurrentLanguage } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
import { badge } from './ui.js';
export function renderAttendanceCalendar(month, selectedDate, records) {
  const [year, num] = month.split('-').map(Number); const count = new Date(year, num, 0).getDate();
  const offset = (new Date(year, num - 1, 1).getDay() + 6) % 7;
  const locale = getCurrentLanguage() === 'mn' ? 'mn-MN' : 'en-US';
  const heading = getCurrentLanguage() === 'mn' ? `${year} оны ${num} сар` : new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(new Date(year, num - 1, 1));
  return `<div class="calendar-heading"><strong>${e(heading)}</strong></div><div class="attendance-calendar">${['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(d => `<span class="calendar-label">${t(d).slice(0, 3)}</span>`).join('')}${'<span></span>'.repeat(offset)}${Array.from({ length: count }, (_, i) => {
    const date = `${month}-${String(i + 1).padStart(2, '0')}`; const daily = records.filter(r => r.date === date); const status = daily.some(r => r.status === 'absent') ? 'absent' : daily.some(r => r.status === 'late') ? 'late' : daily.length ? 'present' : 'unmarked';
    return `<button class="calendar-day ${status} ${date === selectedDate ? 'selected' : ''}" data-date="${date}" aria-label="${date} ${t(status)}" ${date === selectedDate ? 'aria-pressed="true"' : ''}>${i + 1}</button>`;
  }).join('')}</div><div class="legend">${['present', 'late', 'absent'].map(s => badge(t(s), s === 'present' ? 'green' : s === 'late' ? 'yellow' : 'red')).join('')}</div>`;
}
