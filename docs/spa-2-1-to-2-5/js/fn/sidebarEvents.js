import { t } from '../i18n/i18n.js';
export function bindSidebar(root) {
  const button = root.querySelector('#toggle-filters');
  button.onclick = () => {
    const open = root.querySelector('.search-sidebar').classList.toggle('filters-open');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = t(open ? 'filters.hide' : 'filters.show');
  };
}
