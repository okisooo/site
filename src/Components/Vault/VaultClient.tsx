"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lock, LogOut, KeyRound, Loader2 } from "lucide-react";
import { LEVELS, vaultProjects, type Level, type VaultProject, type Version } from "@/data/vault";
import {
  type Session,
  login,
  loadSession,
  clearSession,
  enterPreview,
  resolvePlayUrl,
  fetchManifest,
  BackendUnavailable,
} from "@/lib/vault";
import { VaultStack } from "./VaultStack";

export default function VaultClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!session) return <VaultGate onAuthed={setSession} />;
  return <VaultBrowser session={session} onLogout={() => { clearSession(); setSession(null); }} />;
}

// ── Login gate ──────────────────────────────────────────────────────────────
function VaultGate({ onAuthed }: { onAuthed: (s: Session) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noBackend, setNoBackend] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const s = await login(username.trim(), password);
      onAuthed(s);
    } catch (err) {
      if (err instanceof BackendUnavailable) {
        setNoBackend(true);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : "Login failed.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-ba-lg border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-ba-pink/15 border border-ba-pink/30 flex items-center justify-center text-ba-pink shadow-ba-glow-pink">
            <Lock size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">The Vault</h1>
            <p className="text-[11px] text-white/45 font-bold uppercase tracking-widest">access required</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            autoComplete="username"
            className="w-full rounded-ba bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-ba-pink/50 transition-colors"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-ba bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-ba-pink/50 transition-colors"
          />
          {error && <p className="text-xs font-bold text-ba-red">{error}</p>}
          <button
            type="submit"
            disabled={busy || !username || !password}
            className="w-full rounded-ba-pill bg-ba-pink text-white font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-ba-pink-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-ba-glow-pink"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
            Enter
          </button>
        </form>

        {noBackend && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-[11px] text-ba-yellow font-bold uppercase tracking-widest mb-1">
              Backend not connected yet
            </p>
            <p className="text-xs text-white/45 mb-3">
              Real login lives on api.okiso.net. Explore the design in preview mode — private files stay locked.
            </p>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onAuthed(enterPreview(lvl as Level))}
                  className="px-3 py-1.5 rounded-ba-pill text-xs font-bold uppercase tracking-wider border border-white/15 text-white/70 hover:border-ba-pink/50 hover:text-white transition-colors"
                >
                  preview · {lvl}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Authed browser ──────────────────────────────────────────────────────────
function VaultBrowser({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [projects, setProjects] = useState<VaultProject[]>(
    session.preview ? vaultProjects : [],
  );
  const [manifestError, setManifestError] = useState<string | null>(null);

  useEffect(() => {
    if (session.preview) return; // use mock data as-is
    fetchManifest(session)
      .then(setProjects)
      .catch((err) => {
        if (err instanceof BackendUnavailable) {
          setManifestError("backend not reachable — showing cached preview");
          setProjects(vaultProjects);
        } else {
          setManifestError(err instanceof Error ? err.message : "failed to load vault");
        }
      });
  }, [session]);

  async function toggle(v: Version) {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingId === v.id) {
      audio.pause();
      setPlayingId(null);
      return;
    }
    const url = await resolvePlayUrl(session, v);
    if (!url) return; // locked / unavailable
    audio.src = url;
    setProgress(0);
    setPlayingId(v.id);
    try {
      await audio.play();
    } catch {
      setPlayingId(null);
    }
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onEnd = () => {
      setPlayingId(null);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <audio ref={audioRef} preload="none" />

      {/* Header */}
      <div className="flex items-end justify-between border-b border-white/10 pb-5 mb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
            The Vault
          </h1>
          <p className="text-xs text-white/45 font-bold uppercase tracking-widest mt-2">
            versions · demos · cuts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-ba-pill border border-ba-pink/30 bg-ba-pink/10 text-ba-pink text-xs font-bold uppercase tracking-wider">
            {session.preview ? "preview" : session.name} · {session.level}
          </span>
          <button
            onClick={onLogout}
            title="Log out"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Stacks */}
      {manifestError && (
        <p className="text-xs font-bold text-ba-yellow mb-4 text-center">{manifestError}</p>
      )}
      {!session.preview && projects.length === 0 && !manifestError && (
        <div className="flex items-center justify-center py-20 text-white/30">
          <Loader2 size={20} className="animate-spin mr-2" /> loading vault…
        </div>
      )}
      <div className="space-y-5">
        {projects.map((p) => (
          <VaultStack
            key={p.slug}
            project={p}
            session={session}
            playingId={playingId}
            progress={progress}
            onToggle={toggle}
          />
        ))}
      </div>

      <p className="text-[11px] text-white/30 mt-10 text-center">
        Private masters served by api.okiso.net only after login — never shipped to this page.
      </p>
    </div>
  );
}
