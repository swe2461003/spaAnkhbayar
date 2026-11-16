import { DATA_MODE, LOCAL_COURSES_URL, API_COURSES_URL } from '../config.js';
let cache = null;
export async function getCourses() {
  if (cache) return structuredClone(cache);
  const url = DATA_MODE === 'api' ? API_COURSES_URL : LOCAL_COURSES_URL;
  if (!url) throw Error('Course API is not configured');
  const response = await fetch(url);
  if (!response.ok) throw Error(`Course request failed: ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw Error('Expected course array');
  cache = data;
  return structuredClone(cache);
}
