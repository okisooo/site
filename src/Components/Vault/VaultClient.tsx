"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Lock, LogOut, Save, Settings2, Trash2, UploadCloud, X } from "lucide-react";
import { LEVEL_RANK, LEVELS, type Level, type VaultProject, type Version } from "@/data/vault";
import {
  BackendUnavailable,
  clearSession,
  deleteVaultVersion,
  fetchManifest,
  loadSession,
  login,
  resolvePlayUrl,
  type Session,
  type VaultPermissions,
  updateVaultVersion,
  uploadVaultFile,
} from "@/lib/vault";
import { VaultStack } from "./VaultStack";

export default function VaultClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setSession(loadSession()); setReady(true); }, []);
  if (!ready) return null;
  if (!session) return <VaultGate onAuthed={setSession} />;
  return <VaultBrowser session={session} onLogout={() => { clearSession(); setSession(null); }} />;
}

function VaultGate({ onAuthed }: { onAuthed: (session: Session) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(null);
    try { onAuthed(await login(username.trim(), password)); }
    catch (err) { setError(err instanceof BackendUnavailable ? "Vault backend is unavailable." : err instanceof Error ? err.message : "Login failed."); }
    finally { setBusy(false); }
  }
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-ba-lg border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
        <div className="w-12 h-12 mb-5 rounded-full bg-ba-pink/15 border border-ba-pink/30 flex items-center justify-center text-ba-pink"><Lock size={19} /></div>
        <p className="text-[11px] text-ba-pink font-black uppercase tracking-[0.24em]">Private archive</p>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white mt-1 mb-6">The Vault</h1>
        <form onSubmit={submit} className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" autoComplete="username" className="vault-field" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" autoComplete="current-password" className="vault-field" />
          {error && <p className="text-xs font-bold text-ba-red">{error}</p>}
          <button disabled={busy || !username || !password} className="vault-primary w-full">{busy && <Loader2 size={15} className="animate-spin" />} Enter vault</button>
        </form>
      </div>
    </main>
  );
}

function VaultBrowser({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [projects, setProjects] = useState<VaultProject[]>([]);
  const [permissions, setPermissions] = useState<VaultPermissions>({ canUpload: false, canManageAll: false });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchManifest(session);
      setProjects(data.projects); setPermissions(data.permissions); setMessage(null);
    } catch (err) { setMessage(err instanceof Error ? err.message : "Failed to load vault."); }
    finally { setLoading(false); }
  }, [session]);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    const tick = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const ended = () => { setPlayingId(null); setProgress(0); };
    audio.addEventListener("timeupdate", tick); audio.addEventListener("ended", ended);
    return () => { audio.removeEventListener("timeupdate", tick); audio.removeEventListener("ended", ended); };
  }, []);

  async function toggle(version: Version) {
    const audio = audioRef.current; if (!audio) return;
    if (playingId === version.id) { audio.pause(); setPlayingId(null); return; }
    const url = await resolvePlayUrl(session, version); if (!url) return;
    audio.src = url; setPlayingId(version.id); setProgress(0);
    try { await audio.play(); } catch { setPlayingId(null); }
  }
  async function rename(version: Version) {
    const label = window.prompt("Display name", version.label); if (!label || label.trim() === version.label) return;
    try { await updateVaultVersion(session, version.id, { label: label.trim() }); await refresh(); }
    catch (err) { setMessage(err instanceof Error ? err.message : "Rename failed."); }
  }
  async function remove(version: Version) {
    if (!window.confirm(`Delete ${version.label}? This removes the stored file too.`)) return;
    try { await deleteVaultVersion(session, version.id); await refresh(); }
    catch (err) { setMessage(err instanceof Error ? err.message : "Delete failed."); }
  }
  async function saveVersion(version: Version, changes: Partial<Pick<Version, "label" | "note" | "kind" | "minLevel">>) {
    try { await updateVaultVersion(session, version.id, changes); await refresh(); }
    catch (err) { setMessage(err instanceof Error ? err.message : "Update failed."); throw err; }
  }

  return (
    <main className="w-full max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <audio ref={audioRef} preload="none" />
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b-4 border-white pb-6 mb-8">
        <div><p className="text-[11px] text-ba-pink font-black uppercase tracking-[0.24em]">Private audio workspace</p><h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">The Vault</h1><p className="text-xs text-white/45 font-bold uppercase tracking-widest mt-2">versions · demos · masters</p></div>
        <div className="flex items-center gap-2">
          {permissions.canUpload && <button onClick={() => setUploadOpen(true)} className="vault-primary"><UploadCloud size={15} /> Upload audio</button>}
          {permissions.canUpload && <button onClick={() => setManageOpen((open) => !open)} className="vault-secondary"><Settings2 size={15} /> Manage files</button>}
          <span className="px-3 py-2 rounded-ba-pill border border-white/15 text-xs font-bold text-white/65 uppercase">{session.name} · {session.level}</span>
          <button onClick={onLogout} aria-label="Log out" className="p-2.5 rounded-full text-white/50 hover:bg-white/10 hover:text-white"><LogOut size={16} /></button>
        </div>
      </header>
      {uploadOpen && <VaultUploadPanel session={session} projects={projects} onClose={() => setUploadOpen(false)} onUploaded={async () => { setUploadOpen(false); await refresh(); }} />}
      {manageOpen && <VaultManagerPanel session={session} projects={projects} onSave={saveVersion} onDelete={remove} onClose={() => setManageOpen(false)} />}
      {message && <div className="mb-5 rounded-ba border border-ba-yellow/30 bg-ba-yellow/10 px-4 py-3 text-sm font-bold text-ba-yellow">{message}</div>}
      {loading ? <div className="py-24 flex justify-center text-white/40"><Loader2 className="animate-spin" /></div> : projects.length === 0 ? <div className="rounded-ba-lg border border-dashed border-white/15 py-24 text-center"><UploadCloud className="mx-auto text-white/25 mb-3" /><p className="font-bold text-white">Nothing here yet</p><p className="text-sm text-white/40 mt-1">Upload the first version to start a project.</p></div> : <div className="space-y-5">{projects.map((project) => <VaultStack key={project.slug} project={project} session={session} playingId={playingId} progress={progress} onToggle={toggle} onRename={rename} onDelete={remove} />)}</div>}
    </main>
  );
}

