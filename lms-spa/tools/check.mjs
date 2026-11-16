import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
async function check(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await check(file);
    else if (/\.(js|mjs)$/.test(file)) {
      const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
      if (result.status) throw Error(result.stderr);
      for (const match of (await readFile(file, 'utf8')).matchAll(/from ['"]([.][^'"]+)['"]/g)) await readFile(new URL(match[1], pathToFileURL(path.resolve(file))));
    }
  }
}
await check('src/js'); await check('src/tools'); await check('tools');
console.log('Syntax and module imports passed.');
