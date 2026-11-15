import { getLocalizedValue as l } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
export const renderOverviewText = text => `<div class="welcome-card"><div><span class="eyebrow">ХААИС · DLMS</span><h2>${e(l(text.title))}</h2><p>${e(l(text.body))}</p></div><img src="./img/logo.svg" alt="" width="84" height="84"></div>`;