function VaultManagerPanel({ session, projects, onSave, onDelete, onClose }: {
  session: Session;
  projects: VaultProject[];
  onSave: (version: Version, changes: Partial<Pick<Version, "label" | "note" | "kind" | "minLevel">>) => Promise<void>;
  onDelete: (version: Version) => Promise<void>;
  onClose: () => void;
}) {
  const manageable = projects.flatMap((project) => project.versions.filter((version) => version.canManage).map((version) => ({ project, version })));
  return <section className="vault-panel mb-8"><div className="flex items-start justify-between mb-5"><div><p className="vault-kicker">Internal manager</p><h2 className="text-2xl font-black uppercase">Manage files</h2><p className="vault-muted text-sm mt-1">Edit what people see without renaming stored files.</p></div><button onClick={onClose} aria-label="Close file manager" className="vault-icon-button"><X size={18} /></button></div>{manageable.length === 0 ? <p className="vault-muted py-10 text-center">You do not own any manageable files yet.</p> : <div className="space-y-3">{manageable.map(({ project, version }) => <VaultManagerRow key={version.id} session={session} project={project} version={version} onSave={onSave} onDelete={onDelete} />)}</div>}</section>;
}

function VaultManagerRow({ session, project, version, onSave, onDelete }: {
  session: Session;
  project: VaultProject;
  version: Version;
  onSave: (version: Version, changes: Partial<Pick<Version, "label" | "note" | "kind" | "minLevel">>) => Promise<void>;
  onDelete: (version: Version) => Promise<void>;
}) {
  const [label, setLabel] = useState(version.label), [note, setNote] = useState(version.note || ""), [kind, setKind] = useState(version.kind), [level, setLevel] = useState(version.minLevel), [busy, setBusy] = useState(false);
  const allowed = LEVELS.filter((item) => LEVEL_RANK[item] <= LEVEL_RANK[session.level]);
  async function submit(event: React.FormEvent) { event.preventDefault(); setBusy(true); try { await onSave(version, { label, note, kind, minLevel: level }); } finally { setBusy(false); } }
  return <form onSubmit={submit} className="vault-manager-row"><div className="min-w-0"><p className="vault-kicker truncate">{project.title}</p><input value={label} onChange={(e) => setLabel(e.target.value)} className="vault-field mt-1" aria-label={`Display name for ${version.label}`} /></div><select value={kind} onChange={(e) => setKind(e.target.value as Version["kind"])} className="vault-field" aria-label="File type">{["demo", "wip", "master", "preview"].map((item) => <option key={item}>{item}</option>)}</select><select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="vault-field" aria-label="Access level">{allowed.map((item) => <option key={item}>{item}</option>)}</select><input value={note} onChange={(e) => setNote(e.target.value)} className="vault-field" placeholder="Note" aria-label={`Note for ${version.label}`} /><div className="flex gap-2"><button disabled={busy} className="vault-icon-button" aria-label={`Save ${version.label}`}>{busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}</button><button type="button" onClick={() => void onDelete(version)} className="vault-icon-button vault-danger" aria-label={`Delete ${version.label}`}><Trash2 size={16} /></button></div></form>;
}

