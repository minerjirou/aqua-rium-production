const base = (import.meta.env.PUBLIC_R2_BASE_URL || '').trim().replace(/\/$/, '');

export function r2(path: string): string {
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  const clean = path.replace(/^\/+/, '');
  if (!base) return `/${clean}`; // fallback to local/public during dev
  return `${base}/${clean}`;
}

