// 2.1: URL-ийн hash утгаар аль page function ажиллахыг сонгоно.
export function initRouter(routes) {
  function renderRoute() {
    const hash = window.location.hash || '#/overview';
    const page = routes[hash] || routes['#/404'];
    page?.();
    document.querySelectorAll('.navbar-menu .navbar-item[href^="#/"]').forEach(link => {
      const active = link.getAttribute('href') === hash;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}

