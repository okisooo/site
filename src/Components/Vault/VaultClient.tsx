"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
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
import { Archivo, JetBrains_Mono, Noto_Sans_JP } from "next/font/google";

const tacDisplay = Archivo({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-tac-display" });
const tacMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tac-mono" });
const tacCjk = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tac-cjk" });

export default function VaultClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setSession(loadSession()); setReady(true); }, []);
  // render immediately for SSR/paint

  return (
    <div className={`${tacDisplay.variable} ${tacMono.variable} ${tacCjk.variable} min-h-screen bg-[var(--tac-bone)] text-[var(--tac-ink)] dark:bg-[#0c0c0e] dark:text-[#f0f0ed] transition-colors duration-500`}>
      <VaultBrowser session={session} onAuthed={setSession} onLogout={() => { clearSession(); setSession(null); }} />
    </div>
  );
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
    <div className="tac-modal-back" onClick={onClose} role="dialog" aria-modal="true">
      <div data-lenis-prevent className="tac-modal tac-plate tac-plate-mark w-full max-w-sm p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="tac-mono text-[10px] text-[var(--tac-signal)] uppercase tracking-[0.3em]">MEMBERS ONLY</p>
            <h2 className="tac-display text-3xl md:text-4xl font-black uppercase tracking-tight text-[var(--tac-ink)] dark:text-[var(--tac-bone)] mt-1">Unlock Access</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20 hover:bg-[var(--tac-signal)] hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="USERNAME"
            autoComplete="username"
            className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2.5 text-sm text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
            type="password"
            autoComplete="current-password"
            className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2.5 text-sm text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono"
          />
          {error && <p className="tac-mono text-xs font-bold text-[var(--tac-signal)] uppercase tracking-wider">{error}</p>}
          <button disabled={busy || !username || !password} className="tac-cta w-full justify-center">{busy && <Loader2 size={15} className="animate-spin" />} ENTER</button>
        </form>
        <p className="tac-mono text-[10px] text-[var(--tac-steel)] mt-4 leading-relaxed uppercase tracking-wider">Friends, collaborators and the artist get keys. Everyone else still gets the public shelf.</p>
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
      showToast("Link copied — send it anywhere");
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
      try { await deleteSnippet(session, version.id); await refresh(); showToast("Teaser removed"); } catch (err) { setMessage(err instanceof Error ? err.message : "Failed."); }
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

      {/* Navigation header */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="tac-cta-ghost bg-[var(--tac-bone)] dark:bg-[#0c0c0e]">
          ← Back
        </Link>
        <Link href="/releases" className="tac-cta">
          Releases →
        </Link>
      </div>

      {/* Editorial header */}
      <header className="mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="tac-sec-head">
              <span className="tac-sec-index">007</span>
              <span className="tac-rule" />
              <span className="tac-sec-label">ARCHIVE / 秘密</span>
            </div>
            <h1 className="tac-h2">
              THE VAULT
              <br />
              <span className="tac-h2-dim">DEMOS & CUTS</span>
            </h1>
            <p className="tac-mono text-xs text-[var(--tac-steel)] uppercase tracking-[0.2em] mt-4">
              demos · versions · cuts — straight from the source
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 pt-2">
            {session ? (
              <div className="flex items-center gap-2">
                <span className="tac-chip border-[var(--tac-signal)] text-[var(--tac-signal)]">
                  {session.name} · {session.level}
                </span>
                <button onClick={onLogout} aria-label="Log out" className="p-2 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 text-[var(--tac-steel)] hover:text-[var(--tac-signal)] hover:border-[var(--tac-signal)] transition-colors"><LogOut size={15} /></button>
              </div>
            ) : (
              <button onClick={() => setLoginOpen(true)} className="tac-cta-ghost"><LogIn size={14} /> UNLOCK</button>
            )}
            {session && permissions.canUpload && (
              <div className="flex items-center gap-2">
                <button onClick={() => setUploadOpen(true)} className="tac-cta"><UploadCloud size={14} /> UPLOAD</button>
                <button onClick={() => setManageOpen((open) => !open)} className="tac-cta-ghost"><Settings2 size={14} /> MANAGE</button>
              </div>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-[rgb(16_16_20_/_0.22)] dark:border-[rgb(240_240_237_/_0.18)]">
          <Stat n={projects.length} label="projects" />
          <Stat n={trackCount} label="tracks" />
          <Stat n={openCount} label="open to you" />
          {!session && (
            <button onClick={() => setLoginOpen(true)} className="ml-auto tac-mono text-[10px] text-[var(--tac-steel)] hover:text-[var(--tac-signal)] uppercase tracking-[0.2em] transition-colors inline-flex items-center gap-1.5">
              <Lock size={10} /> SOME TRACKS ARE LOCKED — GOT A KEY?
            </button>
          )}
        </div>
      </header>

      {uploadOpen && session && <VaultUploadPanel session={session} projects={projects} onClose={() => setUploadOpen(false)} onUploaded={async () => { setUploadOpen(false); await refresh(); }} />}
      {manageOpen && session && <VaultManagerPanel session={session} projects={projects} onSave={saveVersion} onDelete={remove} onSnippet={snippet} onClose={() => setManageOpen(false)} />}
      {message && <div className="mb-5 tac-plate p-4 border-l-4 border-l-[var(--tac-signal)] tac-mono text-xs font-bold text-[var(--tac-signal)] uppercase tracking-wider">{message}</div>}

      {loading ? (
        <div className="py-24 flex justify-center text-[var(--tac-steel)]"><Loader2 className="animate-spin" /></div>
      ) : projects.length === 0 ? (
        <div className="tac-plate border-dashed py-24 text-center">
          <UploadCloud className="mx-auto text-[var(--tac-steel)] mb-3" />
          <h2 className="tac-display font-black text-2xl uppercase tracking-tight text-[var(--tac-ink)] dark:text-[var(--tac-bone)]">Nothing here yet</h2>
          <p className="tac-mono text-xs text-[var(--tac-steel)] uppercase tracking-widest mt-2">First drop coming soon</p>
        </div>
      ) : (
        <div className="space-y-6">
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

      <footer className="mt-16 pt-6 border-t border-[rgb(16_16_20_/_0.22)] dark:border-[rgb(240_240_237_/_0.18)] flex items-center justify-between">
        <p className="tac-mono text-[10px] text-[var(--tac-steel)] uppercase tracking-[0.2em]">Lossless where it counts. Private where it matters.</p>
        <p className="tac-mono text-[10px] text-[var(--tac-steel)] uppercase tracking-[0.2em]">okiso.net</p>
      </footer>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[var(--tac-signal)] text-white tac-mono text-xs uppercase tracking-widest border border-white/30">
          {toast}
        </div>
      )}
    </main>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="tac-display font-black text-2xl text-[var(--tac-ink)] dark:text-[var(--tac-bone)]">{n}</span>
      <span className="tac-mono text-[10px] text-[var(--tac-steel)] uppercase tracking-[0.2em]">{label}</span>
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
    <section data-lenis-prevent className="tac-plate tac-plate-mark p-6 mb-8">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="tac-mono text-xs text-[var(--tac-signal)] uppercase tracking-[0.2em]">Internal Manager</p>
          <h2 className="tac-display font-black text-2xl text-[var(--tac-ink)] dark:text-[var(--tac-bone)] uppercase">Manage Files</h2>
          <p className="tac-mono text-xs text-[var(--tac-steel)] uppercase tracking-wider mt-1">Visibility: <b>listed</b> tracks show a lock to outsiders; <b>hidden</b> tracks don&apos;t exist for them. Teasers are public 30s cuts of locked tracks.</p>
        </div>
        <button onClick={onClose} aria-label="Close file manager" className="p-2 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 text-[var(--tac-steel)] hover:text-[var(--tac-signal)] hover:border-[var(--tac-signal)] transition-colors"><X size={18} /></button>
      </div>
      {manageable.length === 0 ? <p className="tac-mono text-xs text-[var(--tac-steel)] py-10 text-center uppercase tracking-widest">You do not own any manageable files yet.</p> : (
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
    <form onSubmit={submit} className="grid gap-3 items-end border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 bg-black/5 dark:bg-white/5 p-3 md:grid-cols-[1.3fr_0.6fr_0.6fr_auto_1.2fr_auto]">
      <div className="min-w-0">
        <p className="tac-mono text-[10px] text-[var(--tac-signal)] uppercase tracking-[0.2em] truncate">{project.title}</p>
        <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2 text-xs text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono mt-1" aria-label={`Display name for ${version.label}`} />
      </div>
      <select value={kind} onChange={(e) => setKind(e.target.value as Version["kind"])} className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2 text-xs text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono" aria-label="File type">{["demo", "wip", "master", "preview"].map((item) => <option key={item} className="bg-[#0c0c0e] text-[#f0f0ed]">{item}</option>)}</select>
      <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2 text-xs text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono" aria-label="Access level">{allowed.map((item) => <option key={item} className="bg-[#0c0c0e] text-[#f0f0ed]">{item}</option>)}</select>
      <label className="flex items-center gap-2 px-2 tac-mono text-[10px] text-[var(--tac-steel)] uppercase tracking-wider cursor-pointer">
        <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="accent-[var(--tac-signal)]" /> HIDDEN
      </label>
      <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2 text-xs text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono" placeholder="Note" aria-label={`Note for ${version.label}`} />
      <div className="flex gap-2">
        <button disabled={busy} className="p-2 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 text-[var(--tac-steel)] hover:border-[var(--tac-signal)] hover:text-[var(--tac-signal)] transition-colors" aria-label={`Save ${version.label}`}>{busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}</button>
        <button type="button" onClick={() => void onSnippet(version)} className={`p-2 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 transition-colors ${version.hasSnippet ? "border-[var(--tac-signal)] text-[var(--tac-signal)]" : "text-[var(--tac-steel)] hover:border-[var(--tac-signal)] hover:text-[var(--tac-signal)]"}`} title={version.hasSnippet ? "Teaser live — click to remove" : "Cut a public 30s teaser"} aria-label={`Teaser for ${version.label}`}><Scissors size={16} /></button>
        <button type="button" onClick={() => { void navigator.clipboard.writeText(`https://okiso.net/vault?t=${version.id}`); }} className="p-2 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 text-[var(--tac-steel)] hover:border-[var(--tac-signal)] hover:text-[var(--tac-signal)] transition-colors" title="Copy share link" aria-label={`Share ${version.label}`}><Link2 size={16} /></button>
        <button type="button" onClick={() => void onDelete(version)} className="p-2 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 text-[var(--tac-steel)] hover:border-[var(--tac-signal)] hover:text-[var(--tac-signal)] transition-colors" aria-label={`Delete ${version.label}`}><Trash2 size={16} /></button>
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
    <section data-lenis-prevent className="tac-plate tac-plate-mark p-6 mb-8">
      <div className="flex justify-between mb-5">
        <div>
          <h2 className="tac-display font-black text-2xl text-[var(--tac-ink)] dark:text-[var(--tac-bone)] uppercase">Add to the Vault</h2>
          <p className="tac-mono text-xs text-[var(--tac-steel)] uppercase tracking-widest mt-1">Files appear immediately</p>
        </div>
        <button onClick={onClose} aria-label="Close upload panel" className="p-2 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 text-[var(--tac-steel)] hover:text-[var(--tac-signal)] hover:border-[var(--tac-signal)] transition-colors"><X size={18} /></button>
      </div>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3">
        <label className="md:col-span-2 border border-dashed border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 bg-black/5 dark:bg-white/5 p-6 text-center cursor-pointer hover:border-[var(--tac-signal)] transition-colors">
          <UploadCloud className="mx-auto text-[var(--tac-signal)] mb-2" />
          <span className="tac-mono text-xs font-bold text-[var(--tac-ink)] dark:text-[var(--tac-bone)] uppercase tracking-wider">{file?.name || "CHOOSE AN AUDIO FILE"}</span>
          <input type="file" accept="audio/*,.wav,.flac,.aiff,.aif,.m4a,.ogg" className="sr-only" onChange={(e) => { const next = e.target.files?.[0] || null; setFile(next); if (next) setLabel(next.name.replace(/\.[^.]+$/, "")); }} />
        </label>
        <select value={slug} onChange={(e) => pickProject(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2 text-xs text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono"><option value="" className="bg-[#0c0c0e] text-[#f0f0ed]">New project…</option>{projects.map((project) => <option key={project.slug} value={project.slug} className="bg-[#0c0c0e] text-[#f0f0ed]">{project.title}</option>)}</select>
        <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="project-folder" className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2 text-xs text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono" required />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2 text-xs text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono" required />
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Display name" className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2 text-xs text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono" required />
        <select value={kind} onChange={(e) => setKind(e.target.value as Version["kind"])} className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2 text-xs text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono">{["demo", "wip", "master", "preview"].map((item) => <option key={item} className="bg-[#0c0c0e] text-[#f0f0ed]">{item}</option>)}</select>
        <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2 text-xs text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono">{allowed.map((item) => <option key={item} className="bg-[#0c0c0e] text-[#f0f0ed]">{item}</option>)}</select>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="w-full bg-black/5 dark:bg-white/5 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 px-3 py-2 text-xs text-[var(--tac-ink)] dark:text-[var(--tac-bone)] outline-none focus:border-[var(--tac-signal)] tac-mono md:col-span-2" />
        {error && <p className="tac-mono text-xs font-bold text-[var(--tac-signal)] md:col-span-2 uppercase tracking-wider">{error}</p>}
        <button disabled={busy || !file} className="tac-cta md:col-span-2 justify-center">{busy && <Loader2 size={15} className="animate-spin" />} UPLOAD TO VAULT</button>
      </form>
    </section>
  );
}
