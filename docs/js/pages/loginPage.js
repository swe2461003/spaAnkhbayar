import { t } from '../i18n/i18n.js';
import { login } from '../services/authService.js';
import { logAction } from '../services/logService.js';
import { button, field, input, toast } from '../components/ui.js';
export function renderLoginPage({ root }) {
  root.innerHTML = `<section class="login-page"><div class="login-brand"><img src="./img/logo.svg" alt="" width="64"><p class="eyebrow">ХӨДӨӨ АЖ АХУЙН ИХ СУРГУУЛЬ</p><h1>Суралцах.<br>Хөгжих.<br><span>Бүтээх.</span></h1><p>DLMS · ${t('faculty')}</p></div><div class="login-form"><div class="panel-card"><span class="eyebrow">CON354 · DLMS</span><h2>${t('login')}</h2><p class="muted mb-5">${t('loginHelp')}</p><form id="login-form"><div class="role-picker">${['teacher', 'student', 'admin'].map((r, i) => `<label><input type="radio" name="role" value="${r}" ${i === 0 ? 'checked' : ''}><span>${t(r)}</span></label>`).join('')}</div>${field(t('demoName'), input('name', 'Б. Анар', 'text', 'required maxlength="60" autocomplete="off"'))}${button(t('enterDemo'), 'type="submit"')}</form></div></div></section>`;
  root.querySelector('form').onsubmit = async ev => {
    ev.preventDefault(); const data = new FormData(ev.currentTarget);
    try { login(data.get('name'), data.get('role')); await logAction('login', t('login')); location.hash = '/overview'; }
    catch { toast(t('invalid')); }
  };
}