function VaultUploadPanel({ session, projects, onClose, onUploaded }: { session: Session; projects: VaultProject[]; onClose: () => void; onUploaded: () => Promise<void> }) {
  const [file, setFile] = useState<File | null>(null), [slug, setSlug] = useState(projects[0]?.slug || ""), [title, setTitle] = useState(projects[0]?.title || ""), [label, setLabel] = useState(""), [note, setNote] = useState("");
  const [kind, setKind] = useState<Version["kind"]>("wip"), [level, setLevel] = useState<Level>(session.level), [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  const allowed = LEVELS.filter((item) => LEVEL_RANK[item] <= LEVEL_RANK[session.level]);
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!file) return; setBusy(true); setError(null); try { await uploadVaultFile(session, { file, projectSlug: slug, projectTitle: title, label, kind, minLevel: level, note }); await onUploaded(); } catch (err) { setError(err instanceof Error ? err.message : "Upload failed."); } finally { setBusy(false); } }
  function pickProject(next: string) { setSlug(next); const project = projects.find((item) => item.slug === next); if (project) setTitle(project.title); }
  return <section className="mb-8 rounded-ba-lg border border-ba-pink/25 bg-zinc-950/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)]"><div className="flex justify-between mb-5"><div><h2 className="text-xl font-black uppercase text-white">Add to vault</h2><p className="text-xs text-white/45 mt-1">Files appear immediately after upload.</p></div><button onClick={onClose} aria-label="Close upload panel" className="text-white/45 hover:text-white"><X /></button></div><form onSubmit={submit} className="grid md:grid-cols-2 gap-3"><label className="md:col-span-2 rounded-ba border border-dashed border-white/20 bg-white/[0.03] p-6 text-center cursor-pointer hover:border-ba-pink/60"><UploadCloud className="mx-auto text-ba-pink mb-2" /><span className="text-sm font-bold text-white">{file?.name || "Choose an audio file"}</span><input type="file" accept="audio/*,.wav,.flac,.aiff,.aif,.m4a,.ogg" className="sr-only" onChange={(e) => { const next = e.target.files?.[0] || null; setFile(next); if (next) setLabel(next.name.replace(/\.[^.]+$/, "")); }} /></label><select value={slug} onChange={(e) => pickProject(e.target.value)} className="vault-field"><option value="">New project…</option>{projects.map((project) => <option key={project.slug} value={project.slug}>{project.title}</option>)}</select><input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="project-folder" className="vault-field" required /><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" className="vault-field" required /><input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Display name" className="vault-field" required /><select value={kind} onChange={(e) => setKind(e.target.value as Version["kind"])} className="vault-field">{["demo", "wip", "master", "preview"].map((item) => <option key={item}>{item}</option>)}</select><select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="vault-field">{allowed.map((item) => <option key={item}>{item}</option>)}</select><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="vault-field md:col-span-2" />{error && <p className="text-xs font-bold text-ba-red md:col-span-2">{error}</p>}<button disabled={busy || !file} className="vault-primary md:col-span-2 justify-center">{busy && <Loader2 size={15} className="animate-spin" />} Upload to vault</button></form></section>;
}
