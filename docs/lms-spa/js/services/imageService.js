let map = null;
export async function loadImages() {
  if (map) return;
  const response = await fetch(new URL('../../data/images.json', import.meta.url));
  if (!response.ok) throw Error(`Images request failed: ${response.status}`);
  map = await response.json();
}
export const getImagesByCourseCode = code => map?.[code] || [];
