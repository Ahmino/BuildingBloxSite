/**
 * Roblox API utilities.
 *
 * Centralises every external Roblox call so the rest of the app
 * only deals with our own RobloxGame type.
 */

/* ─── Public game config ─────────────────────────────────── */

export interface RobloxGameConfig {
  placeId: string;
  slug: string;
}

/**
 * Master list of games shown on the portfolio page.
 * Add / remove entries here — everything else adapts automatically.
 */
export const GAME_CONFIGS: RobloxGameConfig[] = [
  { placeId: "96645548064314", slug: "Catch-And-Tame" },
  { placeId: "121017808346258", slug: "Build-a-Waterslide" },
  { placeId: "103754275310547", slug: "Hunty-Zombie" },
  { placeId: "114501358617756", slug: "Bridge-Battles" },
  { placeId: "81535567274521", slug: "Bee-Garden" },
  { placeId: "123921593837160", slug: "Climb-and-Jump-Tower" },
  { placeId: "97282163258832", slug: "The-Ultimate-Robloxian" },
  { placeId: "124398083342642", slug: "Ride-A-Cart-Down-A-Slide" },
  { placeId: "137595135496924", slug: "Animal-Hide-Seek" },
  { placeId: "18948446518", slug: "Mr-Mix" },
  { placeId: "128246781105927", slug: "Rate-My-Car" },
];

/* ─── Types returned to the UI ───────────────────────────── */

export interface RobloxGame {
  universeId: number;
  placeId: string;
  name: string;
  description: string;
  playing: number;
  visits: number;
  favoritedCount: number;
  genre: string;
  maxPlayers: number;
  thumbnailUrl: string;
  gameUrl: string;
}

/* ─── API helpers (server-side only) ─────────────────────── */

interface UniverseResponse {
  universeId: number;
}

interface GameData {
  id: number;
  name: string;
  description: string;
  playing: number;
  visits: number;
  favoritedCount: number;
  genre: string;
  maxPlayers: number;
}

interface ThumbnailEntry {
  targetId: number;
  imageUrl: string;
}

/** Resolve a single place ID → universe ID. */
async function resolveUniverse(placeId: string): Promise<number> {
  const res = await fetch(
    `https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
  );
  if (!res.ok) throw new Error(`Failed to resolve universe for place ${placeId}`);
  const data: UniverseResponse = await res.json();
  return data.universeId;
}

/** Fetch game details for a list of universe IDs. */
async function fetchGameDetails(universeIds: number[]): Promise<Map<number, GameData>> {
  const ids = universeIds.join(",");
  const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${ids}`);
  if (!res.ok) throw new Error("Failed to fetch game details");
  const json = await res.json();
  const map = new Map<number, GameData>();
  for (const g of json.data as GameData[]) {
    map.set(g.id, g);
  }
  return map;
}

/** Fetch thumbnail URLs for a list of universe IDs. */
async function fetchThumbnails(universeIds: number[]): Promise<Map<number, string>> {
  const ids = universeIds.join(",");
  const res = await fetch(
    `https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&returnPolicy=PlaceHolder&size=256x256&format=Png&isCircular=false`,
  );
  if (!res.ok) throw new Error("Failed to fetch thumbnails");
  const json = await res.json();
  const map = new Map<number, string>();
  for (const t of json.data as ThumbnailEntry[]) {
    if (t.imageUrl) map.set(t.targetId, t.imageUrl);
  }
  return map;
}

/**
 * Resolve an array of place IDs into full RobloxGame objects.
 * Shared by both fetchAllGames and fetchGamesForPlaceIds.
 */
async function resolveAndFetch(
  configs: RobloxGameConfig[],
): Promise<RobloxGame[]> {
  // 1. Resolve all place IDs → universe IDs in parallel
  const resolved = await Promise.all(
    configs.map(async (cfg) => ({
      ...cfg,
      universeId: await resolveUniverse(cfg.placeId),
    })),
  );

  const universeIds = resolved.map((r) => r.universeId);

  // 2. Fetch details + thumbnails in parallel
  const [detailsMap, thumbMap] = await Promise.all([
    fetchGameDetails(universeIds),
    fetchThumbnails(universeIds),
  ]);

  // 3. Merge into final shape, sorted by live players (highest first)
  const games = resolved.map((r) => {
    const details = detailsMap.get(r.universeId);
    return {
      universeId: r.universeId,
      placeId: r.placeId,
      name: details?.name ?? r.slug.replace(/-/g, " "),
      description: details?.description ?? "",
      playing: details?.playing ?? 0,
      visits: details?.visits ?? 0,
      favoritedCount: details?.favoritedCount ?? 0,
      genre: details?.genre ?? "Unknown",
      maxPlayers: details?.maxPlayers ?? 0,
      thumbnailUrl: thumbMap.get(r.universeId) ?? "",
      gameUrl: `https://www.roblox.com/games/${r.placeId}/${r.slug}`,
    };
  });

  return games.sort((a, b) => b.playing - a.playing);
}

/** Fetch data for the default GAME_CONFIGS list. */
export async function fetchAllGames(): Promise<RobloxGame[]> {
  return resolveAndFetch(GAME_CONFIGS);
}

/** Fetch data for an arbitrary list of place IDs. */
export async function fetchGamesForPlaceIds(placeIds: string[]): Promise<RobloxGame[]> {
  const configs = placeIds.map((id) => ({ placeId: id, slug: "" }));
  return resolveAndFetch(configs);
}

/* ─── Single-link resolver ───────────────────────────────── */

const ROBLOX_URL_RE = /roblox\.com\/games\/(\d+)(?:\/([^\s/?#]+))?/;

/** Extract placeId and slug from a Roblox game URL. */
export function parseRobloxUrl(url: string): { placeId: string; slug: string } | null {
  const match = url.match(ROBLOX_URL_RE);
  if (!match) return null;
  return { placeId: match[1], slug: match[2] ?? "" };
}

/**
 * Given a full Roblox game URL, resolves it into a complete RobloxGame object.
 * Returns null if the URL is invalid or the game can't be found.
 */
export async function resolveGameFromLink(url: string): Promise<RobloxGame | null> {
  const parsed = parseRobloxUrl(url);
  if (!parsed) return null;

  const universeId = await resolveUniverse(parsed.placeId);
  const [detailsMap, thumbMap] = await Promise.all([
    fetchGameDetails([universeId]),
    fetchThumbnails([universeId]),
  ]);

  const details = detailsMap.get(universeId);
  if (!details) return null;

  return {
    universeId,
    placeId: parsed.placeId,
    name: details.name,
    description: details.description,
    playing: details.playing,
    visits: details.visits,
    favoritedCount: details.favoritedCount,
    genre: details.genre,
    maxPlayers: details.maxPlayers,
    thumbnailUrl: thumbMap.get(universeId) ?? "",
    gameUrl: `https://www.roblox.com/games/${parsed.placeId}/${parsed.slug}`,
  };
}
