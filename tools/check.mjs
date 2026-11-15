import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
async function walk(dir) {
  for (const f of await readdir(dir, { withFileTypes: true })) {
    const p = `${dir}/${f.name}`;
    if (f.isDirectory()) await walk(p);
    else if (/\.(js|mjs)$/.test(p)) {
      const r = spawnSync(process.execPath, ['--check', p], { encoding: 'utf8' });
      if (r.status) throw Error(r.stderr);
      const source = await readFile(p, 'utf8');
      for (const m of source.matchAll(/from ['"]([.][^'"]+)['"]/g)) await readFile(new URL(m[1], new URL(p, `file://${process.cwd().replaceAll('\\', '/')}/`)));
    }
  }
}
await walk('src/js'); await walk('src/tools'); await walk('tools');
console.log('Syntax and relative imports passed.');
