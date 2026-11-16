import { getImagesByCourseCode } from '../services/imageService.js';
import { t } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
export function bindImageModalEvents(root) {
  root.addEventListener('click', ev => {
    const button = ev.target.closest('[data-course-image]');
    if (!button) return;
    const images = getImagesByCourseCode(button.dataset.courseImage);
    if (!images.length) return;
    const host = document.getElementById('image-modal-root');
    host.innerHTML = `<dialog class="course-dialog" aria-labelledby="image-title"><header><h2 id="image-title">${e(button.dataset.courseImage)} · ${t('filters.image')}</h2><button class="button is-light" data-close aria-label="${t('filters.close')}">×</button></header><figure><img id="modal-image" alt="${e(button.dataset.courseImage)}"></figure><div class="image-controls"><button class="button is-light" data-prev>${t('filters.previous')}</button><span id="image-count"></span><button class="button is-light" data-next>${t('filters.next')}</button></div></dialog>`;
    const dialog = host.querySelector('dialog'); let index = 0;
    const draw = () => { dialog.querySelector('img').src = images[index]; dialog.querySelector('#image-count').textContent = `${index + 1} / ${images.length}`; dialog.querySelector('[data-prev]').disabled = index === 0; dialog.querySelector('[data-next]').disabled = index === images.length - 1; };
    dialog.querySelector('[data-close]').onclick = () => dialog.close();
    dialog.querySelector('[data-prev]').onclick = () => { if (index > 0) { index--; draw(); } };
    dialog.querySelector('[data-next]').onclick = () => { if (index < images.length - 1) { index++; draw(); } };
    const keyboard = ev => { if (ev.key === 'ArrowRight' && index < images.length - 1) { index++; draw(); } if (ev.key === 'ArrowLeft' && index > 0) { index--; draw(); } };
    dialog.addEventListener('keydown', keyboard);
    dialog.addEventListener('close', () => { host.replaceChildren(); button.focus(); }, { once: true });
    draw(); dialog.showModal();
  });
}
