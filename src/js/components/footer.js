import { t } from '../i18n/i18n.js';
export function mountFooter() { document.getElementById('footer').innerHTML = `<footer class="app-footer"><span>${t('footer')}</span><a href="#/contact">${t('contact')}</a></footer>`; }
