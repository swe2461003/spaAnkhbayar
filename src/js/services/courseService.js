import { loadJson } from './dataService.js';
export const getCourses = () => loadJson('courses');
export const getCourse = async id => (await getCourses()).find(c => c.id === id);
export const getStudents = () => loadJson('students');
export const getPlan = () => loadJson('plan');
