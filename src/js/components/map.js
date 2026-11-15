import { t } from '../i18n/i18n.js';
import { panel } from './ui.js';
// §2.10: the book's geographical food map becomes a clickable department map.
export function renderMap(counts) {
  return panel(t('mapTitle'), `<p class="muted mb-4">${t('mapHelp')}</p><div class="department-map">${['software', 'systems'].map((d, i) => `<a href="#/search?department=${d}" class="department-tile"><svg viewBox="0 0 120 64" aria-hidden="true"><rect x="${i ? 12 : 6}" y="8" width="90" height="48" rx="12" fill="${i ? '#dbeafe' : '#dcfce7'}"/><path d="M26 44V24h16v20m12 0V18h16v26m12 0V30h10v14" stroke="${i ? '#2563eb' : '#16a34a'}" fill="none" stroke-width="3"/></svg><strong>${t(d)}</strong><small>${counts[d]} ${t('course')}</small></a>`).join('')}</div>`);
}
