import { loadJson } from './dataService.js';
export const getBooks = () => loadJson('books');
