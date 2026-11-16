import { readFile } from 'node:fs/promises';
const field = process.argv[2] || 'department';
const rows = JSON.parse(await readFile(new URL('../data/coursesEnMn.json', import.meta.url), 'utf8'));
console.log([...new Set(rows.map(row => JSON.stringify(row[field])))].map(v => JSON.parse(v)));
