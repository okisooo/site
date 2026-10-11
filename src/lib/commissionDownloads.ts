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
