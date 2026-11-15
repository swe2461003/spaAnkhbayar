import { getCourse } from '../services/courseService.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderNotFoundPage } from './notFoundPage.js';
import { t, getLocalizedValue as l } from '../i18n/i18n.js';
import { panel, badge } from '../components/ui.js';
import { escapeHtml as e } from '../fn/format.js';
export async function renderCoursePage({ root, params, signal }) {
  const course = await getCourse(params.get('id')); if (signal.aborted) return;
  if (!course) return renderNotFoundPage({ root });
  root.innerHTML = renderPageLayout({ title: l(course.name), subtitle: `${course.id} · ${course.teacher}`, content: panel(t('detailsHelp'), `<div class="course-detail"><img src="./img/courses/${e(course.id)}.svg" alt="${e(l(course.name))}"><div>${badge(t(course.type))}<h2>${e(l(course.name))}</h2><p>${e(l(course.description))}</p><p class="muted mt-4">${t(course.department)} · ${e(course.credits)} ${t('credits')} · ${e(course.room)}</p><div class="buttons mt-5"><a class="button is-primary" href="#/books?course=${e(course.id)}">${t('books')}</a><a class="button is-light" href="#/attendance?course=${e(course.id)}">${t('attendance')}</a><a class="button is-light" href="#/journal?course=${e(course.id)}">${t('journal')}</a></div></div></div>`) });
}
