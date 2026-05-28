"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDiscord, FaYoutube, FaSpotify, FaTwitch, FaTwitter, FaInstagram } from "react-icons/fa";
import { useLanyard } from "react-use-lanyard";

const BADGES_MAP = [
  { flag: 1 << 0, name: "staff", label: "Discord Staff" },
  { flag: 1 << 1, name: "partner", label: "Partnered Server Owner" },
  { flag: 1 << 2, name: "hypesquad_events", label: "HypeSquad Events" },
  { flag: 1 << 3, name: "bug_hunter_level_1", label: "Bug Hunter Level 1" },
  { flag: 1 << 6, name: "hypesquad_bravery", label: "HypeSquad Bravery" },
  { flag: 1 << 7, name: "hypesquad_brilliance", label: "HypeSquad Brilliance" },
  { flag: 1 << 8, name: "hypesquad_balance", label: "HypeSquad Balance" },
  { flag: 1 << 9, name: "early_supporter", label: "Early Supporter" },
  { flag: 1 << 14, name: "bug_hunter_level_2", label: "Bug Hunter Level 2" },
  { flag: 1 << 17, name: "verified_developer", label: "Early Verified Developer" },
  { flag: 1 << 18, name: "certified_moderator", label: "Certified Moderator Alumni" },
  { flag: 1 << 22, name: "active_developer", label: "Active Developer" },
];

