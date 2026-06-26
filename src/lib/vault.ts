// Vault client. Talks to api.okiso.net for auth + signed file URLs.
//
// ── Backend contract to implement on api.okiso.net ──────────────────────────
// POST /vault/auth/login   body { username, password }
//   -> 200 { token, name, level }   (level is one of LEVELS)
//   -> 401 on bad creds
//   Server stores users { username, passwordHash (argon2id/bcrypt), level }.
//
// POST /vault/url          headers { Authorization: Bearer <token> }  body { id }
//   -> 200 { url, expiresIn }   short-lived signed URL, ONLY if token.level >= version.minLevel
//   -> 403 if the user's level is too low
//   The server is the source of truth for access — never trust minLevel from the client.
//
// GET  /vault/manifest     headers { Authorization: Bearer <token> }  (optional)
//   -> the project/version list filtered to what this user may see.
//   Until this exists we render the local mock from data/vault.ts.

import type { Level, Version } from "@/data/vault";
import { LEVEL_RANK } from "@/data/vault";

const API_BASE = "https://api.okiso.net";
const STORAGE_KEY = "okiso_vault_session";

export interface Session {
  token: string;
  name: string;
  level: Level;
  /** preview = no real backend; private files stay locked. */
  preview?: boolean;
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(s: Session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore quota/private-mode errors */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export class BackendUnavailable extends Error {}

export async function login(username: string, password: string): Promise<Session> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/vault/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    // Network error / endpoint not deployed yet.
    throw new BackendUnavailable("backend not connected");
  }
  if (res.status === 404 || res.status === 501) {
    throw new BackendUnavailable("vault endpoint not deployed");
  }
  if (!res.ok) {
    throw new Error("Wrong username or password.");
  }
  const data = (await res.json()) as { token: string; name: string; level: Level };
  const session: Session = { token: data.token, name: data.name, level: data.level };
  saveSession(session);
  return session;
}

/** Preview/demo session — UI exploration only. Private files stay locked. */
export function enterPreview(level: Level): Session {
  const session: Session = {
    token: "",
    name: `preview · ${level}`,
    level,
    preview: true,
  };
  saveSession(session);
  return session;
}

export function canAccess(session: Session | null, v: Version): boolean {
  const have = session ? LEVEL_RANK[session.level] : 0;
  return have >= LEVEL_RANK[v.minLevel];
}

/**
 * Resolve a playable URL for a version.
 * - public/static src ("/...") -> returned directly.
 * - private ("api:...") -> asks the backend for a signed URL (needs a real session).
 * Returns null when locked or unavailable (caller shows the locked state).
 */
export async function resolvePlayUrl(
  session: Session | null,
  v: Version,
): Promise<string | null> {
  if (v.src.startsWith("/") || v.src.startsWith("http")) return v.src; // public
  if (!session || session.preview || !session.token) return null; // private, no real auth
  try {
    const res = await fetch(`${API_BASE}/vault/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ id: v.id }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { url: string };
    return data.url ?? null;
  } catch {
    return null;
  }
}
