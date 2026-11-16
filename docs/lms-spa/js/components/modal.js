import { t } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
export function openDialog(title, content, className = '') {
  const host = document.getElementById('dialog-root');
  const trigger = document.activeElement;
  host.innerHTML = `<dialog class="lms-dialog ${className}" aria-labelledby="dialog-title"><header><h2 id="dialog-title">${e(title)}</h2><button class="button is-light" data-close aria-label="${t('filters.close')}">×</button></header><div class="dialog-content">${content}</div></dialog>`;
  const dialog = host.querySelector('dialog');
  dialog.querySelector('[data-close]').onclick = () => dialog.close();
  dialog.addEventListener('close', () => { host.replaceChildren(); if (trigger?.isConnected) trigger.focus(); }, { once: true });
  dialog.showModal();
  return dialog;
}
