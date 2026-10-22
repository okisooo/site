"use client";

import { useContext, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { useLanyard, type LanyardData } from "react-use-lanyard";
import { AmbientMotionContext } from "./AmbientMotion";
import { EditorialDialog } from "./EditorialDialog";

const BADGES = [
  { flag: 1 << 0, name: "staff", label: "Discord Staff" },
  { flag: 1 << 1, name: "partnered_server_owner", label: "Partnered Server Owner" },
  { flag: 1 << 2, name: "hypesquad_events", label: "HypeSquad Events" },
  { flag: 1 << 3, name: "bug_hunter_level_1", label: "Bug Hunter Level 1" },
  { flag: 1 << 6, name: "hypesquad_bravery", label: "HypeSquad Bravery" },
  { flag: 1 << 7, name: "hypesquad_brilliance", label: "HypeSquad Brilliance" },
  { flag: 1 << 8, name: "hypesquad_balance", label: "HypeSquad Balance" },
  { flag: 1 << 9, name: "early_supporter", label: "Early Supporter" },
  { flag: 1 << 14, name: "bug_hunter_level_2", label: "Bug Hunter Level 2" },
  { flag: 1 << 17, name: "early_verified_developer", label: "Early Verified Developer" },
  { flag: 1 << 18, name: "certified_moderator", label: "Certified Moderator Alumni" },
  { flag: 1 << 22, name: "active_developer", label: "Active Developer" },
];

const DISCORD_USER_ID = "274178934143451137";
const BADGE_CDN = "https://cdn.jsdelivr.net/gh/merlinfuchs/discord-badges/SVG";
const PROFILE_BADGE_CDN = "https://cdn.jsdelivr.net/gh/dev-hoehle/discord-badges@b97b49091bb08175ae56a11bf4f4a42d52d12380/png";
type ProfileBadge = { id: string; label: string; src: string };

// Profile-only badges matched to the owner's 2026-09-30 screenshot.
// Follow-up tooltips confirm Meadow level 100 and Gifting Legend; these are not live.
// Subscription dates and the old discriminator remain unspecified.
const MANUAL_BADGES: ProfileBadge[] = [
  { id: "nitro", label: "Discord Nitro", src: `${PROFILE_BADGE_CDN}/nitro_ruby.png` },
  { id: "boost", label: "Server Booster", src: `${PROFILE_BADGE_CDN}/boost_18_months.png` },
  { id: "legacy_username", label: "Legacy Username", src: `${PROFILE_BADGE_CDN}/originally_known_as.png` },
  { id: "quest", label: "Completed a Quest", src: `${PROFILE_BADGE_CDN}/complete_a_quest.png` },
  { id: "last_meadow", label: "Last Meadow Online · Level 100 Reached", src: `${PROFILE_BADGE_CDN}/last_meadow.png` },
  { id: "orbs", label: "Orbs Apprentice", src: `${PROFILE_BADGE_CDN}/orbs_apprentice.png` },
  { id: "gifting", label: "Gifting · Legend", src: `${PROFILE_BADGE_CDN}/gifting_legend.png` },
];

// The global Vencord list is ~200 KB; this session keeps our own entries for the refresh interval.
const BADGE_CACHE = "okiso:vencord-badges", BADGE_REFRESH_MS = 30 * 60 * 1000;

function readVencordBadges(entries: unknown) {
  const badges: ProfileBadge[] = [];
  if (!Array.isArray(entries)) return badges;
  for (const entry of entries) {
    if (typeof entry?.badge !== "string" || typeof entry?.tooltip !== "string") continue;
    let url: URL;
    try { url = new URL(entry.badge, "https://badges.vencord.dev"); } catch { continue; }
    if (url.origin !== "https://badges.vencord.dev" || !url.pathname.startsWith(`/badges/${DISCORD_USER_ID}/`)) continue;
    if (badges.some((badge) => badge.src === url.href)) continue;
    badges.push({ id: `vencord:${url.href}`, src: url.href, label: `Vencord · ${entry.tooltip}` });
  }
  return badges;
}

/** Until the watch section nears the viewport the card shows the static profile and requests nothing. */
export default function DiscordPresence({ live = true }: { live?: boolean }) {
  return live ? <LivePresence /> : <PresenceCard />;
}

function LivePresence() {
  const { data: response } = useLanyard({ userId: DISCORD_USER_ID });
  const [badges, setBadges] = useState<ProfileBadge[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    async function refreshBadges() {
      try {
        const response = await fetch("https://badges.vencord.dev/badges.json", { signal: controller.signal });
        if (!response.ok) return;
        const feed = await response.json();
        const entries: unknown = feed?.[DISCORD_USER_ID];
        if (!Array.isArray(entries)) return;
        try { sessionStorage.setItem(BADGE_CACHE, JSON.stringify({ at: Date.now(), entries })); } catch { /* storage is optional */ }
        if (!controller.signal.aborted) setBadges(readVencordBadges(entries));
      } catch {
        // Keep the last successful set when the optional badge feed is unavailable.
      }
    }
    let cached: { at?: number; entries?: unknown } | null = null;
    try { cached = JSON.parse(sessionStorage.getItem(BADGE_CACHE) ?? "null"); } catch { /* storage is optional */ }
    const age = Date.now() - (cached?.at ?? 0), fresh = age >= 0 && age < BADGE_REFRESH_MS;
    if (fresh) setBadges(readVencordBadges(cached?.entries));
    let interval = 0;
    const first = window.setTimeout(() => {
      void refreshBadges();
      interval = window.setInterval(() => { void refreshBadges(); }, BADGE_REFRESH_MS);
    }, fresh ? BADGE_REFRESH_MS - age : 0);
    return () => { controller.abort(); window.clearTimeout(first); window.clearInterval(interval); };
  }, []);
  return <PresenceCard live data={response?.data} vencordBadges={badges} />;
}

