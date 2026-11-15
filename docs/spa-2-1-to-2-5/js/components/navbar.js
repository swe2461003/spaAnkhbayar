// 2.4: Navbar нь олон page-д давтагдах нэг component юм.
import { t, toggleLanguage } from '../i18n/i18n.js';

export function renderNavbar() {
  const links = ['overview', 'search', 'calculation', 'books', 'contact'];
  return `
    <header class="app-header">
      <nav class="navbar container" aria-label="${t('nav.label')}">
        <div class="navbar-brand">
          <a class="navbar-item brand" href="#/overview">
            <span class="brand-mark" aria-hidden="true">L</span>
            <span><strong>${t('nav.brand')}</strong><small>${t('nav.subtitle')}</small></span>
          </a>
          <button class="navbar-burger" type="button" data-target="main-menu"
            aria-label="${t('nav.menu')}" aria-controls="main-menu" aria-expanded="false">
            <span aria-hidden="true"></span><span aria-hidden="true"></span>
            <span aria-hidden="true"></span><span aria-hidden="true"></span>
          </button>
        </div>
        <div id="main-menu" class="navbar-menu">
          <div class="navbar-end">
            ${links.map(key => `<a class="navbar-item" href="#/${key}">${t('nav.' + key)}</a>`).join('')}
            <div class="navbar-item"><button id="langToggle" type="button" class="button is-light" aria-label="${t('nav.languageLabel')}">${t('nav.language')}</button></div>
          </div>
        </div>
      </nav>
    </header>
  `;
}

export function initNavbar() {
  const burger = document.querySelector('.navbar-burger');
  const menu = document.getElementById(burger.dataset.target);
  const closeMenu = () => {
    burger.classList.remove('is-active');
    menu.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
  };
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-active');
    menu.classList.toggle('is-active', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 1023) closeMenu(); });
  document.getElementById('langToggle').addEventListener('click', () => {
    toggleLanguage();
    window.location.reload(); // Номын 2.5 жишээтэй адил шинэ хэлээр дахин зурна.
  });
}

export function mountNavbar(root) {
  if (!root) return;
  root.innerHTML = renderNavbar();
  initNavbar();
}
