"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link2, Loader2, Lock, LogIn, LogOut, Save, Scissors, Settings2, Trash2, UploadCloud, X } from "lucide-react";
import { LEVEL_RANK, LEVELS, type Level, type VaultProject, type Version } from "@/data/vault";
import {
  BackendUnavailable,
  clearSession,
  cutSnippet,
  deleteSnippet,
  deleteVaultVersion,
  fetchManifest,
  loadSession,
  login,
  resolvePlayUrl,
  type Session,
  snippetUrl,
  shareUrl,
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
  return <VaultBrowser session={session} onAuthed={setSession} onLogout={() => { clearSession(); setSession(null); }} />;
}

// ── Sign-in modal ────────────────────────────────────────────────────────────
function LoginModal({ onAuthed, onClose }: { onAuthed: (session: Session) => void; onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(null);
    try { onAuthed(await login(username.trim(), password)); onClose(); }
    catch (err) { setError(err instanceof BackendUnavailable ? "Vault backend is unavailable." : err instanceof Error ? err.message : "Login failed."); }
    finally { setBusy(false); }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-ba-lg border border-white/10 bg-zinc-950 p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] text-ba-pink uppercase tracking-[0.3em]">members only</p>
            <h2 className="vault-serif text-4xl text-white mt-1">unlock more.</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" autoComplete="username" className="vault-field" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" autoComplete="current-password" className="vault-field" />
          {error && <p className="text-xs font-bold text-ba-red">{error}</p>}
          <button disabled={busy || !username || !password} className="vault-primary w-full justify-center">{busy && <Loader2 size={15} className="animate-spin" />} Enter</button>
        </form>
        <p className="font-mono text-[10px] text-white/30 mt-4 leading-relaxed">friends, collaborators and the artist get keys. everyone else still gets the public shelf.</p>
      </div>
    </div>
  );
}

