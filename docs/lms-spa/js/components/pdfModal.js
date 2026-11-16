import { openDialog } from './modal.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
export function openPdfModal(book) {
  const allowed = new URL('./pdf/', location.href);
  const url = new URL(book.pdf, location.href);
  if (url.origin !== allowed.origin || !url.pathname.startsWith(allowed.pathname)) throw Error('Invalid PDF path');
  openDialog(l(book.title), `<a class="button is-light mb-4" href="${e(url.href)}" download>${t('materials.download')}</a><p class="muted mb-3">${t('materials.viewerHint')}</p><iframe class="pdf-frame" src="${e(url.href)}" title="${e(l(book.title))}"></iframe>`, 'pdf-dialog');
}
