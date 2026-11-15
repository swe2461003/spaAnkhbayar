import { t, toggleLanguage, getCurrentLanguage } from '../i18n/i18n.js';
import { getSession, logout } from '../services/authService.js';
import { readStore, writeStore } from '../services/dataService.js';
import { escapeHtml as e } from '../fn/format.js';
import { icon } from './icons.js';
export const getDepartment = () => readStore('department', 'all');
const entries = [['overview', 'table-cells-large'], ['search', 'graduation-cap'], ['attendance', 'user-check'], ['journal', 'book-open'], ['plan', 'calendar-days'], ['books', 'folder-open'], ['calculation', 'calculator'], ['messages', 'comment'], ['feedback', 'comments'], ['logs', 'file-lines'], ['archive', 'box-archive']];
export function mountNavbar(path) {
  const session = getSession();
  document.body.classList.toggle('is-login', path === '/login');
  document.getElementById('navbar').innerHTML = `<aside class="app-sidebar"><a href="#/overview" class="brand"><img src="./img/logo.svg" alt="" width="38" height="38"><span><strong>ХААИС</strong><small>DLMS</small></span></a><div class="department"><label class="sr-only" for="department">${t('department')}</label><select id="department"><option value="all">${t('all')}</option><option value="software" ${getDepartment() === 'software' ? 'selected' : ''}>${t('software')}</option><option value="systems" ${getDepartment() === 'systems' ? 'selected' : ''}>${t('systems')}</option></select></div><nav aria-label="Main navigation">${entries.map(([key, symbol]) => `<a href="#/${key}" ${path === '/' + key ? 'class="active" aria-current="page"' : ''}>${icon(symbol)}<span>${t(key)}</span></a>`).join('')}</nav><div class="sidebar-bottom"><span class="avatar">${e(session?.name?.slice(0, 2) || 'ХА')}</span><div><strong>${e(session?.name || 'System')}</strong><small>${t(session?.role || 'teacher')}</small></div><button id="logout" aria-label="${t('logout')}" title="${t('logout')}">${icon('arrow-right-from-bracket')}</button></div></aside>`;
  document.getElementById('topbar').innerHTML = `<header class="topbar"><button id="menu-toggle" class="menu-toggle" aria-expanded="false" aria-label="Menu">${icon('bars')}</button><strong>${t(path.slice(1))}</strong><div class="topbar-actions"><button id="language" class="language-button" aria-label="${getCurrentLanguage() === 'mn' ? 'Switch to English' : 'Монгол хэл рүү солих'}">${getCurrentLanguage() === 'mn' ? 'EN' : 'MN'}</button><a href="#/overview?notifications=1" class="bell" aria-label="${t('notifications')}">${icon('bell')}<span></span></a><span class="avatar">${e(session?.name?.slice(0, 2) || 'ХА')}</span></div></header>`;
  document.getElementById('department').onchange = ev => { writeStore('department', ev.target.value); window.dispatchEvent(new Event('departmentchange')); };
  document.getElementById('language').onclick = toggleLanguage;
  document.getElementById('logout').onclick = () => { logout(); location.hash = '/login'; };
  document.getElementById('menu-toggle').onclick = ev => { const open = document.body.classList.toggle('menu-open'); ev.currentTarget.setAttribute('aria-expanded', String(open)); };
  document.querySelectorAll('.app-sidebar nav a').forEach(a => a.onclick = () => document.body.classList.remove('menu-open'));
}
