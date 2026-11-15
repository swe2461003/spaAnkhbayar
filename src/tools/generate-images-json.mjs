import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = new URL('../', import.meta.url);
const files = (await readdir(new URL('img/courses/', root))).filter(f => /\.(svg|png|jpe?g|webp)$/i.test(f)).sort();
const images = {};
for (const file of files) {
  const code = path.parse(file).name.split('__')[0];
  (images[code] ??= []).push('./img/courses/' + file);
}
await writeFile(new URL('data/images.json', root), JSON.stringify(images, null, 2) + '\n');
console.log(`Image manifest: ${files.length} images.`);
