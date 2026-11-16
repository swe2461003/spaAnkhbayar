import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
export function convertCourses(rows, dictionary) {
  return rows.map(row => {
    const translation = dictionary[row.id];
    if (!translation?.name?.mn || !translation?.name?.en || !translation?.description?.mn || !translation?.description?.en) throw Error(`Missing translation: ${row.id}`);
    return { ...row, name: translation.name, description: translation.description };
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const base = new URL('../data/', import.meta.url);
  const rows = JSON.parse(await readFile(new URL('courses.json', base), 'utf8'));
  const dictionary = JSON.parse(await readFile(new URL('courseTranslations.json', base), 'utf8'));
  await writeFile(new URL('coursesEnMn.json', base), JSON.stringify(convertCourses(rows, dictionary), null, 2) + '\n');
  console.log('Bilingual course data generated.');
}
