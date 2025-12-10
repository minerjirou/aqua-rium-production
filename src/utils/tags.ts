import { slugify } from '@/utils/slug';

// Minimal YAML list parser for our tags.yml structure.
// Supports:
// tags:\n  - tag1\n  - tag2
function parseYamlList(source: string, key = 'tags'): string[] {
  const lines = source.split(/\r?\n/);
  const tags: string[] = [];
  let inList = false;
  for (let raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (!inList) {
      if (line.startsWith(`${key}:`)) inList = true;
      continue;
    }
    if (line.startsWith('-')) {
      // remove leading '-'
      const v = line.replace(/^\-\s*/, '').trim();
      if (v) tags.push(v);
      continue;
    }
    // stop when leaving the list
    if (!line.startsWith('-')) break;
  }
  return tags;
}

export function mergeTags(configured: string[], discovered: string[]): { slug: string; name: string }[] {
  const map = new Map<string, string>();
  for (const t of configured) {
    const name = String(t || '').trim();
    if (!name) continue;
    const s = slugify(name);
    if (!s) continue;
    if (!map.has(s)) map.set(s, name);
  }
  for (const t of discovered) {
    const name = String(t || '').trim();
    if (!name) continue;
    const s = slugify(name);
    if (!s) continue;
    if (!map.has(s)) map.set(s, name);
  }
  return Array.from(map, ([slug, name]) => ({ slug, name }));
}

export async function getConfiguredTags(): Promise<string[]> {
  try {
    const mod = await import('@/content/tags.yml?raw');
    const raw = (mod as any).default as string;
    return parseYamlList(raw, 'tags');
  } catch {
    return [];
  }
}

export async function getConfiguredMemberTags(): Promise<string[]> {
  try {
    const mod = await import('@/content/tags.yml?raw');
    const raw = (mod as any).default as string;
    return parseYamlList(raw, 'memberTags');
  } catch {
    return [];
  }
}
