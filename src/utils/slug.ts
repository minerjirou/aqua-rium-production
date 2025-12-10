export function slugify(input: string): string {
  // Keep non-ASCII letters so Japanese etc. remain in the slug.
  // Browsers percent-encode them safely in URLs.
  return input
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\s_]+/g, '-')
    // Allow: word chars (ASCII), hyphen, and any non-ASCII (\u0080-\uFFFF)
    .replace(/[^\w\-\u0080-\uFFFF]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

