#!/usr/bin/env ts-node
import { config } from 'dotenv';
import { resolve } from 'path';
import { updateReleasesData } from '../src/lib/fetchSpotifyReleases';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

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
