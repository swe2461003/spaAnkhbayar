import {renderWorkloadPage} from './pages/workloadPage.js';
import { renderAccountPage,renderJournalPage,renderReportsPage,renderArchivePage,renderAuditPage,renderAccreditationPage,renderUsersPage,renderExcelPage } from './pages/portalPages.js';
// 2.2: Замын тохиргоог page-ийн агуулгаас тусгаарлав.
import { renderOverviewPage } from './pages/overviewPage.js';
import { renderSearchPage } from './pages/searchPage.js';
import { renderCalculationPage } from './pages/calculationPage.js';
import { renderBooksPage } from './pages/booksPage.js';
import { renderContactPage } from './pages/contactPage.js';
import { renderNotFoundPage } from './pages/notFoundPage.js';

export const routes = {
  '#/workload': renderWorkloadPage,
  '#/account': renderAccountPage, '#/journal': renderJournalPage, '#/reports': renderReportsPage, '#/archive': renderArchivePage, '#/audit': renderAuditPage, '#/accreditation': renderAccreditationPage, '#/users': renderUsersPage, '#/excel': renderExcelPage,
  '#/overview': renderOverviewPage,
  '#/search': renderSearchPage,
  '#/calculation': renderCalculationPage,
  '#/books': renderBooksPage,
  '#/contact': renderContactPage,
  '#/404': renderNotFoundPage
};
