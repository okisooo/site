export interface DownloadAsset { id: string; filename: string; format: string; bytes: number; artist: string; source: string; hasPreview: boolean; permissions: Record<string, string>; artworkId?: string; label?: string }
export interface ArtworkDownloads { id: string; artist: string; source: string; files: DownloadAsset[]; preview: DownloadAsset; title: string }
export function downloadLabel(format: string) {
  if (format === 'PSD') return 'Layered PSD';
  if (format === 'GIF') return 'Animation · GIF';
  return `Image · ${format === 'JPEG' ? 'JPG' : format}`;
}
export function groupDownloads(assets: DownloadAsset[]): ArtworkDownloads[] {
  const groups = new Map<string, DownloadAsset[]>();
  for (const asset of assets) {
    // Group only owner-recorded matches; filenames alone never combine variations.
    const key = `${asset.artist}\0${asset.source}\0${asset.artworkId || asset.id}`;
    const files = groups.get(key) || []; files.push(asset); groups.set(key, files);
  }
  return [...groups.entries()].map(([id, files]) => {
    files.sort((a, b) => Number(a.format === 'PSD') - Number(b.format === 'PSD'));
    const preview = files.find(f => f.hasPreview && f.format !== 'PSD') || files.find(f => f.hasPreview) || files[0];
    return { id, artist: preview.artist, source: preview.source, files, preview, title: preview.label || preview.filename.replace(/(?:\.output)?\.[^.]+$/, '') };
  });
}
// The API lists `thumbnailWidths` once it can serve small WebP thumbnails; an older API omits it.
export function thumbnailWidths(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((w): w is number => Number.isInteger(w) && w > 0 && w <= 4096))].sort((a, b) => a - b);
}
export interface PreviewSource { src: string; srcSet?: string; sizes?: string }
// Thumbnails when the API offers them, else (or after a failed thumbnail) the full display preview. Never an original.
export function previewSource(api: string, id: string, widths: number[], full = false): PreviewSource {
  const preview = `${api}/assets/${encodeURIComponent(id)}`;
  if (full || !widths.length) return { src: `${preview}/preview` };
  const at = (w: number) => `${preview}/thumbnail?w=${w}`;
  return { src: at(widths[0]), srcSet: widths.map(w => `${at(w)} ${w}w`).join(', '), sizes: '(max-width: 700px) 46vw, 300px' };
}
