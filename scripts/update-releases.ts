#!/usr/bin/env ts-node
import { config } from 'dotenv';
import { resolve } from 'path';
import { updateReleasesData } from '../src/lib/fetchSpotifyReleases';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env.toolost.local') });

async function main() {
  try {
    console.log('Starting release catalog sync...');
    await updateReleasesData();
    console.log('Release catalog synced successfully.');
  } catch (error) {
    console.error('Release catalog sync failed:', error);
    process.exit(1);
  }
}

main();
