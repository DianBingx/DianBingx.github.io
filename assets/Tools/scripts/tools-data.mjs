export const PAGE_SIZE = 12;

function httpUrl(value, base) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, base);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function parseToolsData(data, dataUrl) {
  if (!data || typeof data !== 'object') throw new Error('Invalid tools data');
  const records = Array.isArray(data) ? data : Object.values(data);
  const items = records.flatMap((record) => {
    if (!record || typeof record !== 'object') return [];
    const name = record.Name ?? record.name;
    const url = httpUrl(record.Url ?? record.url, dataUrl);
    if (typeof name !== 'string' || !name.trim() || !url) return [];
    const iconValue = record.Icon ?? record.icon;
    // Existing ../images/... paths are relative to datas/ToolsData.json.
    // A plain filename is shorthand for a file in images/.
    const icon = httpUrl(iconValue, typeof iconValue === 'string' && !iconValue.includes('/')
      ? new URL('../images/', dataUrl) : dataUrl);
    return [{ name: name.trim(), url, icon, type: String(record.Type ?? record.type ?? 0) }];
  });
  if (records.length > 0 && items.length === 0) throw new Error('No valid tools entries');
  return items;
}

export function createToolsPages(items, pageSize = PAGE_SIZE) {
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new Error('Invalid page size');
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.type)) groups.set(item.type, []);
    groups.get(item.type).push(item);
  }
  const pages = [];
  for (const [type, entries] of groups) {
    for (let offset = 0; offset < entries.length; offset += pageSize) {
      pages.push({ type, items: entries.slice(offset, offset + pageSize) });
    }
  }
  return pages;
}
