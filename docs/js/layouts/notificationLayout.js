import { escapeHtml as e } from '../fn/format.js';
export const renderNotification = message => `<div class="notification is-light">${e(message)}</div>`;
