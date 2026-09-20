const trackId = "3eCy6HPR031XDxDr910lrp"; // where are you now?
const url = `https://api.song.link/v1-alpha.1/links?url=spotify:track:${trackId}&userCountry=US`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("Odesli Match Results:");
    if (data.linksByPlatform && data.linksByPlatform.youtube) {
      console.log("YouTube URL:", data.linksByPlatform.youtube.url);
    } else {
      console.log("No YouTube link found via Odesli.");
    }
  })
  .catch(console.error);