function PresenceCard({ live = false, data, vencordBadges = [] }: { live?: boolean; data?: LanyardData; vencordBadges?: ProfileBadge[] }) {
  const ambient = useContext(AmbientMotionContext);
  const [open, setOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const profile = data?.discord_user;
  const displayName = profile?.global_name || "OKISO";
  const handle = profile?.username || ".oxo";
  const avatarFormat = ambient && profile?.avatar?.startsWith("a_") ? "gif" : "png";
  const avatar = profile?.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${avatarFormat}?size=128` : "/icon.png";
  const decoration = profile?.avatar_decoration_data?.asset;
  const publicBadges = BADGES.filter((badge) => ((profile?.public_flags || 0) & badge.flag) !== 0)
    .map((badge) => ({ id: badge.name, label: badge.label, src: `${BADGE_CDN}/${badge.name}.svg` }));
  const badges = [...vencordBadges, MANUAL_BADGES[0], ...publicBadges, ...MANUAL_BADGES.slice(1)]
    .filter((badge, index, all) => all.findIndex((other) => other.id === badge.id) === index);
  const customStatus = data?.activities?.find((item) => item.type === 4)?.state;
  const activity = data?.activities?.find((item) => item.type !== 4);
  const status = data?.discord_status;
  const statusLabel = status === "online" ? "online" : status === "idle" ? "away" : status === "dnd" ? "do not disturb" : status === "offline" ? "offline" : "discord profile";
  const portrait = <span className="ed-discord-avatar">
    {/* Before the presence loads, a blank disc stands in, so the large fallback icon is never fetched just to be replaced. */}
    {live ? <img className="ed-discord-avatar-image" src={avatar} alt={`${displayName}’s Discord avatar`} width="80" height="80" loading="lazy" decoding="async" /> : <span className="ed-discord-avatar-image" />}
    {ambient && decoration && <img className="ed-discord-decoration" src={`https://cdn.discordapp.com/avatar-decoration-presets/${decoration}.png`} alt="" width="96" height="96" loading="lazy" decoding="async" />}
    {status && <span className="ed-discord-status" data-status={status} role="img" aria-label={statusLabel} title={statusLabel} />}
  </span>;
  const profileBadges = badges.length > 0 && <span className="ed-discord-badges">{badges.map((badge) =>
    <img key={badge.id} src={badge.src} alt={badge.label} title={badge.label} width="20" height="20" loading="lazy" decoding="async" />
  )}</span>;
  async function copyHandle() {
    try { await navigator.clipboard.writeText(handle); setCopyMessage("handle copied"); }
    catch { setCopyMessage("couldn’t copy — select the handle above"); }
  }
  return <>
    <button className="ed-discord-card" onClick={() => { setCopyMessage(""); setOpen(true); }} aria-label="Open OKISO’s Discord profile">
      <span className="ed-discord-platform"><span><FaDiscord size={16} /> discord</span><ArrowUpRight size={16} /></span>
      <span className="ed-discord-identity">{portrait}<span className="ed-discord-details"><strong>{displayName}</strong><span className="ed-discord-handle">@{handle}</span>{profileBadges}</span></span>
      {customStatus && <span className="ed-discord-custom-status">{customStatus}</span>}
    </button>
    {open && <EditorialDialog title="discord profile" onClose={() => setOpen(false)}><div className="ed-discord-profile">{portrait}<div className="ed-discord-details"><strong>{displayName}</strong><p className="ed-discord-handle">@{handle}</p>{profileBadges}<span className="ed-label">{statusLabel}</span></div></div>
      {customStatus && <p className="ed-dialog-copy ed-discord-custom-status">{customStatus}</p>}
      {data?.spotify ? <p className="ed-dialog-copy">listening to {data.spotify.song} by {data.spotify.artist}</p> : activity && <p className="ed-dialog-copy">{activity.name}{activity.details ? ` · ${activity.details}` : ""}{activity.state ? ` · ${activity.state}` : ""}</p>}
      <div className="ed-quick-actions"><a className="ed-button" href="https://discord.gg/okiso" target="_blank" rel="noopener noreferrer">join the server <ArrowUpRight size={16} /></a><button className="ed-button" onClick={copyHandle}>copy handle</button></div><p role="status" className="ed-label">{copyMessage}</p>
    </EditorialDialog>}
  </>;
}
