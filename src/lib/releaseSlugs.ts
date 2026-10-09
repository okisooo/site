import type { Release } from '../data/releases';
import { releaseRedirects } from '../data/releaseRedirects';

// Authored readable equivalents for titles the ASCII formatter cannot retain.
const titleSlugs: Record<string, string> = {
  '\u30ea\uff1a\u30d7\u30ec\u30a4': 're-play',
  'Chronicles of "\u30de\u30c3\u30bf"': 'chronicles-of-matta',
  '\u30b8\u30a7\u30cd\u30b7\u30b9': 'genesis',
  '\u30ea\u30b6\u30ec\u30af\u30b7\u30e7\u30f3': 'resurrection',
  '\u30ec\u30dc\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3': 'revolution',
};

export function releaseTitleSlug(title: string): string {
  const slug = titleSlugs[title] ?? title.toLowerCase().normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (!slug) throw new Error(`Add a readable release slug for: ${title}`);
  return slug;
}

function isPublishedSlug(release: Release): boolean {
  return !!release.slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(release.slug)
    && !(release.id && release.slug.endsWith(`-${release.id.slice(0, 6)}`))
    && !Object.hasOwn(releaseRedirects, release.slug);
}

// Reserve published addresses before assigning newcomers, even if a provider ID
// or the catalog ordering changes. A genuine title collision gets a date, not an ID.
export function assignReleaseSlugs<T extends Release>(releases: T[], previous: Release[] = []): T[] {
  const published = releases.map(release => {
    const byId = release.id && previous.find(item => item.id === release.id);
    const matches = previous.filter(item => item.title === release.title
      && item.releaseDate === release.releaseDate && item.albumType === release.albumType);
    const cached = byId || (matches.length === 1 ? matches[0] : undefined);
    return cached && isPublishedSlug(cached) ? cached.slug : isPublishedSlug(release) ? release.slug : undefined;
  });
  const kept = published.filter((slug): slug is string => !!slug);
  if (new Set(kept).size !== kept.length) throw new Error('Duplicate published release slugs');
  const used = new Set([...Object.keys(releaseRedirects), ...previous.filter(isPublishedSlug).map(item => item.slug!), ...kept]);
  return releases.map((release, index) => {
    let slug = published[index];
    if (!slug) {
      const base = releaseTitleSlug(release.title);
      slug = [base, `${base}-${release.year}`, `${base}-${release.releaseDate}`,
        `${base}-${release.albumType}-${release.releaseDate}`]
        .find(candidate => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate) && !used.has(candidate));
      if (!slug) throw new Error(`Choose a distinct readable release slug for: ${release.title}`);
      used.add(slug);
    }
    return { ...release, slug };
  });
}
