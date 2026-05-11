const presence = new Presence({ clientId: "1503440465272373259" });

enum Assets {
  Logo = "https://okiso.net/icon.png",
}

const browsingTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async () => {
  const presenceData: PresenceData = {
    largeImageKey: Assets.Logo,
    largeImageText: "OKISO",
  };

  const pageElement = document.querySelector("[data-premid-page]");
  if (!pageElement) {
    return presence.setActivity();
  }

  const page = pageElement.getAttribute("data-premid-page");
  const isLive = document.querySelector("[data-premid-live='true']");
  const videoPlayer = document.querySelector("[data-premid-title]");

  if (page === "home") {
    if (isLive) {
      presenceData.details = "Watching a live stream";
      presenceData.state = "🔴 LIVE on Twitch";
      presenceData.startTimestamp = browsingTimestamp;
      presenceData.smallImageKey = "live";
      presenceData.smallImageText = "Live";
    } else if (videoPlayer) {
      const title = videoPlayer.getAttribute("data-premid-title");
      const currentTime = parseFloat(videoPlayer.getAttribute("data-premid-current-time") || "0");
      const duration = parseFloat(videoPlayer.getAttribute("data-premid-duration") || "0");
      const paused = videoPlayer.getAttribute("data-premid-paused") === "true";

      presenceData.details = "Watching a video";
      presenceData.state = `🎵 ${title}`;

      if (!paused && duration > 0 && presence.settings.showTimestamp) {
        const now = Math.floor(Date.now() / 1000);
        presenceData.startTimestamp = now - Math.floor(currentTime);
        presenceData.endTimestamp = presenceData.startTimestamp + Math.floor(duration);
      } else if (paused) {
        presenceData.smallImageKey = "pause";
        presenceData.smallImageText = "Paused";
      }
    } else {
      presenceData.details = "Browsing the site";
      presenceData.state = "okiso.net";
      presenceData.startTimestamp = browsingTimestamp;
    }
  } else if (page === "releases") {
    presenceData.details = "Browsing Archive";
    presenceData.state = "Interactive Discography";
    presenceData.startTimestamp = browsingTimestamp;
  } else if (page === "release") {
    const releaseTitle = pageElement.getAttribute("data-premid-release-title");
    presenceData.details = "Viewing Release";
    presenceData.state = `🎵 ${releaseTitle}`;
    presenceData.startTimestamp = browsingTimestamp;
  }

  presence.setActivity(presenceData);
});
