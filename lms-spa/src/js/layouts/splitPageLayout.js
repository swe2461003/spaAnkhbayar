export function renderSplitPageLayout({ leftContent, rightContent }) {
  return `<div class="overview-split"><div>${leftContent}</div><div>${rightContent}</div></div>`;
}
