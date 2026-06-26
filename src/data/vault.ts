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
   * Public/preview files: a static path like "/vault/vac/preview.mp3".
   * Private files: an api.okiso.net id/path that returns a signed URL on auth.
   */
  src: string;
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

// ── Mock data (replace src values once api.okiso.net is wired) ──────────────
export const vaultProjects: VaultProject[] = [
  {
    slug: "vac",
    title: "VAC",
    cover: "https://i.scdn.co/image/ab67616d0000b27306ee2883ecd53320e7ba6fc5",
    versions: [
      {
        id: "vac-master",
        label: "v4 — final master",
        date: "2026-03-02",
        kind: "master",
        minLevel: "owner",
        src: "api:vault/vac/master.wav",
        note: "loudness pass + final EQ",
      },
      {
        id: "vac-v3",
        label: "v3 — collab mix",
        date: "2026-02-18",
        kind: "wip",
        minLevel: "collab",
        src: "api:vault/vac/v3.wav",
        note: "sent to mixer",
      },
      {
        id: "vac-preview",
        label: "preview — the hook",
        date: "2026-02-18",
        kind: "preview",
        minLevel: "public",
        src: "/vault/vac/preview.mp3",
        previewOf: "vac-v3",
        range: [42, 62],
      },
      {
        id: "vac-demo",
        label: "v1 — voice memo demo",
        date: "2026-01-09",
        kind: "demo",
        minLevel: "friend",
        src: "api:vault/vac/demo.mp3",
        note: "first idea, rough",
      },
    ],
  },
  {
    slug: "prodigy",
    title: "PRODIGY",
    cover: "https://i.scdn.co/image/ab67616d0000b27306ee2883ecd53320e7ba6fc5",
    versions: [
      {
        id: "prod-master",
        label: "v2 — release master",
        date: "2026-05-21",
        kind: "master",
        minLevel: "public",
        src: "/vault/prodigy/master.mp3",
        note: "out now",
      },
      {
        id: "prod-acappella",
        label: "acappella stem",
        date: "2026-05-10",
        kind: "wip",
        minLevel: "collab",
        src: "api:vault/prodigy/acappella.wav",
        note: "for remixers",
      },
      {
        id: "prod-demo",
        label: "v1 — alt chorus demo",
        date: "2026-04-02",
        kind: "demo",
        minLevel: "friend",
        src: "api:vault/prodigy/demo.mp3",
        note: "scrapped chorus, kinda slaps",
      },
    ],
  },
  {
    slug: "untitled-07",
    title: "untitled_07",
    versions: [
      {
        id: "u7-preview",
        label: "teaser",
        date: "2026-06-20",
        kind: "preview",
        minLevel: "public",
        src: "/vault/untitled-07/teaser.mp3",
        previewOf: "u7-wip",
        range: [0, 15],
      },
      {
        id: "u7-wip",
        label: "v1 — full WIP",
        date: "2026-06-20",
        kind: "wip",
        minLevel: "collab",
        src: "api:vault/untitled-07/wip.wav",
        note: "unreleased, in progress",
      },
    ],
  },
];
