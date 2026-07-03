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

import type { Level, VaultProject, Version } from "@/data/vault";
import { LEVEL_RANK } from "@/data/vault";

const API_BASE = "https://api.okiso.net/api/vault";
const STORAGE_KEY = "okiso_vault_session";

export interface Session {
  token: string;
  name: string;
  level: Level;
  /** preview = no real backend; private files stay locked. */
  preview?: boolean;
}

export interface VaultPermissions {
  canUpload: boolean;
  canManageAll: boolean;
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
    res = await fetch(`${API_BASE}/auth/login`, {
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

/** Fetch the version manifest the backend deems this user may see. */
export async function fetchManifest(session: Session): Promise<{ projects: VaultProject[]; permissions: VaultPermissions }> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/manifest`, {
      headers: { Authorization: `Bearer ${session.token}` },
    });
  } catch {
    throw new BackendUnavailable("backend not connected");
  }
  if (res.status === 404 || res.status === 501) throw new BackendUnavailable("vault endpoint not deployed");
  if (!res.ok) throw new Error("Failed to load vault.");
  const data = (await res.json()) as { projects: VaultProject[]; permissions?: VaultPermissions };
  return {
    projects: data.projects ?? [],
    permissions: data.permissions ?? { canUpload: session.level === "owner", canManageAll: session.level === "owner" },
  };
}

async function vaultMutation(session: Session, path: string, init: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${session.token}`, ...(init.headers || {}) },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null) as { error?: { message?: string } } | null;
    throw new Error(data?.error?.message || "Vault update failed.");
  }
}

export interface VaultUploadInput {
  file: File;
  projectSlug: string;
  projectTitle: string;
  label: string;
  kind: Version["kind"];
  minLevel: Level;
  note: string;
}

export async function uploadVaultFile(session: Session, input: VaultUploadInput) {
  const body = new FormData();
  body.append("file", input.file);
  body.append("projectTitle", input.projectTitle);
  body.append("label", input.label);
  body.append("kind", input.kind);
  body.append("minLevel", input.minLevel);
  body.append("note", input.note);
  const query = new URLSearchParams({ dir: input.projectSlug, name: input.file.name });
  await vaultMutation(session, `/upload?${query}`, { method: "POST", body });
}

export async function updateVaultVersion(session: Session, id: string, changes: Partial<Pick<Version, "label" | "note" | "kind" | "minLevel">>) {
  await vaultMutation(session, `/versions/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
}

export async function deleteVaultVersion(session: Session, id: string) {
  await vaultMutation(session, `/versions/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/**
 * Resolve a playable URL for a version.
 * - local static src ("/...") -> returned directly (preview-mode sample only).
 * - otherwise -> backend issues a short-lived signed URL after checking level.
 * Returns null when locked or unavailable (caller shows the locked state).
 */
export async function resolvePlayUrl(
  session: Session | null,
  v: Version,
): Promise<string | null> {
  if (v.src && (v.src.startsWith("/") || v.src.startsWith("http"))) return v.src;
  if (!session || session.preview || !session.token) return null; // need real auth
  try {
    const res = await fetch(`${API_BASE}/url`, {
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
