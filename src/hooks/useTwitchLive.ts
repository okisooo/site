import { useState, useEffect } from 'react';

export function useTwitchLive(channel: string) {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // decapi is a free open API that bypasses Twitch OAuth requirements for simple status queries
    fetch(`https://decapi.me/twitch/uptime/${channel}`)
      .then(res => res.text())
      .then(text => {
        // If the channel is offline, the API returns "Channel is not live" or "offline"
        const isOffline = text.toLowerCase().includes("offline") || text.toLowerCase().includes("not live");
        setIsLive(!isOffline);
      })
      .catch(() => setIsLive(false));
  }, [channel]);

  return { isLive };
}
