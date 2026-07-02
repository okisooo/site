// The Vault — hand-curated demos / WIPs / version history.
// This is SEPARATE from releases.ts (which is auto-generated from Spotify).
//
// SECURITY: `minLevel` here is only used to render the UI. Real access control
// MUST be enforced by api.okiso.net — it decides whether to hand back a signed
// URL for a private file. Never trust the client. Private `src` values should
// point at the API (gated), never at a public /vault/ static path.

export const LEVELS = ["public", "friend", "collab", "owner"] as const;
export type Level = (typeof LEVELS)[number];

// Numeric rank for comparisons. Higher = more access.
export const LEVEL_RANK: Record<Level, number> = {
  public: 0,
  friend: 1,
  collab: 2,
  owner: 3,
};

export const LEVEL_LABEL: Record<Level, string> = {
  public: "Public",
  friend: "Friends",
  collab: "Collab",
  owner: "Owner",
};

export type VerKind = "demo" | "wip" | "master" | "preview";

export interface Version {
  id: string;
  label: string; // "v3 — final mix"
  date: string; // ISO date
  kind: VerKind;
  minLevel: Level; // who can play this version
  /**
   * Only preview-mode public samples carry a direct url. Real versions get a
   * short-lived signed URL from api.okiso.net at play time (see lib/vault.ts).
   */
  src?: string;
  note?: string;
  previewOf?: string; // id of the master this clip was cut from
  range?: [number, number]; // [startSec, endSec] — provenance of the preview cut
}

export interface VaultProject {
  slug: string;
  title: string;
  cover?: string;
  accent?: string; // optional per-project accent (hex)
  versions: Version[]; // newest first
}

// helper
export const isPublic = (v: Version) => v.minLevel === "public";

// ── Preview-mode sample data ─────────────────────────────────────────────────
// Mirrors the server manifest shape. Public entries point at audio the site
// already ships, so preview mode can actually play something. Private entries
// have no src — they stay locked until a real login talks to api.okiso.net.
export const vaultProjects: VaultProject[] = [
  {
    slug: "vac",
    title: "VAC",
    cover: "https://i.scdn.co/image/ab67616d0000b27306ee2883ecd53320e7ba6fc5",
    versions: [
      {
        id: "vac-master",
        label: "release master",
        date: "2026-03-02",
        kind: "master",
        minLevel: "public",
        src: "/audio/VAC.mp3",
        note: "out everywhere",
      },
      {
        id: "vac-instrumental",
        label: "instrumental stem",
        date: "2026-02-20",
        kind: "wip",
        minLevel: "owner",
        note: "for remix / sync use",
      },
      {
        id: "vac-spedup",
        label: "sped up cut",
        date: "2026-02-18",
        kind: "wip",
        minLevel: "friend",
        note: "tiktok edit",
      },
      {
        id: "vac-demo",
        label: "VAC D — early demo",
        date: "2026-01-09",
        kind: "demo",
        minLevel: "friend",
        note: "first idea, rough",
      },
    ],
  },
  {
    slug: "prodigy",
    title: "PRODIGY",
    versions: [
      {
        id: "prod-master",
        label: "release master",
        date: "2026-05-21",
        kind: "master",
        minLevel: "public",
        src: "/audio/PRODIGY.mp3",
        note: "out now",
      },
      {
        id: "prod-slowed",
        label: "slowed down",
        date: "2026-05-10",
        kind: "wip",
        minLevel: "friend",
        note: "alt vibe",
      },
    ],
  },
  {
    slug: "ice-cold",
    title: "ice cold",
    versions: [
      {
        id: "ice-master",
        label: "release master",
        date: "2026-04-11",
        kind: "master",
        minLevel: "public",
        src: "/audio/ice cold.mp3",
      },
      {
        id: "ice-spedup",
        label: "sped up",
        date: "2026-04-02",
        kind: "wip",
        minLevel: "friend",
      },
      {
        id: "ice-slowed",
        label: "slowed down",
        date: "2026-04-02",
        kind: "wip",
        minLevel: "collab",
      },
    ],
  },
];
