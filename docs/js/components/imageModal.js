import { getImagesByCourseCode } from '../services/imageService.js';
import { openModal } from './infoModal.js';
import { escapeHtml as e } from '../fn/format.js';
import { t } from '../i18n/i18n.js';
export async function openImageModal(code, signal) {
  const images = await getImagesByCourseCode(code);
  if (signal?.aborted) return;
  openModal(`${code} · ${t('images')}`, images.length ? images.map(url => `<img class="preview-image" src="${e(url)}" alt="${e(code)}">`).join('') : `<p>${t('empty')}</p>`);
}
