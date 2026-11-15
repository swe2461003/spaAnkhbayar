import { cp, mkdir } from 'node:fs/promises';
await mkdir('docs', { recursive: true });
await cp('src', 'docs', { recursive: true, filter: p => !p.includes('scss') && !p.includes('tools') });
console.log('Static docs/ prepared locally. Nothing published.');