// ── Main browser (public-first) ──────────────────────────────────────────────
function VaultBrowser({ session, onAuthed, onLogout }: { session: Session | null; onAuthed: (session: Session) => void; onLogout: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingSnippet, setPlayingSnippet] = useState(false);
  const [progress, setProgress] = useState(0);
  const [projects, setProjects] = useState<VaultProject[]>([]);
  const [permissions, setPermissions] = useState<VaultPermissions>({ canUpload: false, canManageAll: false });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusId, setFocusId] = useState<string | null>(null);

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
    const ended = () => { setPlayingId(null); setPlayingSnippet(false); setProgress(0); };
    audio.addEventListener("timeupdate", tick); audio.addEventListener("ended", ended);
    return () => { audio.removeEventListener("timeupdate", tick); audio.removeEventListener("ended", ended); };
  }, []);

  // Deep link: /vault?t=<version id> focuses (and plays) that track.
  useEffect(() => {
    if (loading || projects.length === 0) return;
    const wanted = new URLSearchParams(window.location.search).get("t");
    if (!wanted || focusId) return;
    for (const project of projects) {
      const v = project.versions.find((item) => item.id === wanted);
      if (v) { setFocusId(wanted); void toggle(v); break; }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, projects]);

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(null), 2200);
  }

  async function toggle(version: Version) {
    const audio = audioRef.current; if (!audio) return;
    if (playingId === version.id) { audio.pause(); setPlayingId(null); setPlayingSnippet(false); return; }
    if (version.locked) {
      if (version.hasSnippet) {
        audio.src = snippetUrl(version.id);
        setPlayingId(version.id); setPlayingSnippet(true); setProgress(0);
        try { await audio.play(); } catch { setPlayingId(null); setPlayingSnippet(false); }
      } else {
        setLoginOpen(true);
      }
      return;
    }
    const url = await resolvePlayUrl(session, version); if (!url) { setLoginOpen(true); return; }
    audio.src = url; setPlayingId(version.id); setPlayingSnippet(false); setProgress(0);
    try { await audio.play(); } catch { setPlayingId(null); }
  }

  function seek(version: Version, fraction: number) {
    const audio = audioRef.current;
    if (!audio || playingId !== version.id || !audio.duration) return;
    audio.currentTime = fraction * audio.duration;
  }

  async function share(version: Version) {
    try {
      await navigator.clipboard.writeText(shareUrl(version.id));
      showToast("link copied — send it anywhere");
    } catch {
      showToast(shareUrl(version.id));
    }
  }

  async function remove(version: Version) {
    if (!session) return;
    if (!window.confirm(`Delete ${version.label}? This removes the stored file too.`)) return;
    try { await deleteVaultVersion(session, version.id); await refresh(); }
    catch (err) { setMessage(err instanceof Error ? err.message : "Delete failed."); }
  }
  async function saveVersion(version: Version, changes: Partial<Pick<Version, "label" | "note" | "kind" | "minLevel" | "hidden">>) {
    if (!session) return;
    try { await updateVaultVersion(session, version.id, changes); await refresh(); }
    catch (err) { setMessage(err instanceof Error ? err.message : "Update failed."); throw err; }
  }
  async function snippet(version: Version) {
    if (!session) return;
    if (version.hasSnippet && window.confirm(`Remove the public teaser for ${version.label}?`)) {
      try { await deleteSnippet(session, version.id); await refresh(); showToast("teaser removed"); } catch (err) { setMessage(err instanceof Error ? err.message : "Failed."); }
      return;
    }
    const raw = window.prompt("Teaser start (seconds into the track)", "0");
    if (raw === null) return;
    const start = Math.max(0, Number(raw) || 0);
    try { await cutSnippet(session, version.id, start, 30); await refresh(); showToast("30s teaser is live — anyone with the link can hear it"); }
    catch (err) { setMessage(err instanceof Error ? err.message : "Snippet failed."); }
  }

  const trackCount = projects.reduce((acc, p) => acc + p.versions.length, 0);
  const openCount = projects.reduce((acc, p) => acc + p.versions.filter((v) => !v.locked).length, 0);

  return (
    <main className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <audio ref={audioRef} preload="none" />
      {loginOpen && <LoginModal onAuthed={(s) => { onAuthed(s); }} onClose={() => setLoginOpen(false)} />}

      {/* Editorial header */}
      <header className="mb-12 md:mb-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] mb-3">okiso · archive</p>
            <h1 className="vault-serif text-6xl md:text-8xl leading-[0.95] text-white">
              the <span className="italic text-ba-pink">vault</span><span className="text-ba-pink">.</span>
            </h1>
            <p className="font-mono text-[11px] text-white/45 uppercase tracking-[0.2em] mt-4">
              demos · versions · cuts — straight from the source
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 pt-2">
            {session ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-3 py-1.5 rounded-ba-pill border border-ba-pink/30 bg-ba-pink/10 text-ba-pink uppercase tracking-widest">{session.name} · {session.level}</span>
                <button onClick={onLogout} aria-label="Log out" className="p-2 rounded-full text-white/45 hover:bg-white/10 hover:text-white"><LogOut size={15} /></button>
              </div>
            ) : (
              <button onClick={() => setLoginOpen(true)} className="vault-secondary"><LogIn size={14} /> unlock</button>
            )}
            {session && permissions.canUpload && (
              <div className="flex items-center gap-2">
                <button onClick={() => setUploadOpen(true)} className="vault-primary"><UploadCloud size={14} /> upload</button>
                <button onClick={() => setManageOpen((open) => !open)} className="vault-secondary"><Settings2 size={14} /> manage</button>
              </div>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10">
          <Stat n={projects.length} label="projects" />
          <Stat n={trackCount} label="tracks" />
          <Stat n={openCount} label="open to you" />
          {!session && (
            <button onClick={() => setLoginOpen(true)} className="ml-auto font-mono text-[10px] text-white/35 hover:text-ba-pink uppercase tracking-[0.2em] transition-colors inline-flex items-center gap-1.5">
              <Lock size={10} /> some tracks are locked — got a key?
            </button>
          )}
        </div>
      </header>

      {uploadOpen && session && <VaultUploadPanel session={session} projects={projects} onClose={() => setUploadOpen(false)} onUploaded={async () => { setUploadOpen(false); await refresh(); }} />}
      {manageOpen && session && <VaultManagerPanel session={session} projects={projects} onSave={saveVersion} onDelete={remove} onSnippet={snippet} onClose={() => setManageOpen(false)} />}
      {message && <div className="mb-5 rounded-ba border border-ba-yellow/30 bg-ba-yellow/10 px-4 py-3 text-sm font-bold text-ba-yellow">{message}</div>}

      {loading ? (
        <div className="py-24 flex justify-center text-white/40"><Loader2 className="animate-spin" /></div>
      ) : projects.length === 0 ? (
        <div className="rounded-ba-lg border border-dashed border-white/15 py-24 text-center">
          <UploadCloud className="mx-auto text-white/25 mb-3" />
          <p className="vault-serif text-2xl text-white">nothing here yet.</p>
          <p className="font-mono text-[11px] text-white/40 uppercase tracking-widest mt-2">first drop coming soon</p>
        </div>
      ) : (
        <div className="space-y-5">
          {projects.map((project) => (
            <VaultStack
              key={project.slug}
              project={project}
              session={session}
              playingId={playingId}
              playingSnippet={playingSnippet}
              progress={progress}
              defaultOpen={!!focusId && project.versions.some((v) => v.id === focusId)}
              onToggle={toggle}
              onSeek={seek}
              onShare={share}
            />
          ))}
        </div>
      )}

      <footer className="mt-16 pt-6 border-t border-white/10 flex items-center justify-between">
        <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em]">lossless where it counts. private where it matters.</p>
        <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em]">okiso.net</p>
      </footer>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-ba-pill bg-ba-pink text-white font-mono text-[11px] uppercase tracking-widest shadow-ba-glow-pink">
          {toast}
        </div>
      )}
    </main>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="vault-serif text-2xl text-white">{n}</span>
      <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

