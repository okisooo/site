"use client";

import React from "react";
import { FaDiscord, FaYoutube, FaSpotify, FaTwitch, FaTwitter, FaInstagram } from "react-icons/fa";
import { useLanyard } from "react-use-lanyard";

export default function SocialGrid() {
  // Replace with the user's actual Discord ID if known, or leave as a placeholder for them to inject.
  // Using a known Dev ID for demonstration if needed, or prompt the user.
  // 274178934143451137 is the user's Discord ID
  const { data: lanyardResponse } = useLanyard({
    userId: "274178934143451137", // User's actual ID
  });

  const lanyardData = lanyardResponse?.data;
  const isDiscordOnline = lanyardData?.discord_status && lanyardData.discord_status !== "offline";
  const discordStatusColor = lanyardData?.discord_status === 'online' ? 'bg-green-500' : 
                             lanyardData?.discord_status === 'idle' ? 'bg-yellow-500' : 
                             lanyardData?.discord_status === 'dnd' ? 'bg-red-500' : 'bg-gray-500';

  const avatarUrl = lanyardData?.discord_user 
    ? `https://cdn.discordapp.com/avatars/${lanyardData.discord_user.id}/${lanyardData.discord_user.avatar}.png?size=128` 
    : '/icon.png';

  let activityTypeStr = "";
  let activityName = "";
  let activityDetails = "";
  let activityState = "";
  let activityImage = "";

  if (lanyardData?.spotify) {
    activityTypeStr = "Listening to Spotify";
    activityName = lanyardData.spotify.song;
    activityDetails = "by " + lanyardData.spotify.artist;
    activityState = "on " + lanyardData.spotify.album;
    activityImage = lanyardData.spotify.album_art_url;
  } else if (lanyardData?.activities && lanyardData.activities.length > 0) {
    const activity = lanyardData.activities.find(a => a.type !== 4) || lanyardData.activities[0];
    
    if (activity.type === 0) activityTypeStr = "Playing";
    else if (activity.type === 2) activityTypeStr = "Listening to";
    else if (activity.type === 3) activityTypeStr = "Watching";
    else if (activity.type === 4) activityTypeStr = "Custom Status";
    else activityTypeStr = "Playing";

    activityName = activity.name;
    activityDetails = activity.details || "";
    activityState = activity.state || "";

    if (activity.assets?.large_image) {
      if (activity.assets.large_image.startsWith("mp:external/")) {
        activityImage = activity.assets.large_image.replace("mp:external/", "https://media.discordapp.net/external/");
      } else {
        activityImage = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
      }
    }
  }

  const links = [
    {
      name: "Twitch",
      icon: FaTwitch,
      href: "https://twitch.tv/okiso",
      status: "Follow", // Twitch generic until API integration
      statusColor: "bg-purple-500",
      color: "hover:bg-[#9146FF] hover:text-white dark:hover:bg-[#9146FF]",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      href: "https://youtube.com/okiso",
      status: "",
      color: "hover:bg-[#FF0000] hover:text-white dark:hover:bg-[#FF0000]",
    },
    {
      name: "Spotify",
      icon: FaSpotify,
      href: "https://spotify.com/okiso",
      status: "",
      color: "hover:bg-[#1DB954] hover:text-white dark:hover:bg-[#1DB954]",
    },
    {
      name: "X (Twitter)",
      icon: FaTwitter,
      href: "https://twitter.com/okiso",
      status: "",
      color: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://instagram.com/okiso",
      status: "",
      color: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {/* EXCLUSIVE DISCORD EMBED WIDGET */}
      <a
        href="https://discord.gg/okiso"
        target="_blank"
        rel="noopener noreferrer"
        className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center md:items-start justify-between p-6 md:p-8 rounded-[24px] bg-[#5865F2]/10 dark:bg-[#5865F2]/20 border-2 border-[#5865F2]/30 hover:border-[#5865F2] hover:shadow-[0_10px_40px_rgba(88,101,242,0.3)] transition-all duration-300 w-full h-full relative group"
      >
        {/* Background Icon Detail */}
          <div className="absolute -top-10 -right-10 opacity-5 transition-transform duration-700 pointer-events-none group-hover:scale-110 group-hover:-rotate-12">
            <FaDiscord className="text-[250px] text-[#5865F2]" />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 w-full">
            {/* Avatar Area */}
            <div className="relative shrink-0 mt-2">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white dark:border-ba-dark bg-black/20 shadow-lg">
                {lanyardData ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Discord Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-500/30 animate-pulse" />
                )}
              </div>
              {lanyardData && (
                <div className={`absolute bottom-0 right-1 w-6 h-6 rounded-full border-4 border-white dark:border-ba-dark ${discordStatusColor} shadow-md`} />
              )}
            </div>

            {/* User Info & Rich Presence */}
            <div className="flex flex-col text-center md:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h3 className="font-black text-2xl md:text-3xl tracking-tight text-black dark:text-white">
                  {lanyardData?.discord_user?.global_name || lanyardData?.discord_user?.username || "Fetching Profile..."}
                </h3>
                <span className="text-xs md:text-sm font-bold text-black/50 dark:text-white/50 bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest border border-black/5 dark:border-white/5">
                  OKISO
                </span>
              </div>

              {activityName ? (
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mt-4 bg-white/70 dark:bg-black/40 p-4 rounded-[16px] backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm transform group-hover:-translate-y-1 transition-transform duration-300">
                  {activityImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activityImage} alt={activityName} className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-md shrink-0" />
                  )}
                  <div className="flex flex-col text-sm overflow-hidden text-center md:text-left justify-center min-h-[4rem]">
                    <span className="text-xs font-black uppercase tracking-wider text-[#5865F2] mb-1">{activityTypeStr}</span>
                    <span className="font-bold text-black dark:text-white truncate max-w-[250px] md:max-w-full" title={activityName}>{activityName}</span>
                    {activityDetails && <span className="text-black/70 dark:text-white/70 truncate max-w-[250px] md:max-w-full" title={activityDetails}>{activityDetails}</span>}
                    {activityState && <span className="text-black/50 dark:text-white/50 truncate max-w-[250px] md:max-w-full" title={activityState}>{activityState}</span>}
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-sm md:text-base font-bold text-black/50 dark:text-white/50 flex items-center justify-center md:justify-start gap-2">
                  <span className={`w-2 h-2 rounded-full ${discordStatusColor} animate-pulse`} />
                  {isDiscordOnline ? "Online and vibing." : "Currently offline."}
                </div>
              )}
            </div>
          </div>
      </a>

      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-[20px] md:rounded-[24px] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 transition-all duration-300 ${link.color} flex items-center justify-between p-4 md:p-6 w-full h-full relative group`}
        >
          <div className="flex items-center gap-4 relative z-10">
              <link.icon className="text-2xl md:text-3xl transition-transform group-hover:scale-110 group-hover:-rotate-6" />
              <span className="font-bold text-lg md:text-xl">{link.name}</span>
            </div>

            {link.status && (
              <div className="flex items-center gap-2 bg-white/50 dark:bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full relative z-10 border border-black/5 dark:border-white/5">
                <span className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full ${link.statusColor} ${(link.statusColor || '').includes('green') ? 'animate-pulse shadow-[0_0_10px_currentColor]' : ''}`} />
                <span className="text-xs md:text-sm font-bold tracking-wider uppercase">{link.status}</span>
              </div>
            )}
        </a>
      ))}
    </div>
  );
}

