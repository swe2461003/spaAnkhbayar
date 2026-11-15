// §2.9 migration utility: never machine-invent translations for domain records.
export function convertCourses(rows, dictionary) {
  return rows.map(row => {
    if (row.name && typeof row.name === 'object') return row;
    const translated = dictionary[row.id];
    if (!translated?.mn || !translated?.en) throw Error(`Missing translation: ${row.id}`);
    return { ...row, name: translated };
  });
}
