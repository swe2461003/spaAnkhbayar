import { readdir, writeFile } from 'node:fs/promises';
const base = new URL('../', import.meta.url);
const files = (await readdir(new URL('img/courses/', base))).filter(v => /\.(svg|png|jpe?g|webp)$/i.test(v)).sort();
const images = {};
for (const file of files) {
  const code = file.replace(/\.[^.]+$/, '').split('__')[0];
  (images[code] ??= []).push('./img/courses/' + file);
}
await writeFile(new URL('data/images.json', base), JSON.stringify(images, null, 2) + '\n');
console.log(`Generated ${files.length} image paths for ${Object.keys(images).length} courses.`);
