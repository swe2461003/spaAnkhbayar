// 2.3: Бүх page ижил outer frame ашиглана.
export function renderPageLayout({ id = '', title = '', subtitle = '', content = '' }) {
  return `
    <section id="${id}" class="section page-section">
      <div class="container">
        <div class="page-heading">
          <p class="eyebrow">CON354 · LMS</p>
          <h1 class="title is-2">${title}</h1>
          <p class="page-subtitle">${subtitle}</p>
        </div>
        ${content}
      </div>
    </section>
  `;
}
