import { loadJson } from './dataService.js';
export const loadImages = () => loadJson('images');
export const getImagesByCourseCode = async code => (await loadImages())[code] ?? [];
