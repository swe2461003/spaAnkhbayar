import { getCourses } from './courseService.js';
export async function loadMapSvg() {
  const response = await fetch(new URL('../../img/department-map.svg', import.meta.url));
  if (!response.ok) throw Error(`Map: ${response.status}`);
  return response.text();
}
// Номын аймаг → хүнсний холбоосыг мэргэжил → хичээл болгосон.
export async function getCoursesByDepartment(department) {
  return (await getCourses()).filter(course => course.department === department);
}
