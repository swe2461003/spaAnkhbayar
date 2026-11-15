import { DATA_BASE_URL, STORAGE_PREFIX } from '../config.js';
const cache = new Map();
const memory = new Map();
export async function loadJson(name) {
  if (cache.has(name)) return structuredClone(cache.get(name));
  const response = await fetch(new URL(name + '.json', DATA_BASE_URL));
  if (!response.ok) throw new Error(`Data request ${name}: ${response.status}`);
  const data = await response.json(); cache.set(name, data); return structuredClone(data);
}
export function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw !== null) return JSON.parse(raw);
  } catch { /* Corrupt/unavailable storage uses memory or seed data. */ }
  return structuredClone(memory.has(key) ? memory.get(key) : fallback);
}
export function writeStore(key, value) {
  // Do not report a successful durable save if quota/access fails.
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  memory.set(key, structuredClone(value));
}
export async function collection(key) { return readStore(key, await loadJson(key)); }