// ── Manager panel ────────────────────────────────────────────────────────────
function VaultManagerPanel({ session, projects, onSave, onDelete, onSnippet, onClose }: {
  session: Session;
  projects: VaultProject[];
  onSave: (version: Version, changes: Partial<Pick<Version, "label" | "note" | "kind" | "minLevel" | "hidden">>) => Promise<void>;
  onDelete: (version: Version) => Promise<void>;
  onSnippet: (version: Version) => Promise<void>;
  onClose: () => void;
}) {
  const manageable = projects.flatMap((project) => project.versions.filter((version) => version.canManage).map((version) => ({ project, version })));
  return (
    <section className="vault-panel mb-8">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="vault-kicker">Internal manager</p>
          <h2 className="vault-serif text-3xl text-white">manage files.</h2>
          <p className="vault-muted text-sm mt-1">Visibility: <b>listed</b> tracks show a lock to outsiders; <b>hidden</b> tracks don&apos;t exist for them. Teasers are public 30s cuts of locked tracks.</p>
        </div>
        <button onClick={onClose} aria-label="Close file manager" className="vault-icon-button"><X size={18} /></button>
      </div>
      {manageable.length === 0 ? <p className="vault-muted py-10 text-center">You do not own any manageable files yet.</p> : (
        <div className="space-y-3">
          {manageable.map(({ project, version }) => (
            <VaultManagerRow key={version.id} session={session} project={project} version={version} onSave={onSave} onDelete={onDelete} onSnippet={onSnippet} />
          ))}
        </div>
      )}
    </section>
  );
}

function VaultManagerRow({ session, project, version, onSave, onDelete, onSnippet }: {
  session: Session;
  project: VaultProject;
  version: Version;
  onSave: (version: Version, changes: Partial<Pick<Version, "label" | "note" | "kind" | "minLevel" | "hidden">>) => Promise<void>;
  onDelete: (version: Version) => Promise<void>;
  onSnippet: (version: Version) => Promise<void>;
}) {
  const [label, setLabel] = useState(version.label), [note, setNote] = useState(version.note || ""), [kind, setKind] = useState(version.kind), [level, setLevel] = useState(version.minLevel), [hidden, setHidden] = useState(!!version.hidden), [busy, setBusy] = useState(false);
  const allowed = LEVELS.filter((item) => LEVEL_RANK[item] <= LEVEL_RANK[session.level]);
  async function submit(event: React.FormEvent) { event.preventDefault(); setBusy(true); try { await onSave(version, { label, note, kind, minLevel: level, hidden }); } finally { setBusy(false); } }
  return (
    <form onSubmit={submit} className="vault-manager-row">
      <div className="min-w-0">
        <p className="vault-kicker truncate">{project.title}</p>
        <input value={label} onChange={(e) => setLabel(e.target.value)} className="vault-field mt-1" aria-label={`Display name for ${version.label}`} />
      </div>
      <select value={kind} onChange={(e) => setKind(e.target.value as Version["kind"])} className="vault-field" aria-label="File type">{["demo", "wip", "master", "preview"].map((item) => <option key={item}>{item}</option>)}</select>
      <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="vault-field" aria-label="Access level">{allowed.map((item) => <option key={item}>{item}</option>)}</select>
      <label className="flex items-center gap-2 px-2 font-mono text-[10px] text-white/60 uppercase tracking-wider cursor-pointer" title="Hidden tracks are invisible to anyone below the access level. Unhidden locked tracks are listed with a lock.">
        <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="accent-[#ff7eb3]" /> hidden
      </label>
      <input value={note} onChange={(e) => setNote(e.target.value)} className="vault-field" placeholder="Note" aria-label={`Note for ${version.label}`} />
      <div className="flex gap-2">
        <button disabled={busy} className="vault-icon-button" aria-label={`Save ${version.label}`}>{busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}</button>
        <button type="button" onClick={() => void onSnippet(version)} className={`vault-icon-button ${version.hasSnippet ? "text-ba-pink" : ""}`} title={version.hasSnippet ? "Teaser live — click to remove" : "Cut a public 30s teaser"} aria-label={`Teaser for ${version.label}`}><Scissors size={16} /></button>
        <button type="button" onClick={() => { void navigator.clipboard.writeText(`https://okiso.net/vault?t=${version.id}`); }} className="vault-icon-button" title="Copy share link" aria-label={`Share ${version.label}`}><Link2 size={16} /></button>
        <button type="button" onClick={() => void onDelete(version)} className="vault-icon-button vault-danger" aria-label={`Delete ${version.label}`}><Trash2 size={16} /></button>
      </div>
    </form>
  );
}

