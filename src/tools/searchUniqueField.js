import { readFile } from 'node:fs/promises';
const field = process.argv[2] || 'department';
const data = JSON.parse(await readFile(new URL('../data/courses.json', import.meta.url), 'utf8'));
console.log([...new Set(data.map(row => row[field]))]);
