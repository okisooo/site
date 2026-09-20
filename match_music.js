const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Get all audio files from D:\Music
console.log("Scanning D:\\Music for audio files...");
let audioFiles = [];
try {
  // Using PowerShell to get all wav/mp3 recursively
  const out = execSync(`powershell -Command "Get-ChildItem -Path 'D:\\Music' -Include *.wav,*.mp3 -Recurse -File | Select-Object -ExpandProperty FullName"`, { encoding: 'utf-8' });
  audioFiles = out.split('\n').map(f => f.trim()).filter(f => f.length > 0);
} catch (err) {
  console.error("Failed to read D:\\Music:", err.message);
  process.exit(1);
}

console.log(`Found ${audioFiles.length} audio files.`);

// 2. Read track_paths.md
const mdPath = "C:\\Users\\samue\\.gemini\\antigravity\\brain\\bb38a79f-43c2-49a2-b44f-910c8cfc8783\\track_paths.md";
const mdContent = fs.readFileSync(mdPath, 'utf-8');
const lines = mdContent.split('\n');

// Normalization function for fuzzy matching
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

let updatedLines = [];
let matchedCount = 0;

for (let line of lines) {
  if (line.includes(':') && !line.startsWith('```') && !line.startsWith('#') && !line.startsWith('Please') && !line.startsWith('I\'ve') && !line.startsWith('If')) {
    const parts = line.split(':');
    const trackNames = parts[0].trim().split(' / ');
    let currentPath = parts.slice(1).join(':').trim();

    // Only try to match if it's currently blank
    if (currentPath === "") {
      let bestMatch = null;
      let bestScore = -1;

      // Check each possible title on this line
      for (let title of trackNames) {
        const isInstTitle = title.toLowerCase().includes('instrumental');
        const normTitle = normalize(title.replace(' - Instrumental', '').replace(' - Sped Up', '').replace(' - Slowed Down', ''));
        
        for (let file of audioFiles) {
          const fileName = path.basename(file);
          const isInstFile = fileName.toLowerCase().includes('inst');
          
          // Make sure we don't map instrumentals to non-instrumental tracks
          if (isInstTitle !== isInstFile) continue;

          const normFile = normalize(fileName.replace('.wav', '').replace('.mp3', ''));
          
          // Simple substring match first
          if (normFile.includes(normTitle) || normTitle.includes(normFile)) {
            // Found a match!
            // Give preference to exact matches or shortest strings (less junk)
            const score = 100 - Math.abs(normFile.length - normTitle.length);
            if (score > bestScore) {
              bestScore = score;
              bestMatch = file;
            }
          }
        }
      }

      if (bestMatch) {
        currentPath = bestMatch;
        matchedCount++;
        // Remove the matched file from the pool to avoid assigning same file to multiple tracks (mostly)
        // audioFiles = audioFiles.filter(f => f !== bestMatch); 
      }
    }
    
    updatedLines.push(`${parts[0]}: ${currentPath}`);
  } else {
    updatedLines.push(line);
  }
}

// Write back to track_paths.md
fs.writeFileSync(mdPath, updatedLines.join('\n'), 'utf-8');
console.log(`Successfully auto-mapped ${matchedCount} tracks!`);
