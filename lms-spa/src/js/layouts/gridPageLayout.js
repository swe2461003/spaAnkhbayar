export function renderGridPageLayout(items, renderItem) {
  return `<div class="materials-grid">${items.map(renderItem).join('')}</div>`;
}
