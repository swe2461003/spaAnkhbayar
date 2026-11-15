import { getCourses } from './courseService.js';
// The LMS equivalent of the book's province -> food lookup is department -> courses.
export async function getCoursesByDepartment(department) {
  return (await getCourses()).filter(c => department === 'all' || c.department === department);
}