export default function SocialGrid() {
  // Replace with the user's actual Discord ID if known, or leave as a placeholder for them to inject.
  // 274178934143451137 is the user's Discord ID
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };
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

  const userFlags = lanyardData?.discord_user?.public_flags || 0;
  const activeBadges = BADGES_MAP.filter(badge => (userFlags & badge.flag) !== 0);

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
      href: "https://www.twitch.tv/okiso7/",
      status: "Follow", // Twitch generic until API integration
      statusColor: "bg-purple-500",
      color: "hover:bg-[#9146FF] hover:text-white dark:hover:bg-[#9146FF]",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      href: "https://www.youtube.com/@okiso7",
      status: "",
      color: "hover:bg-[#FF0000] hover:text-white dark:hover:bg-[#FF0000]",
    },
    {
      name: "Spotify",
      icon: FaSpotify,
      href: "https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm",
      status: "",
      color: "hover:bg-[#1DB954] hover:text-white dark:hover:bg-[#1DB954]",
    },
    {
      name: "X (Twitter)",
      icon: FaTwitter,
      href: "https://x.com/okisooo_",
      status: "",
      color: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://www.instagram.com/okisooo_/",
      status: "",
      color: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {/* EXCLUSIVE DISCORD EMBED WIDGET */}
      <button
        onClick={() => setIsDiscordModalOpen(true)}
        className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start justify-between p-6 md:p-8 rounded-[24px] bg-[#5865F2]/10 dark:bg-[#5865F2]/20 border-2 border-[#5865F2]/30 hover:border-[#5865F2] hover:shadow-[0_10px_40px_rgba(88,101,242,0.3)] transition-all duration-300 w-full h-full relative group text-left"
      >
        {/* Background Icon Detail */}
        <div className="absolute -top-10 -right-10 opacity-5 transition-transform duration-700 pointer-events-none group-hover:scale-110 group-hover:-rotate-12">
          <FaDiscord className="text-[250px] text-[#5865F2]" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 flex-1 min-w-0 w-full">
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
            <div className="flex flex-col text-center md:text-left flex-1 min-w-0 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                    <h3 className="font-black text-2xl md:text-3xl tracking-tight text-black dark:text-white">
                      {lanyardData?.discord_user?.global_name || (lanyardData?.discord_user as { display_name?: string })?.display_name || "OKISO"}
                    </h3>
                    {activeBadges.length > 0 && (
                      <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded-[8px] border border-black/5 dark:border-white/5 shrink-0">
                        {activeBadges.map(badge => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={badge.name}
                            src={`https://cdn.jsdelivr.net/gh/merlinfuchs/discord-badges/SVG/${badge.name}.svg`}
                            alt={badge.label}
                            title={badge.label}
                            className="w-5 h-5 object-contain"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Username Handle Pill */}
                  <div className="mt-1 flex justify-center md:justify-start">
                    <span className="text-xs md:text-sm font-bold text-black/50 dark:text-white/50 bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest border border-black/5 dark:border-white/5 shadow-sm">
                      {lanyardData?.discord_user?.username ? `@${lanyardData.discord_user.username}` : "@.oxo"}
                    </span>
                  </div>
                </div>

                {/* Join Server Action CTA Button - Desktop */}
                <div className="hidden md:block shrink-0 self-center">
                  <div className="flex items-center gap-2.5 bg-[#5865F2] text-white px-5 py-3 rounded-full font-black text-sm uppercase tracking-wider shadow-[0_4px_15px_rgba(88,101,242,0.35)] group-hover:bg-[#4752C4] group-hover:shadow-[0_4px_25px_rgba(88,101,242,0.55)] transition-all duration-300 border border-white/10">
                    <FaDiscord className="text-xl transition-transform group-hover:scale-110 group-hover:-rotate-6" />
                    <span>Join Server</span>
                  </div>
                </div>
              </div>

              {activityName ? (
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mt-4 bg-white/70 dark:bg-black/40 p-4 rounded-[16px] backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm transform group-hover:-translate-y-1 transition-transform duration-300 w-full">
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
        </div>

        {/* Join Server Action CTA Button - Mobile */}
        <div className="block md:hidden shrink-0 mt-6 z-10 w-full">
          <div className="flex items-center justify-center gap-2.5 bg-[#5865F2] text-white px-5 py-3 rounded-full font-black text-sm uppercase tracking-wider shadow-[0_4px_15px_rgba(88,101,242,0.35)] group-hover:bg-[#4752C4] group-hover:shadow-[0_4px_25px_rgba(88,101,242,0.55)] transition-all duration-300 border border-white/10">
            <FaDiscord className="text-xl transition-transform group-hover:scale-110 group-hover:-rotate-6" />
            <span>Join Server</span>
          </div>
        </div>
      </button>

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

      {/* DISCORD MODAL */}
      <AnimatePresence>
        {isDiscordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsDiscordModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-[#111] text-black dark:text-white w-full max-w-xl rounded-[24px] md:rounded-[40px] p-8 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-black/10 dark:border-white/10"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#5865F2] flex items-center gap-3">
                    <FaDiscord /> Discord
                  </h2>
                  <div className="w-16 h-2 bg-[#5865F2] mt-2"></div>
                </div>
                <button
                  onClick={() => setIsDiscordModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#5865F2] hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleCopy(".oxo", "discord")}
                  className="w-full flex items-center justify-between p-6 bg-black/5 dark:bg-white/5 hover:bg-[#5865F2] hover:text-white rounded-2xl md:rounded-[32px] transition-all group"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">Add Friend</span>
                    <span className="text-lg md:text-2xl font-black mt-1">.oxo</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    {copiedText === "discord" ? <span className="font-bold">✓</span> : <span className="font-bold text-xs md:text-sm tracking-widest">COPY</span>}
                  </div>
                </button>

                <a
                  href="https://discord.gg/okiso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-6 bg-black/5 dark:bg-white/5 hover:bg-[#5865F2] hover:text-white rounded-2xl md:rounded-[32px] transition-all group"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">Community</span>
                    <span className="text-lg md:text-2xl font-black mt-1">Join Server</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <FaDiscord className="text-xl transition-transform group-hover:scale-110 group-hover:-rotate-6" />
                  </div>
                </a>
              </div>
              
              <div className="mt-8 p-6 bg-black/5 dark:bg-white/5 rounded-2xl border-l-4 border-[#5865F2]">
                <p className="text-sm font-bold text-black/60 dark:text-white/60">
                  Join the community server to hang out, or add me directly!
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

