import { openModal } from './infoModal.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
export function openPdfModal(book) {
  openModal(l(book.title), `<p class="muted mb-3">${t('materialHelp')}</p><a class="button is-light mb-3" href="${e(book.pdf)}" download>${t('download')} PDF</a><iframe class="pdf-frame" src="${e(book.pdf)}" title="${e(l(book.title))}"></iframe>`);
}
