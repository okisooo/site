#!/usr/bin/env ts-node
import { updateReleasesData } from '../src/lib/fetchSpotifyReleases';

async function main() {
  try {
    console.log('🎵 Starting Spotify releases update (TS)...');
    await updateReleasesData();
    console.log('✅ Releases updated successfully!');
  } catch (error) {
    console.error('❌ Error updating releases:', error);
    process.exit(1);
  }
}

main();
