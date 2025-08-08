# SPOTIFY RELEASES UPDATE SYSTEM - IMPLEMENTATION GUIDE

## 🚨 CRITICAL CONTEXT FOR PRIVATE API REPO COPILOT

**IMPORTANT**: You are working in the PRIVATE API repository. Your job is to create an update system that fetches Spotify data and updates the PUBLIC website repository.

## SITUATION

The user (OKISO) has:
- **PUBLIC REPO**: `okisooo/site` - Next.js website with static releases data
- **PRIVATE REPO**: This one - Where you need to build the API/update system
- **GOAL**: "Press a button to update releases" - Sync latest releases from Spotify

## PUBLIC REPO STRUCTURE (WHAT YOU'RE UPDATING)
```
okisooo/site/
├── src/
│   ├── data/
│   │   └── releases.ts          # ← TARGET FILE TO UPDATE
│   ├── lib/
│   │   └── fetchSpotifyReleases.ts  # ← UTILITY FUNCTIONS YOU CAN USE
│   └── app/releases/page.tsx    # Uses data from releases.ts
```

## YOUR JOB IN THIS PRIVATE REPO

### WHAT TO BUILD:
1. **API endpoint or script** that calls Spotify API
2. **GitHub Action** for manual "button press" trigger  
3. **Update mechanism** to modify `src/data/releases.ts` in public repo
4. **Auto-commit** changes to trigger Vercel deployment

### AVAILABLE RESOURCES:
- **Spotify API credentials** (in environment variables)
- **Utility functions** from public repo: `fetchSpotifyReleases()` and `updateReleasesData()`
- **GitHub token** for updating public repo
- **User's Spotify Artist ID**: `2FSh9530hmphpeK3QmDSPm`

## IMPLEMENTATION APPROACH

### Option 1: GitHub Action (RECOMMENDED)
Create workflow that:
1. **Triggers manually** from GitHub Actions UI
2. **Fetches releases** using Spotify API  
3. **Updates** `okisooo/site/src/data/releases.ts`
4. **Commits changes** to public repo
5. **Vercel auto-deploys** updated site

### Option 2: API Endpoint
Create API endpoint that:
1. **Receives webhook/manual call**
2. **Fetches and updates** public repo data
3. **Returns success/failure** status

## PUBLIC REPO FILES YOU NEED TO KNOW

### `src/data/releases.ts` - TARGET FILE
```typescript
export const staticReleases: Release[] = [
  // Array of 26 releases that needs updating
];
```

### `src/lib/fetchSpotifyReleases.ts` - UTILITY FUNCTIONS
```typescript
// You can import/copy these functions:
export async function fetchSpotifyReleases(artistId: string): Promise<Release[]>
export async function updateReleasesData(): Promise<void>
```

## EXPECTED WORKFLOW
1. User goes to **this private repo** → Actions → "Update Releases"  
2. Action fetches latest Spotify data
3. Action updates `okisooo/site/src/data/releases.ts`
4. **GitHub Pages automatically rebuilds and deploys** (via GitHub Action in public repo)
5. Website shows updated releases

## DEPLOYMENT INFO
- **Public repo hosting**: GitHub Pages (not Vercel)
- **Automatic rebuild**: GitHub Action triggers on `src/data/releases.ts` changes
- **Build process**: Next.js static export → GitHub Pages deployment

## ENVIRONMENT VARIABLES AVAILABLE
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`  
- `GITHUB_TOKEN` (for updating public repo)

---
**Your task**: Build the "button press" update system in THIS private repo that updates the PUBLIC repo's data file.
