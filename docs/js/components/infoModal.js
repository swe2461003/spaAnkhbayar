import { t } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
// Native dialog provides focus trapping; focus returns to the trigger on close.
export function openModal(title, content) {
  const host = document.getElementById('modal-root');
  const previous = document.activeElement;
  host.innerHTML = `<dialog class="app-dialog" aria-labelledby="dialog-title"><div class="dialog-heading"><h2 id="dialog-title">${e(title)}</h2><button class="button is-light" data-close aria-label="${t('close')}">×</button></div><div class="dialog-body">${content}</div></dialog>`;
  const dialog = host.querySelector('dialog');
  dialog.querySelector('[data-close]').onclick = () => dialog.close();
  dialog.addEventListener('click', ev => { if (ev.target === dialog) { const r = dialog.getBoundingClientRect(); if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { host.replaceChildren(); previous?.focus(); }, { once: true });
  dialog.showModal();
}
