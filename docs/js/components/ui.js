import { escapeHtml as e } from '../fn/format.js';
import { t } from '../i18n/i18n.js';
import { icon } from './icons.js';
export const badge = (text, tone = 'green') => `<span class="badge ${e(tone)}">${e(text)}</span>`;
export const button = (text, attrs = '', kind = 'is-primary') => `<button class="button ${kind}" ${attrs}>${e(text)}</button>`;
export const field = (text, control) => `<label class="field"><span class="label">${e(text)}</span>${control}</label>`;
export const input = (name, value = '', type = 'text', attrs = '') => `<input class="input" name="${e(name)}" type="${type}" value="${e(value)}" ${attrs}>`;
export const select = (name, options, value = '', attrs = '') => `<select class="input" name="${e(name)}" ${attrs}>${options.map(([v, label]) => `<option value="${e(v)}" ${v === value ? 'selected' : ''}>${e(label)}</option>`).join('')}</select>`;
export const panel = (title, content, action = '') => `<section class="panel-card"><div class="panel-heading"><h2>${e(title)}</h2>${action}</div>${content}</section>`;
export const stats = items => `<div class="stats-grid">${items.map(([label, value, symbol, detail = '']) => `<div class="panel-card stat"><span class="stat-icon">${icon(symbol)}</span><div class="stat-value">${e(value)}</div><p>${e(label)}</p><small class="muted">${e(detail)}</small></div>`).join('')}</div>`;
export function toast(message = t('saved')) { const el = document.getElementById('toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('visible'), 3500); }
export function listen(root, event, selector, handler) {
  root.addEventListener(event, ev => { const target = ev.target.closest(selector); if (target && root.contains(target)) handler(ev, target); });
}
