import { escapeHtml } from '../fn/format.js';
export const renderNotification = (message, danger = false) => `<div class="notification ${danger ? 'is-danger' : 'is-success'} is-light" role="status">${escapeHtml(message)}</div>`;
