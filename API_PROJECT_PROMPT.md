# OKISO API - Spotify Integration Prompt for Copilot

## Context
I need you to create a Spotify API endpoint for my music website. The main website is hosted on GitHub Pages (static), so I need a separate API hosted on Vercel to fetch my Spotify releases data.

## Project Requirements

### API Endpoint Specifications
- **Endpoint**: `/api/spotify/releases` 
- **Method**: GET
- **Response Format**: JSON
- **Caching**: 1 hour cache to respect Spotify rate limits
- **Error Handling**: Graceful fallback, always return valid JSON

### Spotify Integration Details
- **Artist ID**: `2FSh9530hmphpeK3QmDSPm` (OKISO on Spotify)
- **Data Needed**: Albums and singles from this artist
- **Authentication**: Client Credentials Flow (no user login needed)
- **Market**: US (can be adjusted)
- **Limit**: 50 releases (should cover all releases)

### Response Structure
```json
{
  "success": true,
  "releases": [
    {
      "title": "Album/Single Name",
      "year": "2025",
      "img": "https://spotify-image-url.jpg",
      "link": "https://open.spotify.com/album/...",
      "releaseDate": "2025-01-15",
      "albumType": "album" | "single"
    }
  ],
  "lastUpdated": "2025-08-02T10:30:00.000Z"
}
```

### Environment Variables Needed
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

### Technical Requirements
- **Platform**: Vercel (serverless functions)
- **Runtime**: Node.js
- **Framework**: Next.js API routes or Express.js
- **CORS**: Enable for my GitHub Pages domain
- **Rate Limiting**: Built-in protection
- **Error Handling**: Return fallback data if Spotify fails

### Main Website Integration
My website at `https://okiso.net` will call this API endpoint to:
1. Display latest release automatically
2. Show featured releases (top 3)
3. Populate full catalog grid
4. Update whenever I release new music

### Data Processing Required
1. Fetch from Spotify API using artist ID
2. Sort releases by date (newest first)
3. Transform to my required format
4. Cache response for 1 hour
5. Return consistent JSON structure

### Error Scenarios to Handle
- Spotify API down/rate limited
- Invalid credentials
- Network timeouts
- Artist not found
- No releases found

### Success Criteria
- Fast response times (<2 seconds)
- Reliable caching
- Graceful error handling
- CORS configured for GitHub Pages
- Works immediately after deployment

## Current Website Hook (For Reference)
My website currently has this hook expecting this exact API structure:
```typescript
const { releases, loading, error } = useSpotifyReleases();
// Will call: https://your-api-domain.vercel.app/api/spotify/releases
```

## Security Considerations
- API should be public (no authentication needed)
- Rate limiting to prevent abuse
- Environment variables for Spotify credentials
- CORS properly configured

## Deployment Instructions Needed
Please also provide:
1. How to deploy to Vercel
2. How to set environment variables on Vercel
3. How to get Spotify API credentials
4. How to test the endpoint

Create a complete, production-ready API that I can deploy immediately to Vercel and start using from my GitHub Pages website.
