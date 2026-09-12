"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanyard } from "react-use-lanyard";
import { EditorialDialog } from "./EditorialDialog";

export default function DiscordPresence() {
  const { data: response } = useLanyard({ userId: "274178934143451137" });
  const [open, setOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const data = response?.data;
  const profile = data?.discord_user;
  const avatar = profile?.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=128` : "/icon.png";
  const activity = data?.activities?.find((item) => item.type !== 4);
  const status = data?.discord_status;
  const statusLabel = status === "online" ? "online" : status === "idle" ? "away" : status === "dnd" ? "do not disturb" : status === "offline" ? "offline" : "discord community";
  async function copyHandle() {
    try { await navigator.clipboard.writeText(profile?.username || ".oxo"); setCopyMessage("handle copied"); }
    catch { setCopyMessage("couldn’t copy — select the handle above"); }
  }
  return <>
    <button className="ed-discord-card" onClick={() => { setCopyMessage(""); setOpen(true); }} aria-label="Open OKISO’s Discord profile">
      <img src={avatar} alt="" width="60" height="60" /><span><small>{statusLabel}</small><strong>come hang out.</strong><small>{data?.spotify ? `listening to ${data.spotify.song}` : activity?.name || "the okiso discord"}</small></span><ArrowUpRight size={20} />
    </button>
    {open && <EditorialDialog title="the okiso discord" onClose={() => setOpen(false)}><div className="ed-discord-profile"><img src={avatar} alt="OKISO’s Discord avatar" width="80" height="80" /><div><strong>{profile?.global_name || "OKISO"}</strong><p>@{profile?.username || ".oxo"}</p><span className="ed-label">{statusLabel}</span></div></div>
      {data?.spotify ? <p className="ed-dialog-copy">listening to {data.spotify.song} by {data.spotify.artist}</p> : activity && <p className="ed-dialog-copy">{activity.name}{activity.details ? ` · ${activity.details}` : ""}{activity.state ? ` · ${activity.state}` : ""}</p>}
      <div className="ed-quick-actions"><a className="ed-button" href="https://discord.gg/okiso" target="_blank" rel="noopener noreferrer">join the server <ArrowUpRight size={16} /></a><button className="ed-button" onClick={copyHandle}>copy handle</button></div><p role="status" className="ed-label">{copyMessage}</p>
    </EditorialDialog>}
  </>;
}
