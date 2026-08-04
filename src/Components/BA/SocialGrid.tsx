"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      status: "Follow",
      statusColor: "bg-[var(--tac-signal)]",
      iconColor: "text-[#9146FF]",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      href: "https://www.youtube.com/@okiso7",
      status: "",
      iconColor: "text-[#FF0000]",
    },
    {
      name: "Spotify",
      icon: FaSpotify,
      href: "https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm",
      status: "",
      iconColor: "text-[#1DB954]",
    },
    {
      name: "X (Twitter)",
      icon: FaTwitter,
      href: "https://x.com/okisooo_",
      status: "",
      iconColor: "text-[var(--tac-ink)]",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://www.instagram.com/okisooo_/",
      status: "",
      iconColor: "text-[#E4405F]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {/* EXCLUSIVE DISCORD EMBED WIDGET */}
      <button
        onClick={() => setIsDiscordModalOpen(true)}
        className="tac-plate col-span-1 md:col-span-2 flex flex-col items-center md:items-start justify-between p-6 md:p-8 hover:border-[var(--tac-signal)] transition-colors duration-200 w-full h-full relative group text-left"
      >
        {/* Background Icon Detail */}
        <div className="absolute -top-10 -right-10 opacity-5 transition-transform duration-700 pointer-events-none group-hover:scale-105">
          <FaDiscord className="text-[250px] text-[#5865F2]" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 flex-1 min-w-0 w-full">
            {/* Avatar Area */}
            <div className="relative shrink-0 mt-1">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20 bg-black/20">
                {lanyardData ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Discord Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[var(--tac-steel)]/20 animate-pulse" />
                )}
              </div>
              {lanyardData && (
                <div className={`absolute bottom-0 right-1 w-4 h-4 border-2 border-[var(--tac-bone)] dark:border-[#0c0c0e] ${discordStatusColor}`} />
              )}
            </div>

            {/* User Info & Rich Presence */}
            <div className="flex flex-col text-center md:text-left flex-1 min-w-0 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                    <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight uppercase text-[var(--tac-ink)]">
                      {lanyardData?.discord_user?.global_name || (lanyardData?.discord_user as { display_name?: string })?.display_name || "OKISO"}
                    </h3>
                    {activeBadges.length > 0 && (
                      <div className="flex items-center gap-1 bg-[var(--tac-steel)]/10 px-1.5 py-0.5 border border-[var(--tac-steel)]/20 shrink-0">
                        {activeBadges.map(badge => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={badge.name}
                            src={`https://cdn.jsdelivr.net/gh/merlinfuchs/discord-badges/SVG/${badge.name}.svg`}
                            alt={badge.label}
                            title={badge.label}
                            className="w-4 h-4 object-contain"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Username Handle Pill */}
                  <div className="mt-1 flex justify-center md:justify-start">
                    <span className="tac-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--tac-steel)] border border-[var(--tac-steel)]/25 px-2.5 py-1">
                      {lanyardData?.discord_user?.username ? `@${lanyardData.discord_user.username}` : "@.oxo"}
                    </span>
                  </div>
                </div>

                {/* Join Server Action CTA Button - Desktop */}
                <div className="hidden md:block shrink-0 self-center">
                  <div className="flex items-center gap-2.5 bg-[var(--tac-ink)] text-[var(--tac-bone)] dark:bg-[var(--tac-bone)] dark:text-[var(--tac-ink)] px-5 py-3 tac-mono font-bold text-xs uppercase tracking-[0.2em] border border-current group-hover:bg-[var(--tac-signal)] group-hover:text-white dark:group-hover:bg-[var(--tac-signal)] dark:group-hover:text-white transition-colors duration-200">
                    <FaDiscord className="text-lg text-[#5865F2] group-hover:text-white transition-colors" />
                    <span>Join Server</span>
                  </div>
                </div>
              </div>

              {activityName ? (
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mt-4 bg-[var(--tac-ink)]/5 dark:bg-[var(--tac-bone)]/5 p-4 border border-[var(--tac-ink)]/15 dark:border-[var(--tac-bone)]/15 w-full">
                  {activityImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activityImage} alt={activityName} className="w-16 h-16 md:w-20 md:h-20 object-cover border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20 shrink-0" />
                  )}
                  <div className="flex flex-col text-sm overflow-hidden text-center md:text-left justify-center min-h-[4rem]">
                    <span className="tac-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--tac-signal)] mb-1">{activityTypeStr}</span>
                    <span className="font-display font-bold text-sm uppercase tracking-tight text-[var(--tac-ink)] truncate max-w-[250px] md:max-w-full" title={activityName}>{activityName}</span>
                    {activityDetails && <span className="tac-mono text-[10px] uppercase tracking-[0.15em] text-[var(--tac-steel)] truncate max-w-[250px] md:max-w-full" title={activityDetails}>{activityDetails}</span>}
                    {activityState && <span className="tac-mono text-[10px] uppercase tracking-[0.15em] text-[var(--tac-steel)] truncate max-w-[250px] md:max-w-full" title={activityState}>{activityState}</span>}
                  </div>
                </div>
              ) : (
                <div className="mt-3 tac-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--tac-steel)] flex items-center justify-center md:justify-start gap-2">
                  <span className={`w-2 h-2 ${discordStatusColor} ${isDiscordOnline ? "animate-pulse" : ""}`} />
                  {isDiscordOnline ? "Online and vibing." : "Currently offline."}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Join Server Action CTA Button - Mobile */}
        <div className="block md:hidden shrink-0 mt-6 z-10 w-full">
          <div className="flex items-center justify-center gap-2.5 bg-[var(--tac-ink)] text-[var(--tac-bone)] dark:bg-[var(--tac-bone)] dark:text-[var(--tac-ink)] px-5 py-3 tac-mono font-bold text-xs uppercase tracking-[0.2em] border border-current group-hover:bg-[var(--tac-signal)] group-hover:text-white transition-colors duration-200">
            <FaDiscord className="text-lg text-[#5865F2] group-hover:text-white transition-colors" />
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
          className="tac-plate flex items-center justify-between p-4 md:p-6 w-full h-full relative group border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 hover:border-[var(--tac-signal)] transition-colors duration-200 text-left"
        >
          <div className="flex items-center gap-4 relative z-10">
            <link.icon className={`text-2xl md:text-3xl ${link.iconColor} transition-transform duration-200 group-hover:scale-105`} />
            <span className="font-display font-bold text-base md:text-lg uppercase tracking-tight text-[var(--tac-ink)]">{link.name}</span>
          </div>

          {link.status && (
            <div className="flex items-center gap-2 bg-[var(--tac-ink)]/5 dark:bg-[var(--tac-bone)]/5 px-3 py-1 border border-[var(--tac-steel)]/30 relative z-10">
              <span className={`w-2 h-2 ${link.statusColor} ${(link.statusColor || '').includes('signal') ? 'animate-pulse' : ''}`} />
              <span className="tac-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--tac-steel)]">{link.status}</span>
            </div>
          )}
        </a>
      ))}

      {/* DISCORD MODAL */}
      {mounted && createPortal(
        <AnimatePresence>
        {isDiscordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => setIsDiscordModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="tac-plate relative bg-[var(--tac-bone)] dark:bg-[#0c0c0e] text-[var(--tac-ink)] w-full max-w-xl p-8 md:p-12 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="tac-sec-head">
                    <span className="tac-sec-index">004</span>
                    <span className="tac-rule" />
                    <span className="tac-sec-label">DISCORD // COMMUNITY</span>
                  </div>
                  <h2 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tighter text-[var(--tac-ink)] flex items-center gap-3">
                    <FaDiscord className="text-[#5865F2]" /> DISCORD
                  </h2>
                </div>
                <button
                  onClick={() => setIsDiscordModalOpen(false)}
                  className="w-10 h-10 border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20 flex items-center justify-center hover:bg-[var(--tac-signal)] hover:border-[var(--tac-signal)] hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleCopy(".oxo", "discord")}
                  className="w-full flex items-center justify-between p-5 md:p-6 border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20 bg-[var(--tac-ink)]/5 dark:bg-[var(--tac-bone)]/5 hover:border-[var(--tac-signal)] transition-colors group text-left"
                >
                  <div className="flex flex-col items-start">
                    <span className="tac-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--tac-steel)]">Add Friend</span>
                    <span className="font-display font-bold text-lg md:text-2xl uppercase tracking-tight mt-1 text-[var(--tac-ink)]">.oxo</span>
                  </div>
                  <div className="w-10 h-10 border border-[var(--tac-steel)]/30 flex items-center justify-center tac-mono text-xs font-bold uppercase tracking-wider text-[var(--tac-ink)]">
                    {copiedText === "discord" ? <span>✓</span> : <span>COPY</span>}
                  </div>
                </button>

                <a
                  href="https://discord.gg/okiso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-5 md:p-6 border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20 bg-[var(--tac-ink)]/5 dark:bg-[var(--tac-bone)]/5 hover:border-[var(--tac-signal)] transition-colors group text-left"
                >
                  <div className="flex flex-col items-start">
                    <span className="tac-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--tac-steel)]">Community</span>
                    <span className="font-display font-bold text-lg md:text-2xl uppercase tracking-tight mt-1 text-[var(--tac-ink)]">Join Server</span>
                  </div>
                  <div className="w-10 h-10 border border-[var(--tac-steel)]/30 flex items-center justify-center text-[var(--tac-ink)]">
                    <FaDiscord className="text-xl text-[#5865F2]" />
                  </div>
                </a>
              </div>
              
              <div className="mt-8 p-4 md:p-6 border-l-2 border-[var(--tac-signal)] bg-[var(--tac-ink)]/5 dark:bg-[var(--tac-bone)]/5">
                <p className="tac-mono text-[10px] uppercase tracking-[0.15em] text-[var(--tac-steel)]">
                  Join the community server to hang out, or add me directly!
                </p>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

