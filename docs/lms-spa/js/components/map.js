import { loadMapSvg, getCoursesByDepartment } from '../services/mapService.js';
import { openDepartmentInfo } from './infoModal.js';
import { t } from '../i18n/i18n.js';
export const renderMap = () => `<section class="box"><h2 class="section-title">${t('dashboard.mapTitle')}</h2><p class="muted">${t('dashboard.mapHelp')}</p><div id="department-map"></div><div class="map-legend"><span>${t('filters.software')}</span><span>${t('filters.systems')}</span></div></section>`;
export async function bindMapEvents(root, signal) {
  const svg = await loadMapSvg();
  if (signal.aborted) return;
  root.querySelector('#department-map').innerHTML = svg;
  root.querySelectorAll('[data-department]').forEach(node => {
    node.setAttribute('aria-label', t('filters.' + node.dataset.department));
    const activate = async () => {
      const courses = await getCoursesByDepartment(node.dataset.department);
      if (!signal.aborted) openDepartmentInfo(node.dataset.department, courses);
    };
    node.addEventListener('click', activate);
    node.addEventListener('keydown', event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); activate(); } });
  });
}
