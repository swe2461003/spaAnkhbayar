import { icon } from '../components/icons.js';
import { getCurrentLanguage, getLocalizedValue } from '../i18n/i18n.js';
import { escapeHtml as e } from '../fn/format.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { renderSplitPageLayout } from '../layouts/splitPageLayout.js';
import { getCourses } from '../services/courseService.js';
import { loadTxt } from '../services/txtService.js';
import { getBooks } from '../services/bookService.js';
import { renderOverviewText } from '../components/overviewText.js';
import { renderMap, bindMapEvents } from '../components/map.js';
import { t } from '../i18n/i18n.js';

// 2.10: Номын map + text + info modal-ийг LMS-ийн чиглэлд тохируулсан.
export async function renderOverviewPage({ signal }) {
  const app = document.getElementById('app');
  app.innerHTML = renderPageLayout({ title: t('dashboard.title'), content: `<p>${t('filters.loading')}</p>` });
  const [courses, text, books] = await Promise.all([getCourses(), loadTxt(), getBooks()]);
  if (signal.aborted) return;
  const root = document.createElement('div');
  const mn=getCurrentLanguage()==='mn';
  const schedule='<section class="box schedule-panel"><div class="panel-heading-row"><h2>'+(mn?'Хичээлийн хуваарь':'Course schedule')+'</h2><a href="#/search">'+(mn?'Бүгдийг харах':'View all')+' →</a></div><p class="muted">'+(mn?'Хичээлийн жишээ хуваарь':'Sample course timetable')+'</p><div class="schedule-list">'+courses.map((course,i)=>'<a class="schedule-row tone-'+i%3+'" href="#/search?ids='+encodeURIComponent(course.id)+'"><span class="schedule-time">'+icon('clock')+e(course.time)+'</span><span class="schedule-course"><strong>'+e(getLocalizedValue(course.name))+'</strong><small>'+e(course.room)+' · '+e(course.group)+' · '+e(course.id)+'</small></span><span class="tag is-success is-light">'+t('filters.'+course.type)+'</span></a>').join('')+'</div></section>';
  const quick='<aside class="box quick-panel"><div class="panel-heading-row"><h2>'+(mn?'Сургалтын хэсгүүд':'Learning workspace')+'</h2></div>'+['search','calculation','books'].map((key,i)=>'<a class="quick-link" href="#/'+key+'"><span class="notice-dot dot-'+i+'"></span><span><strong>'+t('nav.'+key)+'</strong><small>'+[mn?'6 хичээл · 2 тэнхим':'6 courses · 2 departments',mn?'Оноо болон голч тооцох':'Calculate scores and GPA',mn?'3 PDF гарын авлага':'3 PDF study guides'][i]+'</small></span>'+icon('arrow')+'</a>').join('')+'<div class="workspace-note">'+(mn?'Сургалтын мэдээлэл, тооцоо, материалыг нэг дороос.':'Courses, grades and resources in one place.')+'</div></aside>';
  const activity='<div class="dashboard-main-grid">'+schedule+quick+'</div>';
  
  const counts = [[courses.length, t('dashboard.courses')], [new Set(courses.map(c => c.department)).size, t('dashboard.departments')], [courses.reduce((sum, c) => sum + c.credits, 0), t('dashboard.credits')], [books.length, t('dashboard.materials')]];
  root.innerHTML = renderPageLayout({ id: 'overview', title: t('dashboard.title'), subtitle: t('dashboard.subtitle'), content: `<div class="dashboard-stats">${counts.map(([value, label]) => `<div><span class="stat-icon">${icon(['search','overview','calculation','books'][counts.findIndex(item => item[1] === label)])}</span><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>` + activity + renderSplitPageLayout({ leftContent: renderMap(), rightContent: renderOverviewText(text) }) + `<section class="box"><h2 class="section-title">${t('dashboard.formats')}</h2><div class="format-grid">${['lecture','practice','lab'].map(type => `<a href="#/search?type=${type}"><span>${t('filters.' + type)}</span><strong>${courses.filter(c => c.type === type).length}</strong></a>`).join('')}</div></section>` });
  app.replaceChildren(root);
  document.title = t('dashboard.title') + ' · LMS';
  await bindMapEvents(root, signal);
}
