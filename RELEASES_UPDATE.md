# 🎵 Spotify Releases Auto-Update

This system allows you to automatically update your website's releases from Spotify with the press of a button!

## 🚀 Quick Setup

### 1. Get Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app (or use existing one)
3. Copy your **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
API_UPDATE_TOKEN=your_secure_random_token_here  # Optional, for API security
```

### 3. GitHub Secrets (for GitHub Actions)

Add these secrets to your GitHub repository:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

Go to: Repository Settings → Secrets and variables → Actions → New repository secret

## 🎯 How to Update Releases

### Method 1: GitHub Actions (Recommended)

1. Go to your repository on GitHub
2. Click on **"Actions"** tab
3. Find **"Update Spotify Releases"** workflow
4. Click **"Run workflow"** button
5. Click the green **"Run workflow"** button

The action will:
- ✅ Fetch latest releases from Spotify
- ✅ Update the data file
- ✅ Commit changes automatically
- ✅ Trigger a new deployment

### Method 2: Local Command

Run locally in your terminal:

```bash
npm run update-releases
```

Then commit and push the changes:

```bash
git add src/data/releases.ts
git commit -m "🎵 Update releases data"
git push
```

### Method 3: API Endpoint

Call the API endpoint directly:

```bash
curl -X POST https://your-domain.com/api/spotify/update \
  -H "Authorization: Bearer your_api_token"
```

## 📁 What Gets Updated

The system updates the file `src/data/releases.ts` with:
- ✅ Latest album artwork
- ✅ Updated metadata
- ✅ New releases
- ✅ Proper sorting (newest first)

## 🔄 How It Works

1. **Fetches** all your albums/singles from Spotify API
2. **Transforms** the data to match your website format
3. **Updates** the static data file
4. **Preserves** fast loading (static approach)
5. **Commits** changes automatically (GitHub Actions)

## 🛠️ Customization

### Change Artist ID

Edit `src/lib/fetchSpotifyReleases.ts` and update the default artist ID:

```typescript
export async function fetchSpotifyReleases(artistId: string = 'YOUR_ARTIST_ID') {
```

### Automatic Updates

Uncomment the schedule section in `.github/workflows/update-releases.yml`:

```yaml
schedule:
  - cron: '0 6 * * *'  # Daily at 6 AM UTC
```

### Add Authentication

The API endpoint supports bearer token authentication. Set `API_UPDATE_TOKEN` in your environment variables.

## 🐛 Troubleshooting

### "No releases found"
- Check your Spotify Artist ID
- Verify your API credentials
- Make sure your releases are published on Spotify

### "Unauthorized" error
- Verify your Spotify credentials
- Check environment variables are set correctly

### GitHub Action fails
- Ensure secrets are added to your repository
- Check the Actions logs for specific errors

## 📋 Files Changed

- `src/data/releases.ts` - Your releases data
- `src/lib/fetchSpotifyReleases.ts` - Spotify API integration
- `src/app/api/spotify/update/route.ts` - API endpoint
- `.github/workflows/update-releases.yml` - GitHub Action
- `scripts/update-releases.mjs` - Local update script

## 🎉 Benefits

- **⚡ Fast Loading**: Still uses static data for instant page loads
- **🔄 Easy Updates**: Just press a button to sync with Spotify
- **🤖 Automated**: Can run on schedule or manual trigger
- **🎨 Always Fresh**: Artwork and metadata always up-to-date
- **📱 No Downtime**: Updates happen in background
