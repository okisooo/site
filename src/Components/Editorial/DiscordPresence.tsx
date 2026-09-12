"use client";

import { useContext, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { useLanyard } from "react-use-lanyard";
import { AmbientMotionContext } from "./AmbientMotion";
import { EditorialDialog } from "./EditorialDialog";

const BADGES = [
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

export default function DiscordPresence() {
  const { data: response } = useLanyard({ userId: "274178934143451137" });
  const ambient = useContext(AmbientMotionContext);
  const [open, setOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const data = response?.data;
  const profile = data?.discord_user;
  const displayName = profile?.global_name || "OKISO";
  const handle = profile?.username || ".oxo";
  const avatarFormat = ambient && profile?.avatar?.startsWith("a_") ? "gif" : "png";
  const avatar = profile?.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${avatarFormat}?size=256` : "/icon.png";
  const decoration = profile?.avatar_decoration_data?.asset;
  const badges = BADGES.filter((badge) => ((profile?.public_flags || 0) & badge.flag) !== 0);
  const customStatus = data?.activities?.find((item) => item.type === 4)?.state;
  const activity = data?.activities?.find((item) => item.type !== 4);
  const status = data?.discord_status;
  const statusLabel = status === "online" ? "online" : status === "idle" ? "away" : status === "dnd" ? "do not disturb" : status === "offline" ? "offline" : "discord profile";
  const portrait = <span className="ed-discord-avatar">
    <img className="ed-discord-avatar-image" src={avatar} alt={`${displayName}’s Discord avatar`} width="80" height="80" />
    {ambient && decoration && <img className="ed-discord-decoration" src={`https://cdn.discordapp.com/avatar-decoration-presets/${decoration}.png`} alt="" width="96" height="96" />}
    {status && <span className="ed-discord-status" data-status={status} role="img" aria-label={statusLabel} title={statusLabel} />}
  </span>;
  const profileBadges = badges.length > 0 && <span className="ed-discord-badges">{badges.map((badge) =>
    <img key={badge.name} src={`https://cdn.jsdelivr.net/gh/merlinfuchs/discord-badges/SVG/${badge.name}.svg`} alt={badge.label} title={badge.label} width="20" height="20" />
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
