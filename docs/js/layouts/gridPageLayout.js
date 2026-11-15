import { t } from '../i18n/i18n.js';
export const renderGridPageLayout = ({ items, renderItem }) => items.length ? `<div class="card-grid">${items.map(renderItem).join('')}</div>` : `<div class="empty-state">${t('empty')}</div>`;
