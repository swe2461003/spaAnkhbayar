// Нийтлэг JSON loader: шинэ хэсгүүдийн хүсэлтийг кэшлэнэ.
const cache = new Map();
export async function loadJson(name) {
  if (cache.has(name)) return structuredClone(cache.get(name));
  const response = await fetch(new URL(`../../data/${name}.json`, import.meta.url));
  if (!response.ok) throw Error(`${name}: ${response.status}`);
  const data = await response.json();
  cache.set(name, data);
  return structuredClone(data);
}