// ── Upload panel ─────────────────────────────────────────────────────────────
function VaultUploadPanel({ session, projects, onClose, onUploaded }: { session: Session; projects: VaultProject[]; onClose: () => void; onUploaded: () => Promise<void> }) {
  const [file, setFile] = useState<File | null>(null), [slug, setSlug] = useState(projects[0]?.slug || ""), [title, setTitle] = useState(projects[0]?.title || ""), [label, setLabel] = useState(""), [note, setNote] = useState("");
  const [kind, setKind] = useState<Version["kind"]>("wip"), [level, setLevel] = useState<Level>(session.level), [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  const allowed = LEVELS.filter((item) => LEVEL_RANK[item] <= LEVEL_RANK[session.level]);
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!file) return; setBusy(true); setError(null); try { await uploadVaultFile(session, { file, projectSlug: slug, projectTitle: title, label, kind, minLevel: level, note }); await onUploaded(); } catch (err) { setError(err instanceof Error ? err.message : "Upload failed."); } finally { setBusy(false); } }
  function pickProject(next: string) { setSlug(next); const project = projects.find((item) => item.slug === next); if (project) setTitle(project.title); }
  return (
    <section className="mb-8 rounded-ba-lg border border-ba-pink/25 bg-zinc-950/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
      <div className="flex justify-between mb-5">
        <div><h2 className="vault-serif text-3xl text-white">add to the vault.</h2><p className="font-mono text-[10px] text-white/45 uppercase tracking-widest mt-1">files appear immediately</p></div>
        <button onClick={onClose} aria-label="Close upload panel" className="text-white/45 hover:text-white"><X /></button>
      </div>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3">
        <label className="md:col-span-2 rounded-ba border border-dashed border-white/20 bg-white/[0.03] p-6 text-center cursor-pointer hover:border-ba-pink/60">
          <UploadCloud className="mx-auto text-ba-pink mb-2" />
          <span className="text-sm font-bold text-white">{file?.name || "Choose an audio file"}</span>
          <input type="file" accept="audio/*,.wav,.flac,.aiff,.aif,.m4a,.ogg" className="sr-only" onChange={(e) => { const next = e.target.files?.[0] || null; setFile(next); if (next) setLabel(next.name.replace(/\.[^.]+$/, "")); }} />
        </label>
        <select value={slug} onChange={(e) => pickProject(e.target.value)} className="vault-field"><option value="">New project…</option>{projects.map((project) => <option key={project.slug} value={project.slug}>{project.title}</option>)}</select>
        <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="project-folder" className="vault-field" required />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" className="vault-field" required />
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Display name" className="vault-field" required />
        <select value={kind} onChange={(e) => setKind(e.target.value as Version["kind"])} className="vault-field">{["demo", "wip", "master", "preview"].map((item) => <option key={item}>{item}</option>)}</select>
        <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="vault-field">{allowed.map((item) => <option key={item}>{item}</option>)}</select>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="vault-field md:col-span-2" />
        {error && <p className="text-xs font-bold text-ba-red md:col-span-2">{error}</p>}
        <button disabled={busy || !file} className="vault-primary md:col-span-2 justify-center">{busy && <Loader2 size={15} className="animate-spin" />} Upload to vault</button>
      </form>
    </section>
  );
}
