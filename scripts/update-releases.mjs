#!/usr/bin/env node

import { updateReleasesData } from '../src/lib/fetchSpotifyReleases.js';

async function main() {
  try {
    console.log('🎵 Starting Spotify releases update...');
    await updateReleasesData();
    console.log('✅ Releases updated successfully!');
  } catch (error) {
    console.error('❌ Error updating releases:', error);
    process.exit(1);
  }
}

main();
