# OKISO Website - Spotify API Setup

## Overview
Your website now automatically fetches release data from Spotify! This means:
- ✅ Latest releases automatically appear
- ✅ No manual updating needed
- ✅ Always shows correct album artwork
- ✅ Direct links to Spotify
- ✅ Fallback to static data if API fails

## Setup Instructions

### 1. Get Spotify API Credentials
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in:
   - App name: "OKISO Website"
   - App description: "Personal website for OKISO music releases"
   - Website: "https://okiso.net"
   - Redirect URI: Leave blank (not needed for client credentials)
5. Check the boxes and click "Save"
6. Click on your new app
7. Go to "Settings"
8. Copy your **Client ID** and **Client Secret**

### 2. Add Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Replace the placeholder values:
   ```
   SPOTIFY_CLIENT_ID=your_actual_client_id_here
   SPOTIFY_CLIENT_SECRET=your_actual_client_secret_here
   ```

### 3. Test the Integration
1. Restart your development server: `npm run dev` or `yarn dev`
2. Go to `/releases` page
3. You should see your actual Spotify releases!

## How It Works

### API Endpoint
- **Route**: `/api/spotify`
- **Method**: GET
- **Cache**: 1 hour (to respect Spotify rate limits)
- **Fallback**: Static data if API fails

### Data Flow
1. Page loads → Hook calls `/api/spotify`
2. API gets Spotify access token
3. API fetches your artist albums
4. Data is sorted by release date (newest first)
5. Page displays the data
6. If anything fails, fallback static data is used

### Artist ID
The API uses your Spotify artist ID: `2FSh9530hmphpeK3QmDSPm`
If this changes, update it in `/src/app/api/spotify/route.ts`

## Features

### Latest Release Section
- Shows your newest release automatically
- Dynamic title, year, and artwork
- Direct Spotify link

### Featured Releases
- Shows top 3 most recent releases
- Scrollable on mobile
- All with current artwork and links

### Full Catalog
- Shows all your releases
- Grid layout on desktop
- Automatic updates when you release new music

## Troubleshooting

### API Not Working?
1. Check your `.env.local` file exists and has correct credentials
2. Restart the development server
3. Check browser console for errors
4. Verify your Spotify app is set up correctly

### Missing Releases?
- The API fetches albums and singles from Spotify
- If a release isn't showing, check it's properly distributed to Spotify
- The API filters by market (US) - this can be changed in the code

### Need to Update Artist ID?
If your Spotify artist ID changes, update it in:
`/src/app/api/spotify/route.ts` line 29

## Next Steps

### Production Deployment
When deploying to production (Vercel, Netlify, etc.):
1. Add the environment variables to your hosting platform
2. The API will automatically work in production
3. Data will be cached for better performance

### Optional Enhancements
- Add Apple Music API integration
- Include track listings
- Add release descriptions from Spotify
- Show play counts or popularity data
- Add search functionality

Your releases page will now stay automatically updated! 🎵
