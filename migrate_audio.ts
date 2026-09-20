import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { staticReleases } from './src/data/releases';

const trackPathsFile = path.join(__dirname, 'track_paths.txt');
const rawOutputFolder = 'D:\\Music\\OKISO_Discography';
const webOutputFolder = path.join(__dirname, 'public', 'audio');

// Ensure output folders exist
if (!fs.existsSync(rawOutputFolder)) {
    fs.mkdirSync(rawOutputFolder, { recursive: true });
}
if (!fs.existsSync(webOutputFolder)) {
    fs.mkdirSync(webOutputFolder, { recursive: true });
}

// Clean up old flat files in D:\Music\OKISO_Discography root
if (fs.existsSync(rawOutputFolder)) {
    const items = fs.readdirSync(rawOutputFolder);
    for (const item of items) {
        const fullPath = path.join(rawOutputFolder, item);
        if (fs.statSync(fullPath).isFile()) {
            console.log(`[CLEANUP] Removing flat file: ${item}`);
            fs.unlinkSync(fullPath);
        }
    }
}

// Helper to sanitize filenames
function sanitizeFileName(name: string) {
    return name.replace(/[\/\\?%*:|"<>]/g, '-').trim();
}

// Parse track_paths.txt into map
const titleMap = new Map<string, string>();
const lines = fs.readFileSync(trackPathsFile, 'utf-8').split('\n');

for (const line of lines) {
    if (!line.trim()) continue;

    const match = line.match(/^(.*?)(?::\s*|\s+)("?D:\\[^"]+"?)$/i);
    if (!match) {
        console.log(`[SKIP PARSE] Could not parse line: ${line}`);
        continue;
    }

    let trackTitleRaw = match[1].trim();
    let sourcePath = match[2].trim();

    if (sourcePath.startsWith('"') && sourcePath.endsWith('"')) {
        sourcePath = sourcePath.substring(1, sourcePath.length - 1);
    }

    const trackTitle = trackTitleRaw.replace(/\s\([^)]+\)$/, '').trim();
    titleMap.set(trackTitle.toLowerCase(), sourcePath);
}

console.log(`Loaded ${titleMap.size} track paths from track_paths.txt`);

let successCount = 0;
let skipCount = 0;

// List of tracks to force rewrite/reconvert (snippets, newly mapped, or fixed)
const forceRewriteTracks = [
    'meet the princess',
    'precious you',
    'crydie',
    'クライダイ',
    'これからって時に希望が見えるんだって',
    'love loop',
    'miku miku hatsune',
    'ミクミク初音',
    'リザレクション',
    '愛おしい'
];

for (const release of staticReleases) {
    const folderCategory = release.albumType === 'album' ? 'Albums' : 'Singles';
    const safeAlbumTitle = sanitizeFileName(release.title);
    const releaseFolder = path.join(rawOutputFolder, folderCategory, `${safeAlbumTitle} (${release.year})`);

    // Ensure directory for this release exists
    if (!fs.existsSync(releaseFolder)) {
        fs.mkdirSync(releaseFolder, { recursive: true });
    }

    const tracks = release.tracks || [];
    for (const track of tracks) {
        const trackTitle = track.title;
        const normalizedTitle = trackTitle.toLowerCase();
        const sourcePath = titleMap.get(normalizedTitle);

        if (!sourcePath || !fs.existsSync(sourcePath)) {
            console.log(`[MISSING SOURCE] No valid source found for: "${trackTitle}"`);
            skipCount++;
            continue;
        }

        const ext = path.extname(sourcePath).toLowerCase();
        const safeTitle = sanitizeFileName(trackTitle);
        const force = forceRewriteTracks.includes(normalizedTitle);

        // 1. Copy raw file to organized folder
        const trackNum = String(track.trackNumber || 1).padStart(2, '0');
        const rawDest = path.join(releaseFolder, `${trackNum}. ${safeTitle}${ext}`);
        
        if (!fs.existsSync(rawDest) || force) {
            console.log(`[COPY] ${trackTitle} -> ${folderCategory}/${safeAlbumTitle} (${release.year})`);
            fs.copyFileSync(sourcePath, rawDest);
        }

        // 2. Convert/copy to MP3 for the Web
        const webDest = path.join(webOutputFolder, `${safeTitle}.mp3`);
        
        if (!fs.existsSync(webDest) || force) {
            console.log(`[CONVERT] ${trackTitle} -> Web MP3`);
            try {
                if (ext === '.mp3' && !force) {
                    // Just copy if it's already an MP3 and not forced
                    fs.copyFileSync(sourcePath, webDest);
                } else {
                    // Use ffmpeg to convert to 192kbps MP3
                    execSync(`ffmpeg -i "${sourcePath}" -vn -ar 44100 -ac 2 -b:a 192k "${webDest}" -y`, { stdio: 'pipe' });
                }
                successCount++;
            } catch (e: any) {
                console.error(`[ERROR] Failed to process ${trackTitle}:`, e.message);
            }
        } else {
            successCount++;
        }
    }
}

console.log(`\nMigration complete! Successfully processed ${successCount} tracks. Skipped ${skipCount} tracks.`);
